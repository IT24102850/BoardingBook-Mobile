import { fi } from '../data/rooms';

export default function RoomCard({ room: r, onOpen }) {
    const halfStar = r.rating % 1 >= 0.5 ? '½' : '';
    const starsStr = '★'.repeat(Math.floor(r.rating)) + halfStar;

    return (
        <div className="room-card" onClick={() => onOpen(r.id)}>
            <div className="rc-img">
                <img src={r.img} alt={r.name} loading="lazy" />
                {r.available
                    ? <span className="rc-badge-avail avail">✅ Available</span>
                    : <span className="rc-badge-avail occ">❌ Occupied</span>
                }
                <div className="rc-price">Rs. {r.price.toLocaleString()}/mo</div>
            </div>
            <div className="rc-body">
                <div className="rc-name">{r.name}</div>
                <div className="rc-loc">
                    <span className="pin">📍</span>{r.location} · {r.distKm}km from {r.campus}
                </div>
                <div className="rc-meta">
                    <span className="rc-meta-i">🛏️ {r.roomType}</span>
                    <span className="rc-meta-i">📏 {r.distKm}km</span>
                    <span className="rc-meta-i">👤 {r.owner}</span>
                </div>
                <div className="rc-tags">
                    {r.facilities.slice(0, 3).map(f => (
                        <span key={f} className="rc-tag">{fi(f)}</span>
                    ))}
                    {r.facilities.length > 3 && (
                        <span className="rc-tag">+{r.facilities.length - 3} more</span>
                    )}
                </div>
                <div className="rc-footer">
                    <div className="rc-rating">
                        <span className="rc-stars">{starsStr}</span>
                        <span className="rc-rnum">{r.rating}</span>
                        <span className="rc-rcnt">({r.reviews} reviews)</span>
                    </div>
                    <button
                        className="btn-view"
                        onClick={e => { e.stopPropagation(); onOpen(r.id); }}
                    >
                        View Room
                    </button>
                </div>
            </div>
        </div>
    );
}
