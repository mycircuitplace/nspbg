import React, { useState, useEffect } from 'react';

// Product Database
const PRODUCT_DATABASE = [
    // --- iPhones ---
    {
        id: 'iphone-16-pro-max',
        name: 'Apple iPhone 16 Pro Max',
        ecosystem: 'apple',
        budgetCategory: 'ultra-premium',
        tags: ['performance', 'battery', 'camera', 'zoom', 'large-screen', 'gaming-pro', 'rugged', 'fast-charge', 'wireless-charge', 'long-support'],
        storageOptions: ['256GB', '512GB', '1TB'],
    },
    {
        id: 'iphone-16',
        name: 'Apple iPhone 16',
        ecosystem: 'apple',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'camera', 'point-and-shoot', 'small-screen', 'gaming-casual', 'standard-durability', 'wireless-charge', 'long-support'],
        storageOptions: ['128GB', '256GB', '512GB'],
    },
    {
        id: 'iphone-16-pro',
        name: 'Apple iPhone 16 Pro',
        ecosystem: 'apple',
        budgetCategory: 'premium',
        tags: ['performance', 'camera', 'zoom', 'small-screen', 'gaming-pro', 'rugged', 'fast-charge', 'wireless-charge', 'long-support'],
        storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    },
    {
        id: 'iphone-15',
        name: 'Apple iPhone 15',
        ecosystem: 'apple',
        budgetCategory: 'standard',
        tags: ['performance', 'camera', 'point-and-shoot', 'small-screen', 'gaming-casual', 'standard-durability', 'wireless-charge', 'long-support'],
        storageOptions: ['128GB', '256GB', '512GB'],
    },
    {
        id: 'iphone-16-plus',
        name: 'Apple iPhone 16 Plus',
        ecosystem: 'apple',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'camera', 'point-and-shoot', 'large-screen', 'gaming-casual', 'standard-durability', 'wireless-charge', 'long-support'],
        storageOptions: ['128GB', '256GB', '512GB'],
    },
    {
        id: 'iphone-se',
        name: 'Apple iPhone SE (3rd Gen)',
        ecosystem: 'apple',
        budgetCategory: 'budget',
        tags: ['performance', 'point-and-shoot', 'small-screen', 'standard-durability', 'wireless-charge', 'long-support'],
        storageOptions: ['64GB', '128GB', '256GB'],
    },

    // --- Samsung Phones ---
    {
        id: 'samsung-galaxy-s25-ultra',
        name: 'Samsung Galaxy S25 Ultra',
        ecosystem: 'android',
        budgetCategory: 'ultra-premium',
        tags: ['performance', 'battery', 'camera', 'zoom', 'portraits', 'large-screen', 'gaming-pro', 'rugged', 'fast-charge', 'wireless-charge', 'stylus', 'long-support'],
        storageOptions: ['256GB', '512GB', '1TB'],
    },
     {
        id: 'samsung-galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'camera', 'zoom', 'portraits', 'large-screen', 'gaming-pro', 'rugged', 'fast-charge', 'wireless-charge', 'stylus', 'long-support'],
        storageOptions: ['256GB', '512GB', '1TB'],
    },
    {
        id: 'samsung-galaxy-a16',
        name: 'Samsung Galaxy A16 5G',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['battery', 'point-and-shoot', 'large-screen', 'standard-durability', 'long-support-average'],
        storageOptions: ['128GB'],
    },
    {
        id: 'samsung-galaxy-s25',
        name: 'Samsung Galaxy S25',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'camera', 'portraits', 'small-screen', 'gaming-casual', 'standard-durability', 'fast-charge', 'wireless-charge', 'long-support'],
        storageOptions: ['128GB', '256GB'],
    },
    {
        id: 'samsung-galaxy-a56',
        name: 'Samsung Galaxy A56 5G',
        ecosystem: 'android',
        budgetCategory: 'standard',
        tags: ['battery', 'camera', 'point-and-shoot', 'large-screen', 'standard-durability', 'fast-charge', 'long-support-average'],
        storageOptions: ['128GB', '256GB'],
    },
    {
        id: 'samsung-galaxy-s25-plus',
        name: 'Samsung Galaxy S25+',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'camera', 'portraits', 'large-screen', 'gaming-casual', 'standard-durability', 'fast-charge', 'wireless-charge', 'long-support'],
        storageOptions: ['256GB', '512GB'],
    },
    {
        id: 'samsung-galaxy-z-flip-6',
        name: 'Samsung Galaxy Z Flip 6',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'camera', 'point-and-shoot', 'small-screen', 'gaming-casual', 'style-focus', 'wireless-charge', 'foldable', 'long-support-average'],
        storageOptions: ['256GB', '512GB'],
    },
    {
        id: 'samsung-galaxy-a36',
        name: 'Samsung Galaxy A36 5G',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['battery', 'point-and-shoot', 'large-screen', 'standard-durability', 'long-support-average'],
        storageOptions: ['128GB'],
    },
     {
        id: 'samsung-galaxy-a15',
        name: 'Samsung Galaxy A15 5G',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['battery', 'point-and-shoot', 'large-screen', 'standard-durability', 'long-support-average'],
        storageOptions: ['128GB'],
    },


    // --- Google & Other Phones ---
    {
        id: 'google-pixel-9-pro',
        name: 'Google Pixel 9 Pro',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'camera', 'portraits', 'point-and-shoot', 'large-screen', 'gaming-casual', 'standard-durability', 'fast-charge', 'wireless-charge', 'extra-features', 'long-support'],
        storageOptions: ['128GB', '256GB', '512GB'],
    },
    {
        id: 'google-pixel-9',
        name: 'Google Pixel 9',
        ecosystem: 'android',
        budgetCategory: 'standard',
        tags: ['performance', 'camera', 'point-and-shoot', 'small-screen', 'standard-durability', 'fast-charge', 'wireless-charge', 'extra-features', 'long-support'],
        storageOptions: ['128GB', '256GB'],
    },
    {
        id: 'google-pixel-8a',
        name: 'Google Pixel 8a',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['performance', 'camera', 'point-and-shoot', 'small-screen', 'standard-durability', 'wireless-charge', 'extra-features', 'long-support'],
        storageOptions: ['128GB'],
    },
    {
        id: 'motorola-moto-g-stylus-2024',
        name: 'Motorola Moto G Stylus (2024)',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['battery', 'point-and-shoot', 'large-screen', 'standard-durability', 'stylus', 'long-support-average'],
        storageOptions: ['128GB', '256GB'],
    },
     {
        id: 'motorola-moto-g-power-2024',
        name: 'Motorola Moto G Power (2024)',
        ecosystem: 'android',
        budgetCategory: 'budget',
        tags: ['battery', 'point-and-shoot', 'large-screen', 'standard-durability', 'long-support-average'],
        storageOptions: ['128GB'],
    },
    {
        id: 'oneplus-13',
        name: 'OnePlus 13',
        ecosystem: 'android',
        budgetCategory: 'premium',
        tags: ['performance', 'battery', 'gaming-pro', 'large-screen', 'standard-durability', 'fast-charge', 'long-support-average'],
        storageOptions: ['256GB', '512GB'],
    },
];

