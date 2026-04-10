import { useEffect, useState } from 'react';

const SECTIONS = ['hero', 'search', 'location', 'saved', 'chatbot'];

export default function ScrollDots() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        function update() {
            let idx = 0;
            SECTIONS.forEach((id, i) => {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2) idx = i;
                }
            });
            setActive(idx);
        }
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    function scrollTo(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="scroll-dots" id="scrollDots">
            {SECTIONS.map((id, i) => (
                <div
                    key={id}
                    className={`scroll-dot${i === active ? ' active' : ''}`}
                    onClick={() => scrollTo(id)}
                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                />
            ))}
        </div>
    );
}
