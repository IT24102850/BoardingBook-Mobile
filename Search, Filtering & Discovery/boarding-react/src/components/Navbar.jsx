import { useState, useEffect } from 'react';

export default function Navbar({ onFindRooms, onToggleDrawer }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
            <a className="nav-logo" href="#hero">Boarding<span>Book SL</span></a>

            <div className="nav-center" id="navCenter">
                <a href="#hero">Home</a>
                <a href="#search">Find Rooms</a>
                <a href="#saved">Saved Searches</a>
                <a href="#chatbot">AI Assistant</a>
            </div>

            <div className="nav-right">
                <button className="btn-outline-nav" onClick={onFindRooms}>Find Rooms</button>
                <span className="badge-ai">🤖 AI Search</span>
                <div className="nav-avatar" title="Profile">D</div>
                <button className="nav-burger" id="burgerBtn" onClick={onToggleDrawer}>
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
