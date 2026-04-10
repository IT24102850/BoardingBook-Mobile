// ─── ROOMS DATA ───────────────────────────────────
export const ROOMS = [
    {
        id: 1, name: "Malabe Comfort Stay",
        location: "Malabe, Colombo", campus: "SLIIT Malabe",
        distKm: 0.3, price: 8500, roomType: "Single",
        facilities: ["WiFi", "AC", "Bathroom"],
        available: true, rating: 4.8, reviews: 52, owner: "Ruwan Silva",
        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        desc: "Modern, well-furnished single room 300m from SLIIT Malabe. Includes attached bathroom, 24/7 water, and fiber WiFi. Ideal for first-year students."
    },
    {
        id: 2, name: "Nugegoda Student Inn",
        location: "Nugegoda, Colombo", campus: "UOM",
        distKm: 0.8, price: 6500, roomType: "Sharing",
        facilities: ["WiFi", "Meals", "Security"],
        available: true, rating: 4.5, reviews: 38, owner: "Chaminda Perera",
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
        desc: "Budget-friendly sharing room near University of Moratuwa. Home-cooked meals provided twice daily. Safe, gated premises with CCTV."
    },
    {
        id: 3, name: "Nawala Residency",
        location: "Nawala, Rajagiriya", campus: "USJP",
        distKm: 1.2, price: 12000, roomType: "Master",
        facilities: ["WiFi", "AC", "Bathroom", "Parking"],
        available: true, rating: 4.9, reviews: 67, owner: "Dilani Jayawardena",
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
        desc: "Spacious master room with king bed, AC, and en-suite bath near Jayawardenepura University. Secure parking available for bikes."
    },
    {
        id: 4, name: "Kirulapone Budget Boarding",
        location: "Kirulapone, Colombo 5", campus: "UOC",
        distKm: 1.5, price: 5000, roomType: "Sharing",
        facilities: ["WiFi", "Security"],
        available: true, rating: 4.2, reviews: 29, owner: "Pradeep Fernando",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        desc: "Affordable sharing room close to University of Colombo. Great for students on a tight budget. Common study room available."
    },
    {
        id: 5, name: "Homagama Horizon",
        location: "Homagama, Colombo", campus: "NSBM",
        distKm: 0.5, price: 9000, roomType: "Single",
        facilities: ["WiFi", "AC", "Meals", "Bathroom"],
        available: true, rating: 4.7, reviews: 44, owner: "Tharanga Bandara",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
        desc: "Modern single annex 500m from NSBM Green University. Includes daily meals, AC, private bath, and superfast WiFi."
    },
    {
        id: 6, name: "Wellawatte Seaside Room",
        location: "Wellawatte, Colombo 6", campus: "UOC",
        distKm: 2.0, price: 15000, roomType: "Annex",
        facilities: ["WiFi", "AC", "Bathroom", "Security"],
        available: false, rating: 4.6, reviews: 31, owner: "Kasun Wickramasinghe",
        img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        desc: "Premium annex unit near Colombo 6. Sea breeze, fully furnished with wardrobe, study desk, and private AC bathroom."
    },
    {
        id: 7, name: "Battaramulla City Nest",
        location: "Battaramulla, Colombo", campus: "SLIIT City",
        distKm: 3.5, price: 11000, roomType: "Single",
        facilities: ["WiFi", "Meals", "Parking", "Security"],
        available: true, rating: 4.4, reviews: 19, owner: "Nimasha Rathnayake",
        img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
        desc: "Clean and modern single room near Battaramulla with meals and parking. Easy commute to SLIIT City campus."
    },
    {
        id: 8, name: "Kandy Hill View Boarding",
        location: "Peradeniya, Kandy", campus: "UOK",
        distKm: 0.7, price: 7000, roomType: "Sharing",
        facilities: ["WiFi", "Meals"],
        available: true, rating: 4.3, reviews: 25, owner: "Sanduni Gunawardena",
        img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80",
        desc: "Scenic hill-view boarding near University of Kandy (Peradeniya). Sharing room with friendly housemates. Homemade Sri Lankan meals included."
    },
    {
        id: 9, name: "Malabe Premium Annex",
        location: "Malabe, Colombo", campus: "SLIIT Malabe",
        distKm: 0.2, price: 18000, roomType: "Annex",
        facilities: ["WiFi", "AC", "Bathroom", "Parking", "Security", "Laundry"],
        available: true, rating: 5.0, reviews: 12, owner: "Indika Jayasuriya",
        img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
        desc: "Luxury annex 200m from SLIIT Malabe gate. Brand new, fully furnished with smart TV, inverter AC, geyser, and fiber internet."
    },
    {
        id: 10, name: "Thurstan Road Flat Share",
        location: "Thurstan Road, Colombo 3", campus: "UOC",
        distKm: 0.6, price: 9500, roomType: "Sharing",
        facilities: ["WiFi", "AC", "Security"],
        available: true, rating: 4.1, reviews: 17, owner: "Malini Dias",
        img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
        desc: "Flat share in central Colombo 3, walking distance from UOC campus. AC, fiber WiFi, modern kitchen."
    },
    {
        id: 11, name: "Moratuwa Marina Boarding",
        location: "Moratuwa, Colombo", campus: "UOM",
        distKm: 0.4, price: 7500, roomType: "Single",
        facilities: ["WiFi", "Meals", "Bathroom"],
        available: true, rating: 4.6, reviews: 33, owner: "Asanka Herath",
        img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
        desc: "Popular single room boarding for Mora students. Home meals, private bath, and study-friendly environment."
    },
    {
        id: 12, name: "IIT-Colombo Student Pad",
        location: "Slave Island, Colombo 2", campus: "IIT",
        distKm: 0.9, price: 13500, roomType: "Master",
        facilities: ["WiFi", "AC", "Bathroom", "Security", "Gym"],
        available: false, rating: 4.7, reviews: 22, owner: "Ravi Cooray",
        img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
        desc: "Master room near IIT Colombo in Slave Island. Premium neighbourhood, fully equipped with gym access."
    }
];

