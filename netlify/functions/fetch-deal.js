const axios = require('axios');

exports.handler = async (event) => {
  const { productName, storage } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  // Verify that the necessary environment variables are set
  if (!apiKey || !searchEngineId) {
    console.error("Missing Google API Key or Search Engine ID");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error." }),
    };
  }

  const query = `best price for "${productName}" ${storage}`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    const firstResult = response.data.items && response.data.items[0];

    if (!firstResult) {
      throw new Error(`No search results found for: ${query}`);
    }

    const deal = {
      title: `Best Deal: ${firstResult.title}`,
      url: firstResult.link,
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal }),
    };
  } catch (error) {
    console.error("Error fetching deal:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
