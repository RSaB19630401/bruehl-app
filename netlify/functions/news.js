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
    req.setTimeout(9000, function() { req.destroy(); reject(new Error("Timeout")); });
    req.write(postData);
    req.end();
  });
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

  var today = new Date().toISOString().split("T")[0];

  try {
    var raw = await apiRequest(apiKey, {
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "Du bist ein Nachrichten-Generator fuer die Gemeinde Bruehl (Baden), PLZ 68782, Rhein-Neckar-Kreis. Heute ist " + today + ". Erstelle basierend auf deinem Wissen ueber Bruehl (Baden) aktuelle und realistische Nachrichten. Antworte NUR mit einem JSON-Array, ohne Markdown, ohne Erklaerungen.",
      messages: [{
        role: "user",
        content: "Erstelle 10 aktuelle Nachrichten-Eintraege fuer Bruehl (Baden) 68782. Nutze dein Wissen ueber die Gemeinde, den Gemeinderat, die Feuerwehr, Vereine (FV 1918, TV Bruehl), Schulen (Schillerschule), Freibad, Veranstaltungen und lokale Themen. Mische verschiedene Quellen und Kategorien. Datumsangaben sollen aktuell sein (rund um " + today + "). Format als JSON-Array: [{\"id\":1, \"title\":\"...\", \"date\":\"YYYY-MM-DD\", \"source\":\"gemeinde|feuerwehr|schwetzinger|presseportal\", \"category\":\"politik|kultur|umwelt|feuerwehr|sport|wirtschaft|verkehr|bildung\", \"summary\":\"2-3 Saetze.\", \"url\":\"https://www.bruehl-baden.de/\"}]. NUR JSON!"
      }],
    });

    var data = JSON.parse(raw);
    var text = "";
    if (data.content) {
      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].type === "text") {
          text += data.content[i].text;
        }
      }
    }

    var cleaned = text.replace(/```json\n?|```/g, "").trim();
    var match = cleaned.match
