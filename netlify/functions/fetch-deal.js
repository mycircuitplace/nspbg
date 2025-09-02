    const axios = require('axios');
    const { ApifyClient } = require('apify-client');
    
    // --- Helper for Apify Slickdeals Search ---
    const searchSlickdeals = async (query) => {
        const apifyClient = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
        
        // Actor ID for powerai/slickdeals-search-scraper
        const actorId = 'powerai/slickdeals-search-scraper';
    
        console.log(`Starting Apify actor for query: ${query}`);
        const run = await apifyClient.actor(actorId).call({ search: query, limit: 5 });
        
        console.log(`Apify actor run initiated. Waiting for results...`);
        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
        
        // Find the first deal that is not marked as expired
        // We assume the scraper provides an 'expired' field. Adjust if the field name is different.
        const activeDeal = items.find(item => item.url && !item.expired); 
        
        if (activeDeal) {
            console.log("Found active Slickdeal:", activeDeal.title);
            return {
                title: `Deal on Slickdeals: ${activeDeal.title}`,
                url: activeDeal.url,
            };
        }
        
        console.log("No active Slickdeals found.");
        return null;
    };
    
    // --- Helper for Google Search Fallback ---
    const searchGoogle = async (query) => {
        const apiKey = process.env.GOOGLE_API_KEY;
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
    
        console.log(`Falling back to Google Search for query: ${query}`);
        const response = await axios.get(url);
        const firstResult = response.data.items && response.data.items[0];
    
        if (firstResult) {
            console.log("Found Google Search result:", firstResult.title);
            return {
                title: `Best Deal: ${firstResult.title}`,
                url: firstResult.link,
            };
        }
    
        console.log("No results from Google Search fallback.");
        throw new Error('No search results found from Google fallback.');
    };
    
    
    exports.handler = async (event) => {
      const { productName, storage } = event.queryStringParameters;
      
      if (!process.env.APIFY_API_TOKEN || !process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
        console.error("Missing one or more API keys in environment variables.");
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Server configuration error." }),
        };
      }
    
      const slickdealsQuery = `${productName} ${storage}`;
      const googleQuery = `best price for "${productName}" ${storage}`;
    
      try {
        let deal = await searchSlickdeals(slickdealsQuery);
        
        if (!deal) {
          deal = await searchGoogle(googleQuery);
        }
    
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deal }),
        };
    
      } catch (error) {
        console.error("Error in fetch-deal handler:", error.message);
        // If even the fallback fails, return a generic error or a direct Google search link
         return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
    };
    

