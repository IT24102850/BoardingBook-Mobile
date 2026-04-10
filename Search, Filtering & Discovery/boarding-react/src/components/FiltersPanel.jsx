const FACILITIES = [
    { key: 'WiFi', label: '📶 WiFi' },
    { key: 'AC', label: '❄️ Air-Cond' },
    { key: 'Meals', label: '🍽️ Meals' },
    { key: 'Bathroom', label: '🚿 Private Bath' },
    { key: 'Parking', label: '🅿️ Parking' },
    { key: 'Laundry', label: '🧺 Laundry' },
    { key: 'Security', label: '🔒 Security' },
    { key: 'Gym', label: '💪 Gym' },
];

export default function FiltersPanel({ filters, setters, onReset }) {
    const { priceMax, dist, room, avail, facs, rating } = filters;
    const { setPriceMax, setDist, setRoom, setAvail, setFacs, setRating } = setters;

    function toggleFac(key) {
        setFacs(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        );
    }

    function starClick(v) {
        setRating(prev => prev === v ? 0 : v);
    }

    return (
        <div className="filters-panel">
            <div className="fp-header">
                <h3><i className="fa-solid fa-sliders"></i> Real-Time Filters</h3>
                <button className="btn-reset" onClick={onReset}>Reset All</button>
            </div>

            {/* Row 1: Price | Distance | Room Type */}
            <div className="fp-row">
                <div className="fp-group">
                    <div className="fp-label">Price Range (Rs./Month)</div>
                    <div className="price-vals">
                        <span>Rs. 3,000</span>
                        <span>Rs. {priceMax.toLocaleString()}</span>
                    </div>
                    <input
                        type="range" id="priceSlider"
                        min="3000" max="50000" step="500"
                        value={priceMax}
                        onChange={e => setPriceMax(parseInt(e.target.value))}
                        style={{ marginBottom: '4px' }}
                    />
                    <div className="range-labels"><span>Rs. 3,000</span><span>Rs. 50,000</span></div>
                </div>

                <div className="fp-group">
                    <div className="fp-label">Max Distance from Campus</div>
                    <div className="pill-group">
                        {['500m', '1km', '2km', '5km', 'any'].map(v => (
                            <button
                                key={v}
                                className={`pill${dist === v ? ' active' : ''}`}
                                onClick={() => setDist(v)}
                            >
                                {v === 'any' ? 'Any' : v}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fp-group">
                    <div className="fp-label">Room Type</div>
                    <div className="pill-group">
                        {['All', 'Single', 'Master', 'Sharing', 'Annex'].map(v => (
                            <button
                                key={v}
                                className={`pill${room === v ? ' active' : ''}`}
                                onClick={() => setRoom(v)}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fp-divider"></div>

            {/* Row 2: Availability | Rating */}
            <div className="fp-row two">
                <div className="fp-group">
                    <div className="fp-label">Availability</div>
                    <div className="pill-group">
                        {['all', 'available', 'occupied'].map(v => (
                            <button
                                key={v}
                                className={`pill${avail === v ? ' active' : ''}`}
                                onClick={() => setAvail(v)}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fp-group">
                    <div className="fp-label">Minimum Rating</div>
                    <div className="star-group">
                        {[1, 2, 3, 4, 5].map(v => (
                            <span
                                key={v}
                                className={`star${rating >= v ? ' active' : ''}`}
                                onClick={() => starClick(v)}
                            >★</span>
                        ))}
                        <span className="star-hint">
                            {rating > 0 ? `${rating}+ Stars` : 'Any'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="fp-divider"></div>

            {/* Row 3: Facilities */}
            <div className="fp-row one">
                <div className="fp-group">
                    <div className="fp-label">Facilities</div>
                    <div className="fac-grid">
                        {FACILITIES.map(({ key, label }) => (
                            <div
                                key={key}
                                className={`fac-item${facs.includes(key) ? ' active' : ''}`}
                                onClick={() => toggleFac(key)}
                            >
                                <div className="fac-check">✓</div>
                                <span className="fac-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
