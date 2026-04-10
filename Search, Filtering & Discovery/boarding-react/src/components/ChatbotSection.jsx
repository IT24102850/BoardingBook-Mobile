import { useState, useRef, useEffect } from 'react';
import { parseNLP, buildReply, facIco } from '../data/rooms';

const SUGG_CHIPS = [
    'Cheap room near SLIIT Malabe with WiFi',
    'Master room under Rs. 15000 with AC',
    'Budget boarding with meals included',
    'Single room 1km from campus',
];

export default function ChatbotSection({ onApplyAI }) {
    const [messages, setMessages] = useState([{ id: 0, role: 'bot', html: `👋 Hi! I'm <strong>BoardingBot SL</strong>.` }]);
    const [input, setInput] = useState('');
    const [aiExtracted, setAiExtracted] = useState(null);
    const chatRef = useRef(null);

    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

    function sendMsg(txt) {
        const text = typeof txt === 'string' ? txt : input.trim();
        if (!text) return;
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', html: text }, { id: Date.now() + 1, role: 'bot', html: '...', loading: true }]);
        setTimeout(() => {
            const e = parseNLP(text); const reply = buildReply(e); setAiExtracted(e);
            setMessages(prev => prev.map(m => m.loading ? { ...m, html: reply, loading: false } : m));
        }, 800);
    }

    return (
        <section className="chatbot-section" id="chatbot">
            <div className="container">
                <h2 className="section-title">AI <span className="hl">Chatbot</span></h2>
                <div className="chatbot-layout">
                    <div className="chat-window">
                        <div className="chat-msgs" ref={chatRef}>
                            {messages.map(m => (
                                <div key={m.id} className={`msg ${m.role}`}>
                                    <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
                                </div>
                            ))}
                        </div>
                        {/* Suggestion chips */}
                        <div className="chat-suggestions">
                            {SUGG_CHIPS.map((chip, i) => (
                                <button key={i} className="sugg-chip" onClick={() => sendMsg(chip)}>{chip}</button>
                            ))}
                        </div>

                        <div className="chat-input-area">
                            <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                            <button className="btn-send" onClick={() => sendMsg()}>Send</button>
                        </div>
                    </div>
                    <div className="ai-panel">
                        <div className="ai-panel-title">⭐ AI Filters</div>
                        {aiExtracted && (
                            <button className="btn-apply-ai show" onClick={() => onApplyAI(aiExtracted)}>Apply Filters</button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
