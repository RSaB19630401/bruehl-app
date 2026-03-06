exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: "API Key nicht konfiguriert" }),
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: "Du bist ein Nachrichten-Aggregator fuer Bruehl (Baden), PLZ 68782, Rhein-Neckar-Kreis. Suche aktuelle Nachrichten und gib sie als reines JSON-Array zurueck. KEIN Markdown, KEINE Erklaerungen, NUR das JSON-Array.",
        messages: [{
          role: "user",
          content: "Suche die neuesten Nachrichten, Meldungen und Veranstaltungen aus Bruehl (Baden) 68782 bei Mannheim/Schwetzingen. Durchsuche: bruehl-baden.de, Schwetzinger Zeitung Bruehl, ffw-bruehl.de, Presseportal Mannheim. Gib ein JSON-Array mit 8-12 Eintraegen zurueck: [{\"id\":1, \"title\":\"...\", \"date\":\"YYYY-MM-DD\", \"source\":\"gemeinde|feuerwehr|schwetzinger|presseportal\", \"category\":\"politik|kultur|umwelt|feuerwehr|sport|wirtschaft|verkehr|bildung\", \"summary\":\"2-3 Saetze\", \"url\":\"https://...\"}]. Sortiere nach Datum absteigend. NUR reines JSON!"
        }],
      }),
    });

    const data = await response.json();
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
      for (var j = 0; j < news.length; j++) {
        news[j].id = j + 1;
      }
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ news: news, timestamp: new Date().toISOString() }),
      };
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ news: null, error: "Keine Nachrichten gefunden" }),
    };
  } catch (err) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: "API-Fehler: " + err.message }),
    };
  }
};
