const https = require("https");

function apiRequest(apiKey, body) {
  return new Promise(function(resolve, reject) {
    var postData = JSON.stringify(body);
    var options = {
      hostname: "api.anthropic.com",
      port: 443,
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(postData),
      },
    };
    var req = https.request(options, function(res) {
      var data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error("JSON parse error: " + data.substring(0, 200))); }
      });
    });
    req.on("error", function(e) { reject(e); });
    req.write(postData);
    req.end();
  });
}

exports.handler = async function(event, context) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: headers, body: "" };
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500, headers: headers,
      body: JSON.stringify({ error: "API Key nicht konfiguriert" }),
    };
  }

  try {
    var data = await apiRequest(apiKey, {
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system: "Du bist ein Nachrichten-Aggregator fuer Bruehl (Baden), PLZ 68782. Suche aktuelle Nachrichten und gib sie als reines JSON-Array zurueck. KEIN Markdown, KEINE Erklaerungen, NUR das JSON-Array.",
      messages: [{
        role: "user",
        content: "Suche die neuesten Nachrichten und Meldungen aus Bruehl (Baden) 68782. Durchsuche: bruehl-baden.de, Schwetzinger Zeitung, ffw-bruehl.de. Gib ein JSON-Array mit 8-12 Eintraegen: [{\"id\":1, \"title\":\"...\", \"date\":\"YYYY-MM-DD\", \"source\":\"gemeinde|feuerwehr|schwetzinger|presseportal\", \"category\":\"politik|kultur|umwelt|feuerwehr|sport|wirtschaft|verkehr|bildung\", \"summary\":\"2-3 Saetze\", \"url\":\"https://...\"}]. NUR reines JSON!"
      }],
    });

    var text = "";
    if (data.content) {
      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].type === "text") {
          text += data.content[i].text;
        }
      }
    }

    var cleaned = text.replace(/```json\n?|```/g, "").trim();
    var match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      var news = JSON.parse(match[0]);
      for (var j = 0; j < news.length; j++) { news[j].id = j + 1; }
      return {
        statusCode: 200, headers: headers,
        body: JSON.stringify({ news: news, timestamp: new Date().toISOString() }),
      };
    }

    return {
      statusCode: 200, headers: headers,
      body: JSON.stringify({ news: null, error: "Keine Nachrichten", raw: text.substring(0, 300) }),
    };
  } catch (err) {
    return {
      statusCode: 500, headers: headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
