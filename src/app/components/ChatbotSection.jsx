import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseNLP, buildReply, facIco, SERVICES } from '../data/rooms';

const SUGG_CHIPS = [
    'Cheap room near SLIIT Malabe with WiFi',
    'Find me a female roommate in Nugegoda',
    'Master room under Rs. 15000 with AC',
    'What services do you offer?',
    'Budget boarding with meals included',
    'Help me book a boarding place',
];

export default function ChatbotSection({ onApplyAI = null, standalone = false }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([{ 
        id: 0, 
        role: 'bot', 
        html: `👋 Hi! I'm <strong>BoardingBot SL</strong>, your AI assistant.<br><br>I can help you:<br>🏠 Find boarding places<br>👥 Find roommates<br>🛎️ Access services<br><br>What can I help you with today?` 
    }]);
    const [input, setInput] = useState('');
    const [aiExtracted, setAiExtracted] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => { 
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; 
    }, [messages]);

    function sendMsg(txt) {
        const text = typeof txt === 'string' ? txt : input.trim();
        if (!text) return;
        setInput('');
        setShowSuggestions(false);
        setIsMobileMenuOpen(false);
        setMessages(prev => [...prev, 
            { id: Date.now(), role: 'user', html: text }, 
            { id: Date.now() + 1, role: 'bot', html: '...', loading: true }
        ]);
        
        setTimeout(() => {
            const e = parseNLP(text); 
            const reply = buildReply(e); 
            setAiExtracted(e);
            setMessages(prev => prev.map(m => m.loading ? { ...m, html: reply, loading: false } : m));
        }, 800);
    }

    function handleApplyFilters() {
        if (onApplyAI && aiExtracted) {
            onApplyAI(aiExtracted);
        }
        if (aiExtracted?.intent === 'boarding') {
            navigate('/find');
        } else if (aiExtracted?.intent === 'roommate') {
            navigate('/roommate-finder');
        }
        setIsMobileMenuOpen(false);
    }

    function clearChat() {
        setMessages([{ 
            id: 0, 
            role: 'bot', 
            html: `👋 Hi! I'm <strong>BoardingBot SL</strong>, your AI assistant.<br><br>I can help you:<br>🏠 Find boarding places<br>👥 Find roommates<br>🛎️ Access services<br><br>What can I help you with today?` 
        }]);
        setAiExtracted(null);
        setShowSuggestions(true);
        setIsMobileMenuOpen(false);
    }

    const containerClass = standalone 
        ? "min-h-screen bg-[#181f36] py-4 sm:py-8 px-3 sm:px-4"
        : "py-8 sm:py-16 px-3 sm:px-4 bg-[#181f36]";

    return (
        <section className={containerClass} id="chatbot">
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
                .glass-card {
                    background: rgba(35, 43, 71, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(129, 140, 248, 0.2);
                }
                .chat-bubble-bot {
                    background: linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
                    border: 1px solid rgba(129, 140, 248, 0.3);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(129, 140, 248, 0.5);
                    border-radius: 10px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(129, 140, 248, 0.7);
                }
                
                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .message-bubble {
                        max-width: 90% !important;
                        font-size: 0.9rem;
                        padding: 0.75rem 1rem;
                    }
                    .chat-header-text {
                        font-size: 1rem;
                    }
                    .chat-avatar {
                        width: 2.5rem;
                        height: 2.5rem;
                        font-size: 1.25rem;
                    }
                }
                
                /* Prevent zoom on input focus for iOS */
                @media screen and (-webkit-min-device-pixel-ratio: 0) { 
                    select:focus,
                    textarea:focus,
                    input:focus {
                        font-size: 16px;
                    }
                }
                
                /* Smooth transitions for mobile menu */
                .mobile-menu-enter {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.3s ease-out;
                }
                .mobile-menu-enter-active {
                    max-height: 300px;
                    opacity: 1;
                }
                .mobile-menu-exit {
                    max-height: 300px;
                    opacity: 1;
                }
                .mobile-menu-exit-active {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.3s ease-in;
                }
            `}</style>
            
            <div className="max-w-7xl mx-auto">
                {standalone && (
                    <div className="mb-4 sm:mb-6 animate-slide-up">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-zinc-200 hover:text-white flex items-center gap-2 transition-all px-3 sm:px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-indigo-400/30 text-sm sm:text-base"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </button>
                    </div>
                )}

                <div className="text-center mb-6 sm:mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-block mb-2 sm:mb-4">
                        <span className="text-4xl sm:text-6xl animate-bounce inline-block" style={{ animationDuration: '2s' }}>🤖</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg px-2">
                        AI Chatbot Assistant
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 px-4">Your 24/7 intelligent helper for boarding and roommates</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Chat Window */}
                    <div className="lg:col-span-2 glass-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-3 sm:p-5 flex justify-between items-center">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl backdrop-blur-sm border border-white/30 chat-avatar">
                                    🤖
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-xl text-white drop-shadow-md chat-header-text">BoardingBot SL</h3>
                                    <p className="text-xs sm:text-sm text-indigo-100 flex items-center gap-1 sm:gap-2">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="hidden xs:inline">Online •</span> Always ready
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={clearChat}
                                className="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white transition-all border border-white/30 hover:scale-105 backdrop-blur-sm"
                            >
                                Clear
                            </button>
                        </div>
                        
                        {/* Messages */}
                        <div 
                            ref={chatRef}
                            className="h-[350px] sm:h-[450px] md:h-[500px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-[#1a2235] to-[#181f36] scrollbar-thin"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                                    <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-2 sm:py-3 shadow-lg message-bubble ${
                                        m.role === 'user' 
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/50' 
                                            : 'chat-bubble-bot text-zinc-100'
                                    }`}>
                                        {m.loading ? (
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: m.html }} className="leading-relaxed text-sm sm:text-base" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Suggestion chips - Desktop */}
                        {showSuggestions && (
                            <div className="hidden sm:block px-4 sm:px-6 py-3 sm:py-4 bg-[#1a2235] border-t border-indigo-400/20">
                                <p className="text-xs text-zinc-400 mb-2 sm:mb-3 font-semibold tracking-wide uppercase">Quick Suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {SUGG_CHIPS.slice(0, 4).map((chip, i) => (
                                        <button 
                                            key={i} 
                                            className="text-xs bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all border border-indigo-400/30 hover:border-indigo-400/60 hover:scale-105 backdrop-blur-sm"
                                            onClick={() => sendMsg(chip)}
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile Suggestion Toggle */}
                        {showSuggestions && (
                            <div className="sm:hidden px-3 py-2 bg-[#1a2235] border-t border-indigo-400/20">
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-full flex items-center justify-between text-xs text-zinc-400 font-semibold tracking-wide uppercase"
                                >
                                    <span>Quick Suggestions</span>
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-48 mt-2' : 'max-h-0'}`}>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGG_CHIPS.slice(0, 4).map((chip, i) => (
                                            <button 
                                                key={i} 
                                                className="text-xs bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-200 px-3 py-1.5 rounded-full transition-all border border-indigo-400/30 hover:border-indigo-400/60"
                                                onClick={() => sendMsg(chip)}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 sm:p-5 bg-[#232b47] border-t border-indigo-400/20">
                            <div className="flex gap-2 sm:gap-3">
                                <input 
                                    className="flex-1 px-3 sm:px-5 py-3 sm:py-4 bg-[#1a2235] border border-indigo-400/30 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-zinc-500 transition-all text-sm sm:text-base"
                                    placeholder="Ask me anything..."
                                    value={input} 
                                    onChange={e => setInput(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && sendMsg()} 
                                />
                                <button 
                                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 border border-indigo-400/50 text-sm sm:text-base"
                                    onClick={() => sendMsg()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Side Panel - Desktop */}
                    <div className="hidden lg:block space-y-4">
                        {/* AI Extracted Info */}
                        {aiExtracted && (
                            <div className="glass-card rounded-2xl shadow-xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                    <span>⭐</span> AI Detected
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {aiExtracted.intent && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-400">Intent:</span>
                                            <span className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-indigo-200 px-3 py-1 rounded-lg border border-indigo-400/30">{aiExtracted.intent}</span>
                                        </div>
                                    )}
                                    {aiExtracted.campus && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-400">Campus:</span>
                                            <span className="text-zinc-100">{aiExtracted.campus}</span>
                                        </div>
                                    )}
                                    {aiExtracted.pMax && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-400">Budget:</span>
                                            <span className="text-zinc-100">Rs. {aiExtracted.pMax}</span>
                                        </div>
                                    )}
                                    {aiExtracted.room && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-400">Room:</span>
                                            <span className="text-zinc-100">{aiExtracted.room}</span>
                                        </div>
                                    )}
                                    {aiExtracted.facs?.length > 0 && (
                                        <div>
                                            <span className="font-semibold text-zinc-400">Facilities:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {aiExtracted.facs.map((f, i) => (
                                                    <span key={i} className="bg-cyan-600/30 text-cyan-200 px-2 py-1 rounded-lg text-xs border border-cyan-400/30">
                                                        {facIco[f]} {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {aiExtracted.gender && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-400">Gender:</span>
                                            <span className="text-zinc-100">{aiExtracted.gender}</span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 border border-indigo-400/50"
                                    onClick={handleApplyFilters}
                                >
                                    {aiExtracted.intent === 'roommate' ? 'Find Roommates →' : 
                                     aiExtracted.intent === 'service' ? 'View Services →' : 
                                     'Search Now →'}
                                </button>
                            </div>
                        )}

                        {/* Services Quick Access */}
                        <div className="glass-card rounded-2xl shadow-xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <h3 className="font-bold text-lg text-white mb-4">🛎️ Quick Services</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full text-left p-3 rounded-xl hover:bg-indigo-600/20 transition-all border border-indigo-400/20 hover:border-indigo-400/50 hover:scale-105"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏠</span>
                                        <div>
                                            <div className="font-semibold text-sm text-zinc-100">Landing Page</div>
                                            <div className="text-xs text-zinc-400">Go back to the home page</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => navigate('/boarding-management')}
                                    className="w-full text-left p-3 rounded-xl hover:bg-indigo-600/20 transition-all border border-indigo-400/20 hover:border-indigo-400/50 hover:scale-105"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏢</span>
                                        <div>
                                            <div className="font-semibold text-sm text-zinc-100">List Your Property</div>
                                            <div className="text-xs text-zinc-400">Open the property listing page</div>
                                        </div>
                                    </div>
                                </button>

                                {SERVICES.slice(0, 4).map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => navigate(service.link)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-indigo-600/20 transition-all border border-indigo-400/20 hover:border-indigo-400/50 hover:scale-105"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{service.icon}</span>
                                            <div>
                                                <div className="font-semibold text-sm text-zinc-100">{service.name}</div>
                                                <div className="text-xs text-zinc-400">{service.desc}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Side Panel - Bottom Sheet */}
                    <div className="lg:hidden">
                        {(aiExtracted || SERVICES.length > 0) && (
                            <div className="glass-card rounded-2xl shadow-xl p-4 animate-slide-up mt-4" style={{ animationDelay: '0.3s' }}>
                                {/* AI Extracted Info - Mobile */}
                                {aiExtracted && (
                                    <div className="mb-4">
                                        <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                                            <span>⭐</span> AI Detected
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {aiExtracted.intent && (
                                                <div className="col-span-2 sm:col-span-1">
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Intent</span>
                                                    <span className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-indigo-200 px-2 py-1 rounded-lg border border-indigo-400/30 inline-block mt-1">
                                                        {aiExtracted.intent}
                                                    </span>
                                                </div>
                                            )}
                                            {aiExtracted.campus && (
                                                <div>
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Campus</span>
                                                    <span className="text-zinc-100 text-xs">{aiExtracted.campus}</span>
                                                </div>
                                            )}
                                            {aiExtracted.pMax && (
                                                <div>
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Budget</span>
                                                    <span className="text-zinc-100 text-xs">Rs. {aiExtracted.pMax}</span>
                                                </div>
                                            )}
                                            {aiExtracted.room && (
                                                <div>
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Room</span>
                                                    <span className="text-zinc-100 text-xs">{aiExtracted.room}</span>
                                                </div>
                                            )}
                                            {aiExtracted.gender && (
                                                <div>
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Gender</span>
                                                    <span className="text-zinc-100 text-xs">{aiExtracted.gender}</span>
                                                </div>
                                            )}
                                            {aiExtracted.facs?.length > 0 && (
                                                <div className="col-span-2">
                                                    <span className="font-semibold text-zinc-400 block text-[10px]">Facilities</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {aiExtracted.facs.map((f, i) => (
                                                            <span key={i} className="bg-cyan-600/30 text-cyan-200 px-2 py-0.5 rounded-lg text-[10px] border border-cyan-400/30">
                                                                {facIco[f]} {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            className="w-full mt-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm"
                                            onClick={handleApplyFilters}
                                        >
                                            {aiExtracted.intent === 'roommate' ? 'Find Roommates →' : 
                                             aiExtracted.intent === 'service' ? 'View Services →' : 
                                             'Search Now →'}
                                        </button>
                                    </div>
                                )}

                                {/* Services Quick Access - Mobile */}
                                <div>
                                    <h3 className="font-bold text-base text-white mb-3">🛎️ Quick Services</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SERVICES.slice(0, 4).map(service => (
                                            <button
                                                key={service.id}
                                                onClick={() => navigate(service.link)}
                                                className="text-left p-2 rounded-xl hover:bg-indigo-600/20 transition-all border border-indigo-400/20 hover:border-indigo-400/50"
                                            >
                                                <div className="flex flex-col items-center text-center gap-1">
                                                    <span className="text-xl">{service.icon}</span>
                                                    <div className="font-semibold text-xs text-zinc-100">{service.name}</div>
                                                    <div className="text-[10px] text-zinc-400 line-clamp-2">{service.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}