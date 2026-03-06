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
      res.on("end", function() { resolve(data); });
    });
    req.on("error", function(e) { reject(e); });
    req.write(postData);
    req.end();
  });
}

async function callClaude(apiKey, messages, tools) {
  var body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: messages,
  };
  if (tools) body.tools = tools;

  var raw = await apiRequest(apiKey, body);
  return JSON.parse(raw);
}

exports.handler = async function(event, context) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: "API Key fehlt" }) };
  }

  try {
    var messages = [{
      role: "user",
      content: "Suche aktuelle Nachrichten aus Bruehl (Baden) 68782 bei Mannheim. Suche auf bruehl-baden.de, Schwetzinger Zeitung, ffw-bruehl.de und lokalen Quellen. Gib am Ende NUR ein JSON-Array mit 8-12 Nachrichten zurueck im Format: [{\"id\":1, \"title\":\"Titel\", \"date\":\"YYYY-MM-DD\", \"source\":\"gemeinde\", \"category\":\"politik\", \"summary\":\"Zusammenfassung\", \"url\":\"https://...\"}]. Kategorien: politik, kultur, umwelt, feuerwehr, sport, wirtschaft, verkehr, bildung. Quellen: gemeinde, feuerwehr, schwetzinger, presseportal. WICHTIG: Am Ende NUR das JSON-Array ausgeben!"
    }];

    var tools = [{ type: "web_search_20250305", name: "web_search" }];
    var finalText = "";
    var maxRounds = 8;

    for (var round = 0; round < maxRounds; round++) {
      var data = await callClaude(apiKey, messages, tools);

      if (!data.content) break;

      var textParts = "";
      var toolUseBlocks = [];

      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].type === "text" && data.content[i].text) {
          textParts += data.content[i].text;
        }
        if (data.content[i].type === "tool_use") {
          toolUseBlocks.push(data.content[i]);
        }
      }

      finalText += textParts;

      if (data.stop_reason === "end_turn" || toolUseBlocks.length === 0) {
        break;
      }

      messages.push({ role: "assistant", content: data.content });

      var toolResults = [];
      for (var t = 0; t < toolUseBlocks.length; t++) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUseBlocks[t].id,
          content: "OK",
        });
      }
      messages.push({ role: "user", content: toolResults });
    }

    var cleaned = finalText.replace(/```json\n?|```/g, "").trim();
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
      body: JSON.stringify({ news: null, debug: "Kein JSON-Array gefunden", textLength: finalText.length, sample: finalText.substring(0, 500) }),
    };
  } catch (err) {
    return {
      statusCode: 500, headers: headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