// Optimized Question Order
const questions = [
    { id: 'priorities', text: 'What\'s most important to you in a phone? (Rank your top 4)', type: 'ranked-choice', options: [{ id: 'camera', text: 'Amazing Photos & Videos' }, { id: 'performance', text: 'Speed & Power' }, { id: 'battery', text: 'All-Day Battery Life' }, { id: 'price', text: 'Best Value for Money' }] },
    { id: 'budget', text: 'What\'s your approximate budget?', type: 'single-choice', options: [{ id: 'budget', text: 'Under $400' }, { id: 'standard', text: '$400 - $800' }, { id: 'premium', text: '$800 - $1200' }, { id: 'ultra-premium', text: '$1200+' }] },
    { id: 'ecosystem', text: 'Are you part of a tech ecosystem?', type: 'single-choice', options: [{ id: 'apple', text: 'Yes, I use Apple products (Mac, Watch, etc.)' }, { id: 'android', text: 'Yes, I use Google/Android products (Windows, etc.)' }, { id: 'none', text: 'No, I\'m open to anything' }] },
    { id: 'screenSize', text: 'What size phone do you prefer?', type: 'single-choice', options: [{ id: 'small-screen', text: 'Compact & One-Handed' }, { id: 'large-screen', text: 'Large & Immersive' }] },
    { id: 'storage', text: 'How much storage do you typically need?', type: 'single-choice', options: [{ id: 'light', text: 'Light User (Apps, photos, some music)' }, { id: 'average', text: 'Average User (Lots of photos, videos, apps)' }, { id: 'power', text: 'Power User (Downloads everything, shoots 4K video)' }] },
    { id: 'cameraPrio', text: 'What kind of photos are most important? (Rank your choices)', type: 'ranked-choice', options: [{ id: 'portraits', text: 'People & Portraits' }, { id: 'zoom', text: 'Subjects Far Away' }, { id: 'point-and-shoot', text: 'Quick Point-and-Shoot' }] },
    { id: 'gaming', text: 'Do you play games on your phone?', type: 'single-choice', options: [{ id: 'gaming-pro', text: 'Yes, graphically intense games' }, { id: 'gaming-casual', text: 'Yes, but mostly casual games' }, { id: 'none', text: 'Not really' }] },
    { id: 'longevity', text: 'How long do you plan to keep this phone?', type: 'single-choice', options: [{ id: 'long-support', text: 'For as long as it works (4+ years)' }, { id: 'long-support-average', text: 'For a few years (2-3 years)' }, { id: 'none', text: 'I like to upgrade frequently (1-2 years)' }] },
    { id: 'durability', text: 'How do you feel about phone durability?', type: 'single-choice', options: [{ id: 'rugged', text: 'I need maximum protection' }, { id: 'standard-durability', text: 'Standard durability is fine' }, { id: 'style-focus', text: 'I prioritize style over ruggedness' }] },
    { id: 'charging', text: 'What\'s your charging style?', type: 'single-choice', options: [{ id: 'fast-charge', text: 'I want the fastest charge possible' }, { id: 'wireless-charge', text: 'I prefer wireless charging convenience' }, { id: 'battery', text: 'I just want the longest-lasting battery' }] },
    { id: 'features', text: 'Are you interested in features beyond the basics?', type: 'single-choice', options: [{ id: 'stylus', text: 'Yes, a built-in stylus for notes' }, { id: 'foldable', text: 'Yes, I\'m intrigued by foldable phones' }, { id: 'extra-features', text: 'Yes, advanced software features' }, { id: 'none', text: 'No, just the standard experience' }] },
];

