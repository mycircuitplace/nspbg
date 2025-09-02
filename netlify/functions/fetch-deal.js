const axios = require('axios');
const { ApifyClient } = require('apify-client');

// --- Helper for Apify Slickdeals Search ---
const searchSlickdeals = async (query) => {
    if (!process.env.APIFY_API_TOKEN) {
        console.error("Apify API Token is not configured.");
        return null; // Return null to allow fallback, don't throw error
    }
    const apifyClient = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
    const actorId = 'powerai/slickdeals-search-scraper';

    try {
        console.log(`Starting Apify actor for query: ${query}`);
        const run = await apifyClient.actor(actorId).call({ search: query, limit: 5 });
        
        console.log(`Apify actor run initiated. Waiting for results...`);
        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
        
        const firstDeal = items.find(item => item.url); 
        
        if (firstDeal) {
            console.log("Found Slickdeal:", firstDeal.title);
            return {
                title: `Deal: ${firstDeal.title}`,
                url: firstDeal.url,
            };
        }
        
        console.log("No Slickdeals found for the query.");
        return null;
    } catch (error) {
        console.error("Error during Apify Slickdeals search:", error.message);
        return null; // Return null on error to allow fallback
    }
};

// --- Helper for Google Search Fallback ---
const searchGoogle = async (query) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
        console.error("Google Search API credentials are not configured.");
        return null;
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

    try {
        console.log(`Falling back to Google Search for query: ${query}`);
        const response = await axios.get(url);
        const firstResult = response.data.items && response.data.items[0];

        if (firstResult) {
            console.log("Found Google Search result:", firstResult.title);
            return {
                title: `See Deal: ${firstResult.title}`,
                url: firstResult.link,
            };
        }

        console.log("No results from Google Search fallback.");
        return null;
    } catch (error) {
        console.error("Error during Google Search API call:", error.message);
        return null; // Return null on error to allow final fallback
    }
};


exports.handler = async (event) => {
  const { productName, storage } = event.queryStringParameters;
  
  const slickdealsQuery = `${productName} ${storage}`;
  const googleApiQuery = `best price for "${productName}" ${storage}`;

  let deal = null;

  try {
    // 1. Try Slickdeals
    deal = await searchSlickdeals(slickdealsQuery);

    // 2. If no Slickdeals deal, try Google API
    if (!deal) {
      console.log("Slickdeals returned no results. Falling back to Google Search API.");
      deal = await searchGoogle(googleApiQuery);
    }
  } catch (error) {
    console.error("A critical error occurred during the deal searching process:", error.message);
    // This catch is for unexpected errors; normal failures are handled by returning null.
  }

  // 3. If deal is STILL null after all attempts, create the final fallback link
  if (!deal) {
    console.log("All API providers failed. Creating a generic Google search link as the final fallback.");
    const genericGoogleQuery = `best deal on ${productName} ${storage}`;
    deal = {
      title: "Find Best Deal on Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(genericGoogleQuery)}`,
    };
  }

  // Always return a successful response with a deal object
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal }),
  };
};





