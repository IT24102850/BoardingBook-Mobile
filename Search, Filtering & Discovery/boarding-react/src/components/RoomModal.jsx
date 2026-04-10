import { useEffect } from 'react';
import { fi } from '../data/rooms';

export default function RoomModal({ room: r, onClose }) {
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        if (r) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [r]);

    if (!r) return null;

    return (
        <div
            className="modal-overlay open"
            id="roomModal"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal">
                <div className="modal-head">
                    <h3>{r.name}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <img className="modal-img" src={r.img} alt={r.name} />
                    <div className="modal-price">Rs. {r.price.toLocaleString()} / month</div>
                    <div className="modal-loc">📍 {r.location} · {r.distKm}km from {r.campus}</div>
                    <div className="modal-tags">
                        {r.facilities.map(f => (
                            <span key={f} className="m-tag">{fi(f)}</span>
                        ))}
                    </div>
                    <div className="modal-grid">
                        <div className="mg-item"><div className="mg-label">Room Type</div><div className="mg-val">🛏️ {r.roomType}</div></div>
                        <div className="mg-item"><div className="mg-label">Status</div><div className="mg-val">{r.available ? '✅ Available' : '❌ Occupied'}</div></div>
                        <div className="mg-item"><div className="mg-label">Rating</div><div className="mg-val">⭐ {r.rating} ({r.reviews} reviews)</div></div>
                        <div className="mg-item"><div className="mg-label">Owner</div><div className="mg-val">👤 {r.owner}</div></div>
                    </div>
                    <p className="modal-desc">{r.desc}</p>
                </div>
                <div className="modal-foot">
                    <button className="btn-contact" onClick={onClose}>
                        <i className="fa-solid fa-phone"></i> Contact Owner
                    </button>
                    <button className="btn-bk" onClick={onClose}>
                        <i className="fa-solid fa-bookmark"></i> Save
                    </button>
                    <button className="btn-bk" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
