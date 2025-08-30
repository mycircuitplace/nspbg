import React, { useState, useEffect, useMemo } from 'react';

// --- DATABASE ---
// In a real app, this would be in its own file, e.g., `database.js`
const PRODUCT_DATABASE = [
  // Tier 1: Apple Market Leaders
  { id: 'apple-iphone-16-pro-max', name: 'Apple iPhone 16 Pro Max', storageOptions: ['256GB', '512GB', '1TB'], ecosystem: 'apple', budgetCategory: 'ultra-premium', tags: ['camera', 'performance', 'battery', 'large-screen', 'portraits', 'zoom', 'standard-durability', 'wireless-charge', 'long-support'] },
  { id: 'apple-iphone-16', name: 'Apple iPhone 16', storageOptions: ['128GB', '256GB', '512GB'], ecosystem: 'apple', budgetCategory: 'premium', tags: ['general', 'camera', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'apple-iphone-16-pro', name: 'Apple iPhone 16 Pro', storageOptions: ['128GB', '256GB', '512GB', '1TB'], ecosystem: 'apple', budgetCategory: 'ultra-premium', tags: ['camera', 'performance', 'one-hand', 'portraits', 'zoom', 'standard-durability', 'wireless-charge', 'long-support'] },
  { id: 'apple-iphone-15', name: 'Apple iPhone 15', storageOptions: ['128GB', '256GB', '512GB'], ecosystem: 'apple', budgetCategory: 'mid', tags: ['general', 'camera', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'apple-iphone-16-plus', name: 'Apple iPhone 16 Plus', storageOptions: ['128GB', '256GB', '512GB'], ecosystem: 'apple', budgetCategory: 'premium', tags: ['battery', 'general', 'large-screen', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'apple-iphone-se-3rd-gen', name: 'Apple iPhone SE (3rd Generation)', storageOptions: ['64GB', '128GB', '256GB'], ecosystem: 'apple', budgetCategory: 'entry', tags: ['general', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },

  // Tier 2: Samsung Top Contenders
  { id: 'samsung-galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra', storageOptions: ['256GB', '512GB', '1TB'], ecosystem: 'android', budgetCategory: 'ultra-premium', tags: ['camera', 'performance', 'battery', 'large-screen', 'zoom', 'portraits', 'standard-durability', 'fast-charge', 'wireless-charge', 'stylus', 'long-support'] },
  { id: 'samsung-galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', storageOptions: ['256GB', '512GB', '1TB'], ecosystem: 'android', budgetCategory: 'premium', tags: ['camera', 'performance', 'large-screen', 'zoom', 'standard-durability', 'fast-charge', 'wireless-charge', 'stylus', 'long-support'] },
  { id: 'samsung-galaxy-a16-5g', name: 'Samsung Galaxy A16 5G', storageOptions: ['128GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['battery', 'general', 'large-screen', 'standard-durability', 'medium-support', 'point-and-shoot'] },
  { id: 'samsung-galaxy-s25', name: 'Samsung Galaxy S25', storageOptions: ['128GB', '256GB', '512GB'], ecosystem: 'android', budgetCategory: 'premium', tags: ['general', 'camera', 'performance', 'one-hand', 'standard-durability', 'fast-charge', 'wireless-charge', 'long-support', 'portraits'] },
  { id: 'samsung-galaxy-a56-5g', name: 'Samsung Galaxy A56 5G', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'mid', tags: ['general', 'battery', 'large-screen', 'standard-durability', 'medium-support', 'point-and-shoot'] },
  { id: 'samsung-galaxy-s25-plus', name: 'Samsung Galaxy S25+', storageOptions: ['256GB', '512GB'], ecosystem: 'android', budgetCategory: 'premium', tags: ['battery', 'performance', 'large-screen', 'standard-durability', 'fast-charge', 'wireless-charge', 'long-support', 'portraits'] },
  { id: 'samsung-galaxy-z-flip-6', name: 'Samsung Galaxy Z Flip 6', storageOptions: ['256GB', '512GB'], ecosystem: 'android', budgetCategory: 'ultra-premium', tags: ['general', 'performance', 'one-hand', 'stylish', 'foldable', 'wireless-charge', 'medium-support'] },
  { id: 'samsung-galaxy-a36-5g', name: 'Samsung Galaxy A36 5G', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['general', 'battery', 'large-screen', 'standard-durability', 'medium-support', 'point-and-shoot'] },
  { id: 'samsung-galaxy-a15-5g', name: 'Samsung Galaxy A15 5G', storageOptions: ['128GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['general', 'battery', 'large-screen', 'standard-durability', 'short-support', 'point-and-shoot'] },

  // Tier 3: The Best of the Rest
  { id: 'google-pixel-9-pro', name: 'Google Pixel 9 Pro', storageOptions: ['128GB', '256GB', '512GB', '1TB'], ecosystem: 'android', budgetCategory: 'ultra-premium', tags: ['camera', 'general', 'portraits', 'large-screen', 'standard-durability', 'wireless-charge', 'long-support', 'zoom'] },
  { id: 'google-pixel-9', name: 'Google Pixel 9', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'premium', tags: ['camera', 'general', 'one-hand', 'portraits', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'google-pixel-8a', name: 'Google Pixel 8a', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'mid', tags: ['camera', 'general', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'motorola-moto-g-stylus-2024', name: 'Motorola Moto G Stylus (2024)', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['general', 'battery', 'large-screen', 'standard-durability', 'stylus', 'short-support', 'point-and-shoot'] },
  { id: 'motorola-moto-g-power-2024', name: 'Motorola Moto G Power (2024)', storageOptions: ['128GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['battery', 'general', 'large-screen', 'standard-durability', 'short-support', 'point-and-shoot'] },

  // Tier 4: Rounding out the list
  { id: 'apple-iphone-14', name: 'Apple iPhone 14', storageOptions: ['128GB', '256GB', '512GB'], ecosystem: 'apple', budgetCategory: 'mid', tags: ['general', 'camera', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'samsung-galaxy-s23-fe', name: 'Samsung Galaxy S23 FE', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'mid', tags: ['general', 'performance', 'large-screen', 'standard-durability', 'wireless-charge', 'medium-support', 'zoom'] },
  { id: 'google-pixel-8', name: 'Google Pixel 8', storageOptions: ['128GB', '256GB'], ecosystem: 'android', budgetCategory: 'mid', tags: ['camera', 'general', 'one-hand', 'standard-durability', 'wireless-charge', 'long-support', 'point-and-shoot'] },
  { id: 'oneplus-13', name: 'OnePlus 13', storageOptions: ['256GB', '512GB'], ecosystem: 'android', budgetCategory: 'ultra-premium', tags: ['performance', 'battery', 'large-screen', 'heavy-gaming', 'standard-durability', 'fast-charge', 'medium-support'] },
  { id: 'tcl-40-x-5g', name: 'TCL 40 X 5G', storageOptions: ['128GB'], ecosystem: 'android', budgetCategory: 'entry', tags: ['general', 'large-screen', 'standard-durability', 'short-support', 'point-and-shoot'] },
];

// --- RECOMMENDATION LOGIC ---
const getRecommendations = (answers) => {
    const { primaryUse, budget, ecosystem, screenSize, cameraPriority, gaming, brand, durability, chargingStyle, extraFeatures, longevity, storage } = answers;

    let filteredProducts = PRODUCT_DATABASE;

    // 1. Hard filter by brand first if specified
    if (brand && brand !== 'any') {
        if (brand === 'apple' || brand === 'samsung') {
            filteredProducts = filteredProducts.filter(p => p.ecosystem === brand);
        }
    }

    const storageMap = {
        light: 128,
        average: 256,
        power: 512,
    };
    const requiredStorage = storageMap[storage] || 0;

    const scoredProducts = filteredProducts.map(product => {
        let score = 0;

        // 2. Score based on ranked priorities (weighted)
        if (primaryUse) {
            primaryUse.forEach((priority, index) => {
                const weight = 4 - index;
                if (product.tags.includes(priority)) score += weight;
            });
        }
        
        if (cameraPriority) {
            cameraPriority.forEach((priority, index) => {
                const weight = 3 - index;
                if (product.tags.includes(priority)) score += weight;
            });
        }

        // 3. Score based on strong preferences
        if (product.budgetCategory === budget) score += 10;
        if (ecosystem !== 'none' && product.ecosystem === ecosystem) score += 5;
        if (screenSize && product.tags.includes(screenSize)) score += 4;
        if (gaming && product.tags.includes(gaming)) score += 5;
        if (durability && product.tags.includes(durability)) score += 3;
        if (chargingStyle && product.tags.includes(chargingStyle)) score += 3;
        if (extraFeatures && product.tags.includes(extraFeatures)) score += 5;
        if (longevity && product.tags.includes(longevity)) score += 6;

        // 4. Score based on storage and determine recommended storage
        const maxStorage = Math.max(...product.storageOptions.map(s => parseInt(s)));
        if (maxStorage >= requiredStorage) {
            score += 4;
        }

        let recommendedStorage = product.storageOptions[0];
        for (const option of product.storageOptions) {
            const storageValue = parseInt(option);
            if (storageValue >= requiredStorage) {
                recommendedStorage = option;
                break;
            }
        }
        if (parseInt(recommendedStorage) < requiredStorage) {
            recommendedStorage = product.storageOptions[product.storageOptions.length - 1];
        }

        return { ...product, score, recommendedStorage };
    });

    // Sort products by score in descending order
    scoredProducts.sort((a, b) => b.score - a.score);

    // Return the top 3 recommendations
    return scoredProducts.slice(0, 3);
};


// --- Helper Components ---
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const Header = () => (
    <header className="text-center p-4 bg-[#002D3E] shadow-md">
        <img 
            src="https://circuit.place/wp-content/uploads/2025/08/CPLogo-Either2.png" 
            alt="Circuit.Place Logo" 
            className="h-10 mx-auto"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x40/002D3E/FFFFFF?text=Circuit.Place'; }}
        />
    </header>
);

// --- Question Components ---
const OptionCard = ({ option, onSelect, isSelected }) => (<div onClick={() => onSelect(option.id)} className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 h-full ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'}`}><div className="flex justify-between items-start"><div><h3 className="text-lg font-semibold text-gray-800">{option.title}</h3><p className="text-gray-600 mt-1">{option.description}</p></div>{isSelected && (<div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center ml-4 flex-shrink-0"><CheckIcon /></div>)}</div></div>);
const Question = ({ question, onAnswer, currentAnswer }) => (<div className="mb-12"><h2 className="text-2xl font-bold text-gray-800 mb-2">{question.text}</h2><p className="text-gray-500 mb-6">{question.subtext}</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{question.options.map(option => (<OptionCard key={option.id} option={option} onSelect={() => onAnswer(question.id, option.id)} isSelected={currentAnswer === option.id} />))}</div></div>);
const RankedOptionCard = ({ option, onSelect, rank }) => { const isSelected = rank > 0; const rankSuffix = ['st', 'nd', 'rd', 'th'][rank - 1] || 'th'; return (<div onClick={() => !isSelected && onSelect(option.id)} className={`p-6 border rounded-xl transition-all duration-200 relative h-full ${isSelected ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-gray-200 bg-white cursor-pointer hover:border-green-400 hover:shadow-md'}`}>{isSelected && (<div className="absolute -top-3 -left-3 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">{rank}<span className="text-xs -mt-1">{rankSuffix}</span></div>)}<div><h3 className="text-lg font-semibold text-gray-800">{option.title}</h3><p className="text-gray-600 mt-1">{option.description}</p></div></div>); };
const RankedQuestion = ({ question, onAnswer, currentAnswer = [] }) => { const handleSelect = (optionId) => { if (currentAnswer.length < question.options.length) { const newAnswer = [...currentAnswer, optionId]; onAnswer(question.id, newAnswer); } }; const handleReset = () => { onAnswer(question.id, []); }; return (<div className="mb-12"><div className="flex justify-between items-center mb-2"><h2 className="text-2xl font-bold text-gray-800">{question.text}</h2>{currentAnswer.length > 0 && (<button onClick={handleReset} className="px-4 py-1 text-sm font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-all">Reset Priorities</button>)}</div><p className="text-gray-500 mb-6">{question.subtext}</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{question.options.map(option => { const rank = currentAnswer.indexOf(option.id) + 1; return (<RankedOptionCard key={option.id} option={option} onSelect={handleSelect} rank={rank} />); })}</div></div>); };

// --- Question Definitions ---
const JOURNEY_QUESTIONS = [
    { id: 'primaryUse', type: 'ranked', text: "What's most important to you in a phone?", subtext: "Please select in order of priority, from 1st (most important) to 4th.", options: [ { id: 'camera', title: "Taking Photos & Videos", description: "Capturing memories in the best quality." }, { id: 'performance', title: "Gaming & Heavy Apps", description: "A super-fast phone that can handle anything." }, { id: 'battery', title: "All-Day Battery Life", description: "Lasts from morning to night without worry." }, { id: 'general', title: "Simplicity & Everyday Use", description: "Social media, browsing, email. The basics, done well." }, ] },
    { id: 'screenSize', type: 'single', text: "What's your ideal screen size?", subtext: "Think about how you prefer to hold and use your phone.", options: [ { id: 'one-hand', title: "Compact & One-Handed", description: "I want a phone that's easy to use with one hand." }, { id: 'large-screen', title: "Large & Immersive", description: "I want a big screen for movies, games, and multitasking." } ] },
    { id: 'cameraPriority', type: 'ranked', text: "What kind of photos are most important?", subtext: "Please rank your photo preferences from 1st to 3rd.", options: [ { id: 'portraits', title: "Portraits of People & Pets", description: "I love taking photos with that blurry background effect." }, { id: 'zoom', title: "Subjects Far Away", description: "I often take photos at concerts, sporting events, or of nature." }, { id: 'point-and-shoot', title: "Quick & Easy Shots", description: "I just want a reliable camera that takes great pictures without fuss." } ] },
    { id: 'gaming', type: 'single', text: "How much do you game on your phone?", subtext: "Be honest! This helps us decide how much power you really need.", options: [ { id: 'heavy-gaming', title: "Graphically Intense Games", description: "I play games like Genshin Impact, Call of Duty, or other demanding 3D titles." }, { id: 'casual-gaming', title: "Casual & Puzzle Games", description: "I mostly play games like Candy Crush, Wordle, or Sudoku." } ] },
    { id: 'storage', type: 'single', text: "How much storage do you typically need?", subtext: "Think about how many photos, videos, and apps you keep on your phone.", options: [ { id: 'light', title: "Light User (128GB)", description: "I mostly stream media and keep a moderate amount of photos and apps." }, { id: 'average', title: "Average User (256GB)", description: "I download music, take lots of photos/videos, and have many apps." }, { id: 'power', title: "Power User (512GB+)", description: "I download everything and rarely delete files. I need maximum space." } ] },
    { id: 'durability', type: 'single', text: "How do you feel about phone durability?", subtext: "Consider your typical environment and how you handle your devices.", options: [ { id: 'rugged', title: "Maximum Protection", description: "I'm prone to drops or work outdoors. I need it to be tough." }, { id: 'standard-durability', title: "Standard Durability is Fine", description: "I'm generally careful and will use a case." }, { id: 'stylish', title: "Style Over Ruggedness", description: "I prefer a slim, sleek design, even if it's more fragile." } ] },
    { id: 'chargingStyle', type: 'single', text: "What's your charging style?", subtext: "This helps us pick a phone that matches your daily routine.", options: [ { id: 'fast-charge', title: "Fastest Charge Possible", description: "I often need a quick power boost in the middle of the day." }, { id: 'wireless-charge', title: "Wireless Convenience", description: "I prefer setting my phone down on a pad to charge." }, { id: 'battery-life-priority', title: "Don't Care, Just Last", description: "I don't mind how it charges, as long as the battery is huge." } ] },
    { id: 'extraFeatures', type: 'single', text: "Are you interested in features beyond the basics?", subtext: "This helps identify if you're a 'power user' who would appreciate special tools.", options: [ { id: 'stylus', title: "A Built-in Stylus", description: "For taking notes, drawing, or precise control." }, { id: 'foldable', title: "A Foldable Screen", description: "I'm intrigued by a phone that opens up into a larger tablet." }, { id: 'standard', title: "Just a Standard Smartphone", description: "I don't need any extra bells and whistles." } ] },
    { id: 'longevity', type: 'single', text: "How long do you plan to keep this phone?", subtext: "This determines the importance of long-term software and security updates.", options: [ { id: 'long-support', title: "As Long as Possible (4+ years)", description: "I want a phone that will stay secure and up-to-date for years." }, { id: 'medium-support', title: "A Few Years (2-3 years)", description: "I'll likely upgrade within a few years." }, { id: 'short-support', title: "I Upgrade Frequently (1-2 years)", description: "Long-term support isn't a major factor for me." } ] },
    { id: 'budget', type: 'single', text: "What's your budget?", subtext: "We have great options for every price range.", options: [ { id: 'entry', title: "Value-Focused (Under $400)", description: "Looking for the best bang for my buck." }, { id: 'mid', title: "Mid-Range ($400 - $800)", description: "A great balance of features and price." }, { id: 'premium', title: "Premium ($800 - $1200)", description: "I want excellent features and build quality." }, { id: 'ultra-premium', title: "Ultra-Premium ($1200+)", description: "I want the absolute best, regardless of price." }, ] },
    { id: 'ecosystem', type: 'single', text: "Do you use other Apple or Android products?", subtext: "Your other devices (laptops, watches) can work seamlessly with your phone.", options: [ { id: 'apple', title: "Yes, I use Apple products", description: "I have a Mac, iPad, or Apple Watch." }, { id: 'android', title: "Yes, I use Android/Windows", description: "I have a Windows PC or Android tablet." }, { id: 'none', title: "Doesn't Matter to Me", description: "I'm starting fresh or don't mind switching." }, ] },
    { id: 'brand', type: 'single', text: "Any brand preference?", subtext: "Sometimes you just know what you like. Let us know if you have a strong preference.", options: [ { id: 'apple', title: "Show me iPhones only", description: "I'm committed to the Apple ecosystem." }, { id: 'samsung', title: "Show me Samsung phones only", description: "I've had good experiences with Samsung in the past." }, { id: 'any', title: "Show me the best fit, any brand", description: "I'm open to all options that match my needs." } ] }
];


// --- Results Component ---
const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
    </div>
);

const ResultsDisplay = ({ answers }) => {
    const recommendations = useMemo(() => getRecommendations(answers), [answers]);
    const [deals, setDeals] = useState({});

    const fetchBestDeal = async (productName, storage) => {
        // --- MOCK API CALL ---
        // In a real application, this function would make a network request to a backend service
        // that performs the web search. For this prototype, we're simulating the delay and result.
        console.log(`Searching for: best deal on ${productName} ${storage}`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                const mockUrl = `https://www.google.com/search?q=best+deal+on+${encodeURIComponent(productName)}+${encodeURIComponent(storage)}`;
                const mockTitle = `Best Deal at Retailer`;
                resolve({ url: mockUrl, title: mockTitle });
            }, 1500 + Math.random() * 1000); // Simulate a random network delay
        });
    };

    useEffect(() => {
        const fetchAllDeals = async () => {
            const initialDealsState = recommendations.reduce((acc, product) => {
                acc[product.id] = { isLoading: true, data: null, progress: 0 };
                return acc;
            }, {});
            setDeals(initialDealsState);

            for (const product of recommendations) {
                let progressInterval = setInterval(() => {
                    setDeals(prev => {
                        if (!prev[product.id]) return prev;
                        return {
                            ...prev,
                            [product.id]: { ...prev[product.id], progress: Math.min(prev[product.id].progress + 20, 90) }
                        }
                    });
                }, 200);

                const dealData = await fetchBestDeal(product.name, product.recommendedStorage);
                
                clearInterval(progressInterval);

                setDeals(prev => ({
                    ...prev,
                    [product.id]: { isLoading: false, data: dealData, progress: 100 }
                }));
            }
        };

        if (recommendations.length > 0) {
            fetchAllDeals();
        }
    }, [recommendations]);

    const primaryUseMap = { camera: "Taking Photos & Videos", performance: "Gaming & Heavy Apps", battery: "All-Day Battery Life", general: "Simplicity & Everyday Use" };
    const getMatchReason = (product) => { const userPriorities = answers.primaryUse; for(let i = 0; i < userPriorities.length; i++) { if (product.tags.includes(userPriorities[i])) { return `A great fit for your #${i+1} priority: ${primaryUseMap[userPriorities[i]]}.`; } } return "A solid all-around choice."; };
    
    return (<div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"><h2 className="text-3xl font-bold text-gray-800 mb-2">Your Top Recommendations</h2><p className="text-gray-600 mb-8">Based on your preferences, here are the top 3 phones we think you'll love.</p><div className="space-y-6">{recommendations.map((product, index) => (<div key={product.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-md"><div className="flex flex-col sm:flex-row gap-6"><div className="flex-shrink-0"><div className={`w-16 h-16 text-white rounded-full flex items-center justify-center font-bold text-3xl ${index === 0 ? 'bg-blue-600' : 'bg-gray-700'}`}>{index + 1}</div></div><div className="flex-grow"><h3 className="text-2xl font-bold text-gray-800">{product.name}</h3><p className="text-blue-600 font-semibold mt-1">{`Recommended Storage: ${product.recommendedStorage}`}</p><p className="text-green-700 font-semibold mt-1 mb-3">{getMatchReason(product)}</p><div className="text-sm"><span className="font-semibold text-gray-600">All Available Options: </span>{product.storageOptions.join(' / ')}</div><div className="mt-4">{deals[product.id]?.isLoading ? (<div><p className="text-sm text-gray-500 mb-2">Finding best deal...</p><ProgressBar progress={deals[product.id].progress} /></div>) : deals[product.id]?.data ? (<a href={deals[product.id].data.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all">{`Best Deal Available`}</a>) : (<p className="text-sm text-gray-500">No deals found at this time.</p>)}</div></div></div></div>))}</div></div>);
};


export default function App() {
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    
    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    // This effect handles the pre-selection logic
    useEffect(() => {
        if (answers.ecosystem === 'apple' && answers.brand !== 'apple') {
            setAnswers(prev => ({ ...prev, brand: 'apple' }));
        }
    }, [answers.ecosystem]);


    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const allQuestionsAnswered = 
        answers.primaryUse?.length === 4 &&
        answers.screenSize &&
        answers.cameraPriority?.length === 3 &&
        answers.gaming &&
        answers.storage &&
        answers.durability &&
        answers.chargingStyle &&
        answers.extraFeatures &&
        answers.longevity &&
        answers.budget &&
        answers.ecosystem &&
        answers.brand;

    const handleShowResults = () => {
        if (allQuestionsAnswered) {
            setIsFinished(true);
        }
    };
    
    const handleReset = () => {
        setAnswers({});
        setIsFinished(false);
    }

    return (
        <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-4xl">
                {!isFinished ? (
                    <div>
                        {JOURNEY_QUESTIONS.map(q => {
                            if (q.type === 'ranked') {
                                return ( <RankedQuestion key={q.id} question={q} onAnswer={handleAnswer} currentAnswer={answers[q.id]} /> );
                            }
                            return ( <Question key={q.id} question={q} onAnswer={handleAnswer} currentAnswer={answers[q.id]} /> );
                        })}
                        <div className="text-center mt-8">
                            <button onClick={handleShowResults} disabled={!allQuestionsAnswered} className={`px-12 py-4 text-lg font-bold text-white rounded-lg transition-all ${allQuestionsAnswered ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}>
                                See My Results
                            </button>
                            {!allQuestionsAnswered && (<p className="text-gray-500 mt-2">Please answer all questions to continue.</p>)}
                        </div>
                    </div>
                ) : (
                    <div>
                        <ResultsDisplay answers={answers} />
                         <div className="text-center mt-8">
                            <button onClick={handleReset} className="px-8 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
