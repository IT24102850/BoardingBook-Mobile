import React, { useState } from 'react';
import FiltersPanel from './FiltersPanel';
import RoomCard from './RoomCard';
import { ROOMS, distMap } from '../../data/rooms';
import { FaSearch, FaTimes } from 'react-icons/fa';

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

interface SearchSectionProps {
  onOpenModal?: (roomId: number) => void;
}

function getFiltered(filters: any) {
  const { search, priceMax, dist, room, avail, facs, rating, sort } = filters;
  let rooms = ROOMS.filter((r) => {
    if (search) {
      const h = [r.name, r.location, r.campus, r.roomType, r.owner, ...r.facilities]
        .join(' ')
        .toLowerCase();
      if (!h.includes(search.toLowerCase())) return false;
    }
    if (r.price > priceMax) return false;
    const md = distMap[dist as keyof typeof distMap] || 9999;
    if (r.distKm > md) return false;
    if (room !== 'All' && r.roomType !== room) return false;
    if (avail === 'available' && !r.available) return false;
    if (avail === 'occupied' && r.available) return false;
    if (facs.length > 0 && !facs.every((f: string) => r.facilities.includes(f))) return false;
    if (r.rating < rating) return false;
    return true;
  });

  switch (sort) {
    case 'price-asc':
      rooms.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      rooms.sort((a, b) => b.price - a.price);
      break;
    case 'distance':
      rooms.sort((a, b) => a.distKm - b.distKm);
      break;
    case 'rating':
      rooms.sort((a, b) => b.rating - a.rating);
      break;
    default:
      rooms.sort((a, b) => b.rating - a.rating - (a.distKm - b.distKm) * 0.5);
  }
  return rooms;
}

export default function SearchSection({ onOpenModal }: SearchSectionProps) {
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState(25000);
  const [dist, setDist] = useState('1km');
  const [room, setRoom] = useState('All');
  const [avail, setAvail] = useState('all');
  const [facs, setFacs] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('recommended');

  const filters = { search, priceMax, dist, room, avail, facs, rating, sort };
  const setters = { setSearch, setPriceMax, setDist, setRoom, setAvail, setFacs, setRating, setSort };

  const rooms = getFiltered(filters);

  function handleReset() {
    setSearch('');
    setPriceMax(25000);
    setDist('1km');
    setRoom('All');
    setAvail('all');
    setFacs([]);
    setRating(0);
    setSort('recommended');
  }

  function applyTag(t: { label: string; val: string }) {
    handleReset();
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
    if (filters.priceMax < 50000)
      s.push({
        l: '💰 Increase price to Rs. 50,000',
        fn: () => setPriceMax(50000),
      });
    if (filters.dist !== 'any')
      s.push({ l: '📏 Remove distance limit', fn: () => setDist('any') });
    if (filters.facs.length > 0)
      s.push({ l: '🔧 Remove facility filters', fn: () => setFacs([]) });
    if (filters.room !== 'All')
      s.push({ l: '🛏️ Show all room types', fn: () => setRoom('All') });
    if (filters.search)
      s.push({ l: '🔍 Clear search term', fn: () => setSearch('') });
    if (s.length === 0) s.push({ l: '🔄 Reset all filters', fn: handleReset });
    return s;
  }

  const handleOpenModal = (roomId: number) => {
    if (onOpenModal) {
      onOpenModal(roomId);
    } else {
      console.log('Open room modal for ID:', roomId);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 mb-3">
            Find Your Perfect Room
          </h1>
          <p className="text-lg text-cyan-100/70">
            Search, filter, and discover the best boarding places near your campus
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto">
          <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, location, campus, room type, owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gradient-to-r from-[#181f36]/95 to-[#232b47]/95 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-lg"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-3 justify-center">
          {QUICK_TAGS.map((t) => (
            <button
              key={t.label}
              onClick={() => applyTag(t)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                search === t.val || room === t.val || facs.includes(t.val)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <FiltersPanel filters={filters} setters={setters} onReset={handleReset} />

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#181f36]/95 to-[#232b47]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-cyan-300">Sort by:</span>
            {[
              ['recommended', 'Recommended'],
              ['price-asc', 'Price ↑'],
              ['price-desc', 'Price ↓'],
              ['distance', 'Distance'],
              ['rating', 'Rating'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSort(val)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  sort === val
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-white font-semibold">
            Showing <span className="text-cyan-400 text-xl">{rooms.length}</span> results
          </div>
        </div>

        {/* Room Cards / No Results */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((r) => (
              <RoomCard key={r.id} room={r} onOpen={handleOpenModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-[#181f36]/95 to-[#232b47]/95 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No boarding houses found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search term.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {getSuggestions().map((s, i) => (
                <button
                  key={i}
                  onClick={s.fn}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-200 font-medium border border-cyan-400/30 transition-all duration-300"
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
