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

exports.handler = async function(event, context) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY nicht gesetzt", hint: "Netlify > Site configuration > Environment variables" }) };
  }

  try {
    var rawResponse = await apiRequest(apiKey, {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: "Antworte nur mit: HALLO TEST"
      }],
    });

    return {
      statusCode: 200, headers: headers,
      body: JSON.stringify({ debug: true, keyStart: apiKey.substring(0, 10) + "...", rawResponse: rawResponse.substring(0, 1000) }),
    };
  } catch (err) {
    return {
      statusCode: 500, headers: headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
