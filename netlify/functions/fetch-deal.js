const axios = require('axios');

// --- Helper for Gemini Search with Grounding (Primary Search) ---
const searchWithGemini = async (query, productName) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Google API Key (for Gemini) is not configured.");
        return null;
    }

    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `You are an AI deal-finding engine. Your mission is to analyze the entire internet via Google Search to find the single best consumer deal for a specific smartphone available for purchase from a major, reputable US retailer. Your primary goal is to find a deal from Amazon.com if a good one exists. The "best deal" is the offer with the lowest total cost of ownership, considering price, rebates, gift cards, bundles, and trade-in promotions.

**CRITICAL RULES:**
1. The URL you return MUST be a direct link to a product listing page where the user can make a purchase.
2. Prioritize links from major US e-commerce sites like Amazon, Best Buy, Walmart, Target, or official carrier stores like Verizon, AT&T, T-Mobile, and the manufacturer's own store.
3. **DO NOT** return links to Reddit, news articles, review sites, forums, or any page that is not a direct retail product page.
4. The deal you find MUST be for the **exact model name provided: "${productName}"**. Do not substitute a 'Pro', 'Plus', or 'Ultra' version if it is not in the user's request.

Your final output MUST be a single, clean JSON object. If a valid deal is found, provide a "title" and a "url". The title should be concise and mention the retailer and the key value (e.g., "Amazon - $150 off Unlocked Model" or "Best Buy - $100 Gift Card Included"). If you cannot find a valid retail link that meets these strict criteria, you MUST return a JSON object with the "url" field set to null.

Your entire output must be ONLY the JSON object, with no additional text, formatting, markdown, or explanations.`;
    
    const payload = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
        console.log(`Querying Gemini with a 20-second timeout for: ${query}`);
        const response = await axios.post(GEMINI_API_ENDPOINT, payload, { timeout: 20000 });

        const candidate = response.data.candidates?.[0];
        if (!candidate) {
            console.log("Gemini response did not contain any candidates.");
            return null;
        }

        let textContent = candidate?.content?.parts?.[0]?.text;
        if (textContent) {
            console.log("Received raw text from Gemini:", textContent);
            textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedJson = JSON.parse(textContent);
            
            if (parsedJson.url && parsedJson.title) {
                console.log("Found valid Gemini Deal:", parsedJson.title);
                return { title: `See Deal: ${parsedJson.title}`, url: parsedJson.url };
            } else {
                 console.log("Gemini returned a valid JSON, but the deal/URL was null.");
                 return null;
            }
        }
        
        console.log("Gemini did not return any usable text content.");
        return null;

    } catch (error) {
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("Error during Gemini API call:", errorMessage);
        return null;
    }
};

// --- Helper for Google Custom Search API Fallback ---
const searchGoogle = async (query) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
        console.error("Google Search API credentials are not configured for fallback.");
        return null;
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

    try {
        console.log(`Falling back to Google Custom Search API for query: ${query}`);
        const response = await axios.get(url, { timeout: 8000 });
        const firstResult = response.data.items && response.data.items[0];

        if (firstResult) {
            console.log("Found Google Search result:", firstResult.title);
            return {
                title: `See Offer: ${firstResult.title}`,
                url: firstResult.link,
            };
        }

        console.log("No results from Google Search fallback.");
        return null;
    } catch (error) {
        console.error("Error during Google Search API call:", error.message);
        return null;
    }
};


exports.handler = async (event) => {
  const { productName, storage } = event.queryStringParameters;
  
  const geminiQuery = `User request: Find the best current deal in the United States on the ${productName} (${storage}). Analyze prices, trade-ins, and gift card offers from major US retailers.`;
  const googleApiQuery = `"${productName}" ${storage} sale deal offer promotion`;

  let deal = null;

  try {
    // 1. Try Gemini with Grounding first
    deal = await searchWithGemini(geminiQuery, productName);

    // 2. If Gemini fails, fall back to the standard Google Custom Search API
    if (!deal) {
      console.log("Gemini search failed or found no deal. Falling back to Google Custom Search API.");
      deal = await searchGoogle(googleApiQuery);
    }
  } catch (error) {
    console.error("A critical error occurred during the deal searching process:", error.message);
  }

  // 3. If both APIs fail, create the final failsafe link
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

























