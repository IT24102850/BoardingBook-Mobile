import { useState } from 'react';
import { ROOMS, campusCoords, roomCoords, haversine, fi } from '../data/rooms';
import { useToast } from '../hooks/useToast';

export default function LocationSection() {
    const toast = useToast();
    const [locSort, setLocSort] = useState('distance');
    const [nearbyRooms, setNearbyRooms] = useState([]);
    const [gpsLabel, setGpsLabel] = useState('Use My Current Location');
    const [gpsLoading, setGpsLoading] = useState(false);
    const [lastArgs, setLastArgs] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    function renderNearby(lat, lng, campus, sort = locSort) {
        setLastArgs([lat, lng, campus]);
        let rooms = ROOMS.map(r => {
            const co = roomCoords[r.id] || { lat: lat + (Math.random() - 0.5) * 0.05, lng: lng + (Math.random() - 0.5) * 0.05 };
            return { ...r, realDist: haversine(lat, lng, co.lat, co.lng) };
        });
        if (campus) rooms = rooms.filter(r => r.campus === campus || r.realDist < 12);
        rooms.sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'rating') return b.rating - a.rating;
            return a.realDist - b.realDist;
        });
        setNearbyRooms(rooms.slice(0, 8));
        setMapLoaded(true);
    }

    function useGPS() {
        setGpsLoading(true); setGpsLabel('Getting location…');
        if (!navigator.geolocation) {
            toast('❌ Geolocation not supported', 'error');
            setGpsLabel('Use My Current Location'); setGpsLoading(false); return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                setGpsLabel('Location found!'); setGpsLoading(false);
                toast('📍 Location acquired!', 'success');
                renderNearby(pos.coords.latitude, pos.coords.longitude, null, locSort);
            },
            () => {
                toast('⚠️ Using demo location.', 'error');
                setGpsLabel('Use My Current Location'); setGpsLoading(false);
                renderNearby(6.9147, 79.9772, null, locSort);
            },
            { timeout: 8000 }
        );
    }

    return (
        <section className="location-section" id="location">
            <div className="container">
                <div className="section-label">📍 Location-Based</div>
                <h2 className="section-title">Discover Rooms <span className="hl">Near You</span></h2>
                <div className="loc-layout">
                    <div className="loc-card">
                        <button className="btn-gps" onClick={useGPS} disabled={gpsLoading}>
                            <i className={`fa-solid ${gpsLoading ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}></i> {gpsLabel}
                        </button>
                        <div className="or-line">OR</div>
                        <select className="select-campus" onChange={e => {
                            const c = campusCoords[e.target.value];
                            if (c) renderNearby(c.lat, c.lng, e.target.value, locSort);
                        }}>
                            <option value="">-- Choose Campus --</option>
                            {Object.keys(campusCoords).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className={`map-area${mapLoaded ? ' loaded' : ''}`}>
                        {!mapLoaded ? (
                            <p className="map-placeholder">Click "Use My Location" to explore</p>
                        ) : (
                            <div className="nearby-list show">
                                {nearbyRooms.map(r => (
                                    <div key={r.id} className="nearby-item">
                                        <div>
                                            <div className="ni-name">{r.name}</div>
                                            <div className="ni-loc">📍 {r.location} · {r.realDist.toFixed(1)}km</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="ni-price">Rs. {r.price.toLocaleString()}</div>
                                            <div style={{ fontSize: '.74rem', color: '#f59e0b' }}>⭐ {r.rating}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
