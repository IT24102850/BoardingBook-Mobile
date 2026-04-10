export default function MobileDrawer({ isOpen, onClose }) {
    return (
        <div className={`mobile-drawer${isOpen ? ' open' : ''}`} id="mobileDrawer">
            <a href="#hero" onClick={onClose}>🏠 Home</a>
            <a href="#search" onClick={onClose}>🔍 Find Rooms</a>
            <a href="#location" onClick={onClose}>📍 Location</a>
            <a href="#saved" onClick={onClose}>🔖 Saved Searches</a>
            <a href="#chatbot" onClick={onClose}>🤖 AI Assistant</a>
        </div>
    );
}
