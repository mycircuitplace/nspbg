const axios = require('axios');

// --- AFFILIATE LINK TRANSFORMATION LOGIC ---
const transformToAffiliateLink = (url, affiliateIds) => {
    if (!url) return null;

    try {
        const urlObj = new URL(url);

        // Amazon Associates Transformation
        if (urlObj.hostname.includes('amazon.com') && affiliateIds.amazon) {
            urlObj.searchParams.set('tag', affiliateIds.amazon);
            console.log(`Transformed to Amazon affiliate link: ${urlObj.toString()}`);
            return urlObj.toString();
        }
        
        // CJ Affiliate (for Verizon, AT&T, etc.) Transformation
        const cjDomains = ['verizon.com', 'att.com', 't-mobile.com'];
        if (cjDomains.some(domain => urlObj.hostname.includes(domain)) && affiliateIds.cj) {
            const encodedUrl = encodeURIComponent(url);
            // This is a standard CJ deep link format. The "URL" parameter points to the deal page.
            const cjLink = `https://www.anrdoezrs.net/click-${affiliateIds.cj}-10451_?URL=${encodedUrl}`;
            console.log(`Transformed to CJ affiliate link: ${cjLink}`);
            return cjLink;
        }

    } catch (error) {
        console.error("Could not transform URL:", error.message);
        return url; // Return original URL if transformation fails
    }

    return url; // Return original if no match
};

// --- Helper for Gemini Search with Grounding (Primary Search) ---
const searchWithGemini = async (query, productName) => {
    // ... (previous Gemini search logic remains the same)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Google API Key (for Gemini) is not configured.");
        return null;
    }

    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `You are an AI deal-finding engine. Your mission is to analyze the entire internet via Google Search to find the single best consumer deal for a specific smartphone available from a US retailer. The "best deal" is the offer with the lowest total cost of ownership, considering price, rebates, gift cards, bundles, and trade-in promotions from major, reputable US retailers. **It is critical that the deal you find is for the exact model name provided: "${productName}". Do not substitute a 'Pro', 'Plus', or 'Ultra' version if it is not in the user's request.** Your final output MUST be a single, clean JSON object. If a valid deal is found, provide a "title" and a "url". The title should be concise and mention the retailer and the key value (e.g., "Verizon - $800 off with Trade-in"). The URL must lead directly to the deal page. If after a thorough search you cannot find any specific, active deals for the correct model, you MUST return a JSON object with the "url" field set to null, for example: {"title": "No specific deals found", "url": null}. Do not return a standard full-price retail listing. Your entire output must be ONLY the JSON object, with no additional text, formatting, markdown, or explanations.`;
    
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
    // ... (previous Google search logic remains the same)
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

  const affiliateIds = {
      amazon: process.env.AMAZON_ASSOCIATE_ID,
      cj: process.env.CJ_PID
  };
  
  const geminiQuery = `User request: Find the best current deal in the United States on the ${productName} (${storage}). Analyze prices, trade-ins, and gift card offers from major US retailers.`;
  const googleApiQuery = `"${productName}" ${storage} sale deal offer promotion`;

  let deal = null;

  try {
    deal = await searchWithGemini(geminiQuery, productName);

    if (!deal) {
      console.log("Gemini search failed. Falling back to Google Custom Search API.");
      deal = await searchGoogle(googleApiQuery);
    }
  } catch (error) {
    console.error("A critical error occurred during the deal searching process:", error.message);
  }

  if (!deal) {
    console.log("All API providers failed. Creating a generic Google search link.");
    const genericGoogleQuery = `best deal on ${productName} ${storage}`;
    deal = {
      title: "Find Best Deal on Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(genericGoogleQuery)}`,
    };
  } else {
    // If a deal was found, try to transform it into an affiliate link
    deal.url = transformToAffiliateLink(deal.url, affiliateIds);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal }),
  };
};