const backgroundStyle = {
  backgroundColor: '#f9fafb', // equivalent to bg-gray-50
  backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3Crect width="20" height="20" fill="%23f9fafb"/%3E%3Ccircle cx="1" cy="1" r="1" fill="%23e5e7eb"/%3E%3C/svg%3E')`,
};

const getRecommendations = (answers) => {
    let scores = {};

    PRODUCT_DATABASE.forEach(phone => {
        scores[phone.id] = 0;

        // Ecosystem check is important. If a user is in the Apple ecosystem, only recommend iPhones.
        if (answers.ecosystem === 'apple' && phone.ecosystem !== 'apple') {
            scores[phone.id] -= 1000; // Heavily penalize non-Apple phones for Apple users
        } else if (answers.ecosystem === 'android' && phone.ecosystem !== 'android') {
             scores[phone.id] -= 1000; // Optional: Penalize non-Android for Android users
        } else {
             scores[phone.id] += 20;
        }

        // Budget
        if (answers.budget === phone.budgetCategory) {
            scores[phone.id] += 15;
        }

        // Ranked Priorities
        if(answers.priorities) {
            answers.priorities.forEach((prio, index) => {
                const weight = 4 - index;
                if (phone.tags.includes(prio)) {
                    scores[phone.id] += weight * 5;
                }
            });
        }
        
        // Ranked Photo Priorities
        if (answers.cameraPrio && answers.cameraPrio.length > 0) {
            answers.cameraPrio.forEach((prio, index) => {
                const weight = 3 - index;
                if (phone.tags.includes(prio)) {
                    scores[phone.id] += weight * 4;
                }
            });
        }

        // Other tags
        const otherAnswers = ['screenSize', 'gaming', 'durability', 'charging', 'features', 'longevity'];
        otherAnswers.forEach(key => {
            if (answers[key] && phone.tags.includes(answers[key])) {
                scores[phone.id] += 8;
            }
        });

        // Storage Check
        const storageNeedsMap = { light: 128, average: 256, power: 512 };
        const requiredStorage = storageNeedsMap[answers.storage];
        const hasAdequateStorage = phone.storageOptions.some(option => parseInt(option) >= requiredStorage);
        if(hasAdequateStorage) {
            scores[phone.id] += 10;
        } else {
            scores[phone.id] -= 100;
        }
    });

    const sortedPhones = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return sortedPhones.slice(0, 3).map(id => {
        const phone = PRODUCT_DATABASE.find(p => p.id === id);
        const storageNeedsMap = { light: 128, average: 256, power: 512 };
        const requiredStorage = storageNeedsMap[answers.storage];
        const recommendedStorage = phone.storageOptions.find(opt => parseInt(opt) >= requiredStorage) || phone.storageOptions[0];

        return {...phone, recommendedStorage: recommendedStorage};
    });
};


