// File: netlify/functions/fetch-deal.js
const axios = require('axios');

exports.handler = async (event) => {
  // Get the secret keys from Netlify's environment variables
  const API_KEY = process.env.GOOGLE_API_KEY;
  const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

  // Get the productName and storage from the request URL
  const { productName, storage } = event.queryStringParameters;

  if (!productName || !storage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'productName and storage are required' }),
    };
  }

  const searchQuery = `best deal on ${productName} ${storage}`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await axios.get(url);
    const items = response.data.items;

    if (items && items.length > 0) {
      const topResult = items[0];
      const deal = {
        url: topResult.link,
        title: topResult.title,
      };
      return {
        statusCode: 200,
        body: JSON.stringify(deal),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No deals found' }),
      };
    }
  } catch (error) {
    console.error('Error performing Google search:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch deals' }),
    };
  }
};