export const distMap = { '500m': 0.5, '1km': 1, '2km': 2, '5km': 5, 'any': 9999 };

export const facIco = {
    WiFi: '📶', AC: '❄️', Meals: '🍽️', Bathroom: '🚿',
    Parking: '🅿️', Security: '🔒', Laundry: '🧺', Gym: '💪'
};
export function fi(f) { return (facIco[f] || '✔') + ' ' + f; }

export const campusCoords = {
    'SLIIT Malabe': { lat: 6.9147, lng: 79.9772 },
    'SLIIT City': { lat: 6.9271, lng: 79.8612 },
    'UOM': { lat: 6.7958, lng: 79.9009 },
    'USJP': { lat: 6.8951, lng: 80.0036 },
    'UOC': { lat: 6.9022, lng: 79.8611 },
    'UOK': { lat: 7.2548, lng: 80.5944 },
    'NSBM': { lat: 6.8214, lng: 80.0355 },
    'IIT': { lat: 6.9175, lng: 79.8466 },
    'SAITM': { lat: 6.9214, lng: 79.9755 },
    'Aquinas': { lat: 6.9108, lng: 79.8498 }
};

export const roomCoords = {
    1: { lat: 6.9152, lng: 79.9775 }, 2: { lat: 6.8287, lng: 79.9033 },
    3: { lat: 6.8975, lng: 80.0021 }, 4: { lat: 6.8888, lng: 79.8811 },
    5: { lat: 6.8221, lng: 80.0360 }, 6: { lat: 6.8719, lng: 79.8632 },
    7: { lat: 6.8891, lng: 79.9182 }, 8: { lat: 7.2561, lng: 80.5948 },
    9: { lat: 6.9148, lng: 79.9768 }, 10: { lat: 6.9044, lng: 79.8613 },
    11: { lat: 6.7964, lng: 79.9012 }, 12: { lat: 6.9210, lng: 79.8479 }
};

