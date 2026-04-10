import { useState, useEffect } from 'react';
import { ToastProvider } from './hooks/useToast';
import Navbar from './components/Navbar';
import MobileDrawer from './components/MobileDrawer';
import ScrollDots from './components/ScrollDots';
import HeroSection from './components/HeroSection';
import SearchSection from './components/SearchSection';
import LocationSection from './components/LocationSection';
import SavedSection from './components/SavedSection';
import ChatbotSection from './components/ChatbotSection';
import RoomModal from './components/RoomModal';
import Footer from './components/Footer';
import { ROOMS } from './data/rooms';

export default function App() {
    const [search, setSearch] = useState('');
    const [priceMax, setPriceMax] = useState(25000);
    const [dist, setDist] = useState('1km');
    const [room, setRoom] = useState('All');
    const [avail, setAvail] = useState('all');
    const [facs, setFacs] = useState([]);
    const [rating, setRating] = useState(0);
    const [sort, setSort] = useState('recommended');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalRoom, setModalRoom] = useState(null);

    function openModal(id) {
        const r = ROOMS.find(x => x.id === id); if (r) setModalRoom(r);
    }

    function onApplySaved(snap) {
        setSearch(snap.search || ''); setPriceMax(snap.priceMax ?? 25000);
        setDist(snap.dist || '1km'); setRoom(snap.room || 'All');
        setAvail(snap.avail || 'all'); setFacs(snap.facs || []);
        setRating(snap.rating ?? 0);
    }

    function onApplyAI(e) {
        if (e.campus) setSearch(e.campus); if (e.pMax) setPriceMax(e.pMax);
        if (e.dist) setDist(e.dist); if (e.room) setRoom(e.room);
        if (e.facs?.length) setFacs(f => [...new Set([...f, ...e.facs])]);
    }

    const filters = { search, priceMax, dist, room, avail, facs, rating, sort };
    const setters = { setSearch, setPriceMax, setDist, setRoom, setAvail, setFacs, setRating, setSort };

    return (
        <ToastProvider>
            <Navbar onFindRooms={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
                onToggleDrawer={() => setDrawerOpen(o => !o)} />
            <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <ScrollDots />

            <HeroSection onFindRooms={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })} />
            <SearchSection filters={filters} setters={setters} onOpenModal={openModal} />
            <LocationSection />
            <SavedSection filters={filters} onApplySaved={onApplySaved} />
            <ChatbotSection onApplyAI={onApplyAI} />

            <Footer />
            {modalRoom && <RoomModal room={modalRoom} onClose={() => setModalRoom(null)} />}
        </ToastProvider>
    );
}
