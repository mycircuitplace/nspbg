const axios = require('axios');
const { ApifyClient } = require('apify-client');

// --- Helper for Apify Slickdeals Search ---
const searchSlickdeals = async (query) => {
    if (!process.env.APIFY_API_TOKEN) {
        console.error("Apify API Token is not configured.");
        return null; // Don't throw an error, just return null to allow fallback
    }
    const apifyClient = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
    
    // Actor ID for powerai/slickdeals-search-scraper
    const actorId = 'powerai/slickdeals-search-scraper';

    console.log(`Starting Apify actor for query: ${query}`);
    const run = await apifyClient.actor(actorId).call({ search: query, limit: 5 });
    
    console.log(`Apify actor run initiated. Waiting for results...`);
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
    
    // We will take the first result that has a URL, assuming the scraper prioritizes active deals.
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
};

// --- Helper for Google Search Fallback ---
const searchGoogle = async (query) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
        throw new Error("Google Search API credentials are not configured.");
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

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
    // Throwing an error here is important so the handler knows it failed.
    throw new Error('No search results found from Google fallback.');
};


exports.handler = async (event) => {
  const { productName, storage } = event.queryStringParameters;
  
  const slickdealsQuery = `${productName} ${storage}`;
  const googleQuery = `best price for "${productName}" ${storage}`;

  let deal = await searchSlickdeals(slickdealsQuery);

  // If the Slickdeals search didn't find anything, try the Google search.
  if (!deal) {
    try {
      console.log("Slickdeals returned no results. Falling back to Google Search.");
      deal = await searchGoogle(googleQuery);
    } catch (googleError) {
      // This will only trigger if the Google search also fails.
      console.error("Google Search fallback also failed:", googleError.message);
      
      // As the final fallback, create a generic Google search link.
      // The front-end is already set up to do this when the function fails, 
      // but we will send an explicit error for clarity.
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "All search providers failed." }),
      };
    }
  }

  // If we have a deal from either Slickdeals or Google, return it.
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal }),
  };
};



