import FiltersPanel from './FiltersPanel';
import RoomCard from './RoomCard';
import { ROOMS, distMap } from '../data/rooms';

const QUICK_TAGS = [
    { label: 'All', val: '' },
    { label: 'Near SLIIT Malabe', val: 'SLIIT Malabe' },
    { label: 'Near UOM (Mora)', val: 'UOM' },
    { label: 'Near USJP', val: 'USJP' },
    { label: 'Near UOC', val: 'UOC' },
    { label: 'Near NSBM', val: 'NSBM' },
    { label: 'WiFi Included', val: 'WiFi' },
    { label: 'Single Room', val: 'Single' },
    { label: 'Master Room', val: 'Master' },
    { label: 'Air-Conditioned', val: 'AC' },
];

function getFiltered(filters) {
    const { search, priceMax, dist, room, avail, facs, rating, sort } = filters;
    let rooms = ROOMS.filter(r => {
        if (search) {
            const h = [r.name, r.location, r.campus, r.roomType, r.owner, ...r.facilities].join(' ').toLowerCase();
            if (!h.includes(search.toLowerCase())) return false;
        }
        if (r.price > priceMax) return false;
        const md = distMap[dist] || 9999;
        if (r.distKm > md) return false;
        if (room !== 'All' && r.roomType !== room) return false;
        if (avail === 'available' && !r.available) return false;
        if (avail === 'occupied' && r.available) return false;
        if (facs.length > 0 && !facs.every(f => r.facilities.includes(f))) return false;
        if (r.rating < rating) return false;
        return true;
    });
    switch (sort) {
        case 'price-asc': rooms.sort((a, b) => a.price - b.price); break;
        case 'price-desc': rooms.sort((a, b) => b.price - a.price); break;
        case 'distance': rooms.sort((a, b) => a.distKm - b.distKm); break;
        case 'rating': rooms.sort((a, b) => b.rating - a.rating); break;
        default: rooms.sort((a, b) => b.rating - a.rating - (a.distKm - b.distKm) * 0.5);
    }
    return rooms;
}

export default function SearchSection({ filters, setters, onOpenModal }) {
    const { search, sort, room, facs } = filters;
    const { setSearch, setSort, setPriceMax, setDist, setRoom, setAvail, setFacs, setRating } = setters;

    const rooms = getFiltered(filters);

    function handleReset() {
        setSearch(''); setPriceMax(25000); setDist('1km');
        setRoom('All'); setAvail('all'); setFacs([]); setRating(0); setSort('recommended');
    }

    function applyTag(t) {
        handleReset(); // Clear others for a fresh start on tag click
        if (t.val === '') return;

        if (['SLIIT Malabe', 'UOM', 'USJP', 'UOC', 'NSBM'].includes(t.val)) {
            setSearch(t.val);
        } else if (['WiFi', 'AC'].includes(t.val)) {
            setFacs([t.val]);
        } else if (['Single', 'Master'].includes(t.val)) {
            setRoom(t.val);
        } else {
            setSearch(t.val);
        }
    }

    function getSuggestions() {
        const s = [];
        if (filters.priceMax < 50000) s.push({ l: '💰 Increase price to Rs. 50,000', fn: () => setPriceMax(50000) });
        if (filters.dist !== 'any') s.push({ l: '📏 Remove distance limit', fn: () => setDist('any') });
        if (filters.facs.length > 0) s.push({ l: '🔧 Remove facility filters', fn: () => setFacs([]) });
        if (filters.room !== 'All') s.push({ l: '🛏️ Show all room types', fn: () => setRoom('All') });
        if (filters.search) s.push({ l: '🔍 Clear search term', fn: () => setSearch('') });
        if (s.length === 0) s.push({ l: '🔄 Reset all filters', fn: handleReset });
        return s;
    }

    return (
        <section className="search-section" id="search">
            <div className="container">

                {/* Search Bar */}
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass ico"></i>
                    <input
                        className="search-input"
                        id="mainSearch"
                        type="text"
                        placeholder="Search by name, location, campus, room type, owner…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="btn-search">Search</button>
                </div>

                {/* Quick Tags */}
                <div className="quick-tags">
                    {QUICK_TAGS.map(t => (
                        <span
                            key={t.label}
                            className={`qtag${(search === t.val || room === t.val || facs.includes(t.val)) ? ' active' : ''}`}
                            onClick={() => applyTag(t)}
                        >
                            {t.label}
                        </span>
                    ))}
                </div>

                {/* Filters Panel */}
                <FiltersPanel
                    filters={filters}
                    setters={{ setPriceMax, setDist, setRoom, setAvail, setFacs, setRating }}
                    onReset={handleReset}
                />

                {/* Results Bar */}
                <div className="results-bar">
                    <div className="sort-group">
                        <span className="sort-label">Sort by:</span>
                        {[['recommended', 'Recommended'], ['price-asc', 'Price ↑'], ['price-desc', 'Price ↓'], ['distance', 'Distance'], ['rating', 'Rating']].map(([val, label]) => (
                            <button
                                key={val}
                                className={`pill${sort === val ? ' active' : ''}`}
                                onClick={() => setSort(val)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="results-count">Showing <span>{rooms.length}</span> results</div>
                </div>

                {/* Room Cards / No Results */}
                {rooms.length > 0 ? (
                    <div className="rooms-grid" id="roomsGrid">
                        {rooms.map(r => <RoomCard key={r.id} room={r} onOpen={onOpenModal} />)}
                    </div>
                ) : (
                    <div className="no-results show" id="noResults">
                        <div className="no-results-icon">🔍</div>
                        <h3>No boarding houses found</h3>
                        <p>Try adjusting your filters or search term.</p>
                        <div className="suggestions">
                            {getSuggestions().map((s, i) => (
                                <button key={i} className="sugg-btn" onClick={s.fn}>{s.l}</button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