export const NLP = {
    'sliit malabe': '@SLIIT Malabe', 'sliit city': '@SLIIT City', 'sliit': '@SLIIT Malabe',
    'malabe': '@SLIIT Malabe', 'mora': '@UOM', 'uom': '@UOM', 'moratuwa': '@UOM',
    'usjp': '@USJP', 'jayawardenepura': '@USJP', 'uoc': '@UOC',
    'colombo university': '@UOC', 'kandy': '@UOK', 'uok': '@UOK', 'peradeniya': '@UOK',
    'nsbm': '@NSBM', 'homagama': '@NSBM', 'iit': '@IIT',
    'cheap': { pMax: 8000 }, 'budget': { pMax: 8000 }, 'affordable': { pMax: 10000 },
    'luxury': { pMin: 15000 }, 'premium': { pMin: 15000 },
    'walking distance': { dist: '500m' }, 'walking': { dist: '500m' },
    'nearby': { dist: '1km' }, '1km': { dist: '1km' }, '2km': { dist: '2km' },
    'within 500m': { dist: '500m' }, 'within 1km': { dist: '1km' }, 'within 2km': { dist: '2km' },
    'single': { room: 'Single' }, 'master': { room: 'Master' },
    'sharing': { room: 'Sharing' }, 'annex': { room: 'Annex' },
    'wifi': { fac: 'WiFi' }, 'wi-fi': { fac: 'WiFi' }, 'internet': { fac: 'WiFi' },
    'ac': { fac: 'AC' }, 'air conditioned': { fac: 'AC' }, 'air-conditioned': { fac: 'AC' },
    'meals': { fac: 'Meals' }, 'food': { fac: 'Meals' }, 'breakfast': { fac: 'Meals' },
    'bathroom': { fac: 'Bathroom' }, 'private bath': { fac: 'Bathroom' },
    'parking': { fac: 'Parking' }, 'security': { fac: 'Security' },
    'laundry': { fac: 'Laundry' }, 'gym': { fac: 'Gym' },
    'available': { avail: 'available' },
};

export function haversine(a, b, c, d) {
    const R = 6371, dLat = (c - a) * Math.PI / 180, dLng = (d - b) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function parseNLP(text) {
    const low = text.toLowerCase();
    const ext = { campus: null, pMin: null, pMax: null, dist: null, room: null, facs: [], avail: null };
    for (const [kw, val] of Object.entries(NLP)) {
        if (!low.includes(kw)) continue;
        if (typeof val === 'string' && val.startsWith('@')) { ext.campus = val.slice(1); continue; }
        if (val.pMax && (!ext.pMax || val.pMax < ext.pMax)) ext.pMax = val.pMax;
        if (val.pMin && (!ext.pMin || val.pMin > ext.pMin)) ext.pMin = val.pMin;
        if (val.dist) ext.dist = val.dist;
        if (val.room) ext.room = val.room;
        if (val.fac && !ext.facs.includes(val.fac)) ext.facs.push(val.fac);
        if (val.avail) ext.avail = val.avail;
    }
    const pmatch = low.match(/(?:below|under|less than|max)\s*(?:rs\.?\s*)?(\d{3,6})/i);
    if (pmatch) ext.pMax = parseInt(pmatch[1]);
    const pmin = low.match(/(?:above|over|more than|min)\s*(?:rs\.?\s*)?(\d{3,6})/i);
    if (pmin) ext.pMin = parseInt(pmin[1]);
    return ext;
}

export function buildReply(e) {
    const p = [];
    if (e.campus) p.push(`near <strong>${e.campus}</strong>`);
    if (e.pMax) p.push(`within <strong>Rs. ${e.pMax.toLocaleString()}/mo</strong>`);
    if (e.pMin) p.push(`above <strong>Rs. ${e.pMin.toLocaleString()}/mo</strong>`);
    if (e.dist) p.push(`within <strong>${e.dist}</strong> of campus`);
    if (e.room) p.push(`a <strong>${e.room}</strong> room`);
    if (e.facs.length) p.push(`with <strong>${e.facs.join(', ')}</strong>`);
    if (e.avail) p.push(`that is <strong>${e.avail}</strong>`);
    if (p.length === 0) return `I couldn't find specific filters in that message. Try: <em>"cheap single room near SLIIT Malabe with WiFi"</em>`;
    return `Got it! I'm looking for ${p.join(', ')}. I've extracted the filters for you — click <strong>Apply These Filters</strong> to see the results! 🔎`;
}