const App = () => {
    const [journeyStarted, setJourneyStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const font = new FontFace('Quicksand', 'url(https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkKEo58a-wg.woff2)');
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            document.body.style.fontFamily = '"Quicksand", sans-serif';
        });
    }, []);

    const handleAnswer = (questionId, answerId) => {
        if (questions[currentQuestionIndex].type === 'ranked-choice') {
            const currentAnswers = answers[questionId] || [];
            if (!currentAnswers.includes(answerId)) {
                const newAnswers = [...currentAnswers, answerId];
                setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
            }
        } else {
            setAnswers(prev => ({ ...prev, [questionId]: answerId }));
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setShowResults(true);
            }
        }
    };
    
    const handleRankedChoiceNext = () => {
         if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    }

    const resetRankedChoice = (questionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: [] }));
    };

    const handleRestart = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setJourneyStarted(false);
    };

    if (!journeyStarted) {
        return (
             <div style={backgroundStyle} className="min-h-screen flex flex-col items-center justify-center text-gray-800 p-4">
                <header className="absolute top-0 w-full bg-[#002D3E] p-4 flex justify-center items-center shadow-md">
                    <img src="https://circuit.place/wp-content/uploads/2025/08/CPLogo-Either2.png" alt="Circuit Place Logo" className="h-10" />
                </header>
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#002D3E]">Find Your Next Smartphone</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        Tired of confusing specs and endless reviews? This simple guide asks a few questions about your needs and habits to give you a personalized recommendation.
                    </p>
                    <div className="mt-8 text-left space-y-6">
                       <div>
                           <h3 className="text-xl font-black text-[#002D3E]">1. Answer Questions</h3>
                           <p className="text-gray-600">Quickly go through our simple, non-technical questionnaire.</p>
                       </div>
                       <div>
                           <h3 className="text-xl font-black text-[#002D3E]">2. Get Recommendations</h3>
                           <p className="text-gray-600">Instantly see your top 3 matches based on your unique profile.</p>
                       </div>
                       <div>
                           <h3 className="text-xl font-black text-[#002D3E]">3. Find the Best Deal</h3>
                           <p className="text-gray-600">We'll search the web for the best price on your recommended phone.</p>
                       </div>
                    </div>
                    <button 
                        onClick={() => setJourneyStarted(true)}
                        className="mt-10 bg-[#00A99D] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#0084A8] transition-colors shadow-lg text-xl"
                    >
                        Let's Get Started
                    </button>
                </div>
            </div>
        );
    }


    if (showResults) {
        return <ResultsDisplay answers={answers} onRestart={handleRestart} />;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / questions.length) * 100;
    
    const isRankedChoice = currentQuestion.type === 'ranked-choice';
    const rankedAnswers = answers[currentQuestion.id] || [];

    return (
        <div style={backgroundStyle} className="min-h-screen flex flex-col items-center text-gray-800">
            <header className="w-full bg-[#002D3E] p-4 flex justify-center items-center shadow-md">
                <img src="https://circuit.place/wp-content/uploads/2025/08/CPLogo-Either2.png" alt="Circuit Place Logo" className="h-10" />
            </header>

            <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-grow">
                <div className="mb-8">
                    <div className="bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-[#00A99D] to-[#0084A8] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#002D3E]">{currentQuestion.text}</h2>

                <div className={`grid gap-4 ${isRankedChoice ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = isRankedChoice ? rankedAnswers.includes(option.id) : answers[currentQuestion.id] === option.id;
                        const rank = isRankedChoice && isSelected ? rankedAnswers.indexOf(option.id) + 1 : null;
                        
                        return (
                            <div
                                key={option.id}
                                onClick={() => handleAnswer(currentQuestion.id, option.id)}
                                className={`relative p-6 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 border-2 ${isSelected ? 'bg-[#00A99D] text-white border-[#0084A8]' : 'bg-white border-transparent'}`}
                            >
                                {isRankedChoice && isSelected && (
                                    <span className="absolute top-2 right-2 bg-[#002D3E] text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}
                                    </span>
                                )}
                                <p className="text-center text-lg font-semibold">{option.text}</p>
                            </div>
                        );
                    })}
                </div>
                
                {isRankedChoice && (
                     <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button 
                            onClick={() => resetRankedChoice(currentQuestion.id)}
                            className="w-full sm:w-auto bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors shadow-sm"
                        >
                            Reset Priorities
                        </button>
                        <button 
                            onClick={handleRankedChoiceNext}
                            disabled={rankedAnswers.length < currentQuestion.options.length}
                            className="w-full sm:w-auto bg-[#00A99D] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#0084A8] transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultsDisplay = ({ answers, onRestart }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [deals, setDeals] = useState({});
    const [progress, setProgress] = useState({});

    const fetchBestDeal = React.useCallback(async (productName, storage) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        const baseUrl = window.location.origin;

        try {
            const response = await fetch(`${baseUrl}/.netlify/functions/fetch-deal?productName=${encodeURIComponent(productName)}&storage=${encodeURIComponent(storage)}`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                 const errorBody = await response.text();
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server response: ${errorBody}`);
            }
            const data = await response.json();
            if (!data.deal) {
                throw new Error("Deal data not found in response");
            }
            return data.deal;

        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Detailed error fetching deal:", error);
            
            const query = `best deal on ${productName} ${storage}`;
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            return {
                url: url,
                title: `Find Best Deal on Google`
            };
        }
    }, []);

    useEffect(() => {
        const topRecs = getRecommendations(answers);
        setRecommendations(topRecs);

        const fetchAllDeals = async () => {
            const dealPromises = topRecs.map(rec => {
                const id = rec.id;
                const duration = 30000; // Match frontend timeout
                const startTime = Date.now();
                
                const intervalId = setInterval(() => {
                    const elapsedTime = Date.now() - startTime;
                    const currentProgress = Math.min(100, (elapsedTime / duration) * 100);
                    setProgress(prev => ({ ...prev, [id]: currentProgress }));

                    if (currentProgress >= 100) {
                        clearInterval(intervalId);
                    }
                }, 100);

                return fetchBestDeal(rec.name, rec.recommendedStorage).then(deal => {
                    clearInterval(intervalId);
                    setProgress(prev => ({ ...prev, [id]: 100 }));
                    return { id, deal };
                });
            });

            const settledDeals = await Promise.all(dealPromises);
            const dealsMap = settledDeals.reduce((acc, { id, deal }) => {
                acc[id] = deal;
                return acc;
            }, {});
            setDeals(dealsMap);
        };
        
        if (topRecs.length > 0) {
            fetchAllDeals();
        }
    }, [answers, fetchBestDeal]);


    const getPriorityText = (key) => {
        for (const q of questions) {
            const option = q.options.find(opt => opt.id === key);
            if (option) return option.text;
        }
        return key;
    };
    
    return (
        <div style={backgroundStyle} className="min-h-screen text-gray-800">
             <header className="w-full bg-[#002D3E] p-4 flex justify-center items-center shadow-md">
                <img src="https://circuit.place/wp-content/uploads/2025/08/CPLogo-Either2.png" alt="Circuit Place Logo" className="h-10" />
            </header>
            
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#002D3E]">Your Personal Recommendations</h1>
                    <p className="text-lg text-gray-600 mt-2">Based on your preferences, here are the top 3 phones for you.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                     {recommendations.length > 0 ? recommendations.map((rec, index) => (
                        <div key={rec.id} className={`bg-white rounded-xl shadow-lg p-6 flex flex-col text-center transition-all duration-300 ${index === 0 ? 'border-4 border-[#00A99D]' : ''}`}>
                            {index === 0 && <span className="mx-auto -mt-10 mb-4 bg-[#00A99D] text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">Top Pick</span>}
                            <h2 className="text-2xl font-bold text-[#002D3E]">{rec.name}</h2>
                            <p className="font-semibold text-gray-700 mt-1">Recommended Storage: <span className="text-[#0084A8]">{rec.recommendedStorage}</span></p>

                             <div className="text-left my-6 text-sm text-gray-600 space-y-2 flex-grow">
                                <h4 className="font-bold text-md text-[#002D3E] mb-2">Why it's a match:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {answers.priorities && answers.priorities.slice(0, 2).map(prio => rec.tags.includes(prio) && <li key={prio}>Excellent for <span className="font-semibold">{getPriorityText(prio)}</span></li>)}
                                    {answers.screenSize && rec.tags.includes(answers.screenSize) && <li>Great <span className="font-semibold">{getPriorityText(answers.screenSize)}</span> experience</li>}
                                    {answers.longevity && rec.tags.includes(answers.longevity) && <li>Built to last with <span className="font-semibold">long-term support</span></li>}
                                </ul>
                            </div>
                            
                            <div className="mt-auto">
                                {!deals[rec.id] ? (
                                     <div>
                                        <p className="text-sm text-gray-500 mb-2">Finding best deal...</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-[#00A99D] to-[#0084A8] h-2.5 rounded-full" style={{ width: `${progress[rec.id] || 0}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <a href={deals[rec.id].url} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#00A99D] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#0084A8] transition-colors shadow-md">
                                        {deals[rec.id].title}
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : <p>Loading recommendations...</p>}
                </div>
                
                 <div className="bg-white rounded-xl shadow-lg p-6 mt-12">
                    <h3 className="text-2xl font-bold text-[#002D3E] mb-4">Your Tech Profile</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <h4 className="font-bold text-gray-500">Priorities</h4>
                             <ol className="list-decimal list-inside text-gray-700">
                                {answers.priorities && answers.priorities.map(p => <li key={p}>{getPriorityText(p)}</li>)}
                            </ol>
                        </div>
                         <div>
                            <h4 className="font-bold text-gray-500">Photo Style</h4>
                             <ol className="list-decimal list-inside text-gray-700">
                                {answers.cameraPrio && answers.cameraPrio.map(p => <li key={p}>{getPriorityText(p)}</li>)}
                            </ol>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-500">Budget</h4>
                            <p className="text-gray-700">{getPriorityText(answers.budget)}</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-gray-500">Longevity</h4>
                            <p className="text-gray-700">{getPriorityText(answers.longevity)}</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button onClick={onRestart} className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;









