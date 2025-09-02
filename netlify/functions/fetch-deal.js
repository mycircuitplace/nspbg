const axios = require('axios');
const { ApifyClient } = require('apify-client');

// --- Helper for Apify Slickdeals Search ---
const searchSlickdeals = async (query) => {
    if (!process.env.APIFY_API_TOKEN) {
        console.error("Apify API Token is not configured.");
        return null; // Return null to allow fallback
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
            return { title: `Deal: ${firstDeal.title}`, url: firstDeal.url };
        }
        console.log("No Slickdeals found for the query.");
        return null;
    } catch (error) {
        console.error("Error during Apify Slickdeals search:", error.message);
        return null; // Return null on error to allow fallback
    }
};

// --- Helper for Gemini Search with Grounding ---
const searchWithGemini = async (query) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Google API Key (for Gemini) is not configured.");
        return null;
    }

    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `You are an AI deal-finding engine. Your mission is to analyze the entire internet via Google Search to find the single best consumer deal for a specific smartphone. The "best deal" is defined as the offer with the lowest total cost of ownership. You must consider all factors, including: upfront price, mail-in rebates, included gift cards, bundled accessories (like chargers or earbuds), and carrier-specific trade-in promotions. Prioritize deals from major, reputable retailers. Your final output MUST be a single, clean JSON object containing only a "title" and a "url". The title should be concise and mention the retailer and the key value proposition (e.g., "Verizon - $800 off with Trade-in" or "Best Buy - $100 Gift Card Included"). The URL must lead directly to the deal page. Your entire output must be ONLY the JSON object, with no additional text, formatting, markdown, or explanations.`;
    const payload = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
        console.log(`Querying Gemini with a 30-second timeout for: ${query}`);
        const response = await axios.post(GEMINI_API_ENDPOINT, payload, { timeout: 30000 });

        const candidate = response.data.candidates?.[0];
        if (!candidate) {
            console.log("Gemini response did not contain any candidates. This could be due to safety filters.");
            return null;
        }

        let textContent = candidate?.content?.parts?.[0]?.text;
        if (textContent) {
            console.log("Received raw text from Gemini:", textContent);
            textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedJson = JSON.parse(textContent);
            if (parsedJson.url && parsedJson.title) {
                console.log("Found Gemini Deal:", parsedJson.title);
                return { title: `See Deal: ${parsedJson.title}`, url: parsedJson.url };
            }
        }
        
        console.log("Gemini did not return a usable JSON deal.");
        return null;

    } catch (error) {
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("Error during Gemini API call:", errorMessage);
        return null;
    }
};


exports.handler = async (event) => {
  const { productName, storage } = event.queryStringParameters;
  
  const slickdealsQuery = `${productName} ${storage}`;
  const geminiQuery = `User request: Find the best current deal on the ${productName} (${storage}). Analyze prices, trade-ins, and gift card offers from major retailers.`;

  let deal = null;

  try {
    // 1. Try Slickdeals
    deal = await searchSlickdeals(slickdealsQuery);

    // 2. If no Slickdeals deal, try Gemini with Grounding
    if (!deal) {
      console.log("Slickdeals returned no results. Falling back to Gemini API.");
      deal = await searchWithGemini(geminiQuery);
    }
  } catch (error) {
    console.error("A critical error occurred during the deal searching process:", error.message);
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











