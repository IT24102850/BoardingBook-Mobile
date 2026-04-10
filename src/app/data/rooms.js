// ─── ROOMS DATA ───────────────────────────────────
export const ROOMS = [
    {
        id: 1, name: "Malabe Comfort Stay",
        location: "Malabe, Colombo", campus: "SLIIT Malabe",
        distKm: 0.3, price: 8500, roomType: "Single",
        facilities: ["WiFi", "AC", "Bathroom"],
        available: true, rating: 4.8, reviews: 52, owner: "Ruwan Silva",
        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        desc: "Modern, well-furnished single room 300m from SLIIT Malabe. Includes attached bathroom, 24/7 water, and fiber WiFi. Ideal for first-year students.",
        vacancy: "low", totalRooms: 5, occupiedRooms: 4
    },
    {
        id: 2, name: "Nugegoda Student Inn",
        location: "Nugegoda, Colombo", campus: "UOM",
        distKm: 0.8, price: 6500, roomType: "Sharing",
        facilities: ["WiFi", "Meals", "Security"],
        available: true, rating: 4.5, reviews: 38, owner: "Chaminda Perera",
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
        desc: "Budget-friendly sharing room near University of Moratuwa. Home-cooked meals provided twice daily. Safe, gated premises with CCTV.",
        vacancy: "available", totalRooms: 8, occupiedRooms: 3
    },
    {
        id: 3, name: "Nawala Residency",
        location: "Nawala, Rajagiriya", campus: "USJP",
        distKm: 1.2, price: 12000, roomType: "Master",
        facilities: ["WiFi", "AC", "Bathroom", "Parking"],
        available: true, rating: 4.9, reviews: 67, owner: "Dilani Jayawardena",
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
        desc: "Spacious master room with king bed, AC, and en-suite bath near Jayawardenepura University. Secure parking available for bikes.",
        vacancy: "available", totalRooms: 12, occupiedRooms: 4
    },
    {
        id: 4, name: "Kirulapone Budget Boarding",
        location: "Kirulapone, Colombo 5", campus: "UOC",
        distKm: 1.5, price: 5000, roomType: "Sharing",
        facilities: ["WiFi", "Security"],
        available: true, rating: 4.2, reviews: 29, owner: "Pradeep Fernando",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        desc: "Affordable sharing room close to University of Colombo. Great for students on a tight budget. Common study room available.",
        vacancy: "full", totalRooms: 6, occupiedRooms: 6
    },
    {
        id: 5, name: "Homagama Horizon",
        location: "Homagama, Colombo", campus: "NSBM",
        distKm: 0.5, price: 9000, roomType: "Single",
        facilities: ["WiFi", "AC", "Meals", "Bathroom"],
        available: true, rating: 4.7, reviews: 44, owner: "Tharanga Bandara",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
        desc: "Modern single annex 500m from NSBM Green University. Includes daily meals, AC, private bath, and superfast WiFi.",
        vacancy: "coming", totalRooms: 4, occupiedRooms: 2
    },
    {
        id: 6, name: "Malabe Premium Annex",
        location: "Malabe, Colombo", campus: "SLIIT Malabe",
        distKm: 0.2, price: 18000, roomType: "Annex",
        facilities: ["WiFi", "AC", "Bathroom", "Parking", "Security", "Laundry"],
        available: true, rating: 5.0, reviews: 12, owner: "Indika Jayasuriya",
        img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
        desc: "Luxury annex 200m from SLIIT Malabe gate. Brand new, fully furnished with smart TV, inverter AC, geyser, and fiber internet.",
        vacancy: "available", totalRooms: 10, occupiedRooms: 2
    },
    {
        id: 7, name: "Nugegoda Premium Stay",
        location: "Nugegoda, Colombo", campus: "UOM",
        distKm: 0.5, price: 14000, roomType: "Master",
        facilities: ["WiFi", "AC", "Bathroom", "Meals", "Security"],
        available: true, rating: 4.7, reviews: 45, owner: "Nimal Perera",
        img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        desc: "Premium master room with all facilities near University of Moratuwa. Daily meals included with vegetarian options.",
        vacancy: "low", totalRooms: 3, occupiedRooms: 2
    },
    {
        id: 8, name: "Colombo City Boarding",
        location: "Colombo 3", campus: "UOC",
        distKm: 0.6, price: 9500, roomType: "Sharing",
        facilities: ["WiFi", "AC", "Security"],
        available: true, rating: 4.1, reviews: 17, owner: "Malini Dias",
        img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
        desc: "Flat share in central Colombo 3, walking distance from UOC campus. AC, fiber WiFi, modern kitchen.",
        vacancy: "available", totalRooms: 9, occupiedRooms: 1
    }
];

// ─── ROOMMATES DATA ───────────────────────────────────
export const ROOMMATES = [
    {
        id: 1, name: "Ayesha Silva", age: 21, gender: "Female",
        university: "SLIIT", year: "2nd Year", major: "Computer Science",
        budget: 12000, location: "Malabe",
        preferences: "Early riser, non-smoker, quiet environment",
        hobbies: ["Reading", "Cooking", "Yoga"],
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        lookingFor: "Female roommate with similar habits",
        tags: ["Clean", "Quiet", "Vegetarian"]
    },
    {
        id: 2, name: "Nuwan Fernando", age: 22, gender: "Male",
        university: "UOM", year: "3rd Year", major: "Engineering",
        budget: 15000, location: "Nugegoda",
        preferences: "Night owl, social, likes guests",
        hobbies: ["Music", "Gaming", "Sports"],
        img: "https://randomuser.me/api/portraits/men/34.jpg",
        lookingFor: "Male roommate who enjoys group activities",
        tags: ["Social", "Music Lover", "Active"]
    },
    {
        id: 3, name: "Sithara Perera", age: 20, gender: "Female",
        university: "NSBM", year: "1st Year", major: "Business",
        budget: 11000, location: "Homagama",
        preferences: "Pet friendly, early bedtime, no parties",
        hobbies: ["Painting", "Meditation", "Gardening"],
        img: "https://randomuser.me/api/portraits/women/68.jpg",
        lookingFor: "Calm female roommate, pet friendly",
        tags: ["Quiet", "Pet Friendly", "Artistic"]
    },
    {
        id: 4, name: "Kamal Jayawardena", age: 23, gender: "Male",
        university: "UOC", year: "4th Year", major: "Law",
        budget: 10000, location: "Colombo",
        preferences: "Organized, likes cooking together",
        hobbies: ["Debating", "Reading", "Cycling"],
        img: "https://randomuser.me/api/portraits/men/52.jpg",
        lookingFor: "Responsible male roommate",
        tags: ["Organized", "Mature", "Academic"]
    }
];

// ─── SERVICES DATA ───────────────────────────────────
export const SERVICES = [
    { id: 1, name: "Booking Agreement", desc: "Secure digital agreements for boarding bookings", icon: "📝", link: "/booking-agreement" },
    { id: 2, name: "Payment & Rental", desc: "Easy payment processing for monthly rentals", icon: "💳", link: "/payment-rental" },
    { id: 3, name: "Roommate Finder", desc: "Find compatible roommates with AI matching", icon: "👥", link: "/roommate-finder" },
    { id: 4, name: "Search & Discovery", desc: "Browse and filter boarding places", icon: "🔍", link: "/find" },
    { id: 5, name: "Profile Setup", desc: "Complete your student profile", icon: "👤", link: "/profile-setup" },
    { id: 6, name: "Administration", desc: "Management dashboard for boarding owners", icon: "⚙️", link: "/admin-monitoring" }
];

// ─── NLP PARSING FUNCTIONS ───────────────────────────────────
export function parseNLP(text) {
    const lower = text.toLowerCase();
    const extracted = {
        campus: null,
        location: null,
        pMax: null,
        pMin: null,
        dist: null,
        room: null,
        facs: [],
        gender: null,
        service: null,
        intent: null
    };

    // Detect intent
    if (/roommate|roommie|partner|share with|looking for (a )?roommate/i.test(lower)) {
        extracted.intent = 'roommate';
    } else if (/service|help|need|how to|can you|agreement|payment|book/i.test(lower)) {
        extracted.intent = 'service';
    } else {
        extracted.intent = 'boarding';
    }

    // Campus detection
    const campusMap = {
        'sliit': 'SLIIT Malabe',
        'malabe': 'SLIIT Malabe',
        'uom': 'UOM',
        'moratuwa': 'UOM',
        'university of moratuwa': 'UOM',
        'uoc': 'UOC',
        'colombo': 'UOC',
        'university of colombo': 'UOC',
        'nsbm': 'NSBM',
        'homagama': 'NSBM',
        'usjp': 'USJP',
        'jayawardenepura': 'USJP'
    };

    for (const [key, val] of Object.entries(campusMap)) {
        if (lower.includes(key)) {
            extracted.campus = val;
            break;
        }
    }

    // Location detection
    const locationMap = {
        'malabe': 'Malabe',
        'nugegoda': 'Nugegoda',
        'homagama': 'Homagama',
        'colombo 3': 'Colombo 3',
        'colombo': 'Colombo',
        'nawala': 'Nawala',
        'kirulapone': 'Kirulapone'
    };

    for (const [key, val] of Object.entries(locationMap)) {
        if (lower.includes(key)) {
            extracted.location = val;
            break;
        }
    }

    // Price detection
    const priceMatch = lower.match(/(?:under|below|less than|max|maximum)\s*(?:rs\.?\s*)?(\d+(?:,\d+)?)/);
    if (priceMatch) {
        extracted.pMax = parseInt(priceMatch[1].replace(',', ''));
    }

    const priceMatch2 = lower.match(/(?:above|over|more than|min|minimum)\s*(?:rs\.?\s*)?(\d+(?:,\d+)?)/);
    if (priceMatch2) {
        extracted.pMin = parseInt(priceMatch2[1].replace(',', ''));
    }

    // Generic price detection
    const priceMatch3 = lower.match(/(\d+(?:,\d+)?)\s*(?:rs|rupees)/);
    if (priceMatch3 && !extracted.pMax) {
        extracted.pMax = parseInt(priceMatch3[1].replace(',', ''));
    }

    // Distance detection
    if (/within\s*(\d+)\s*km|(\d+)\s*km/.test(lower)) {
        const distMatch = lower.match(/(\d+)\s*km/);
        if (distMatch) extracted.dist = distMatch[1] + 'km';
    }

    // Room type detection
    if (/single|alone|private room|individual/.test(lower)) extracted.room = 'Single';
    if (/sharing|shared|roommate|double/.test(lower)) extracted.room = 'Sharing';
    if (/master|large|big room/.test(lower)) extracted.room = 'Master';
    if (/annex|studio|separate/.test(lower)) extracted.room = 'Annex';

    // Facilities detection
    const facilityMap = {
        'wifi': 'WiFi',
        'internet': 'WiFi',
        'ac': 'AC',
        'air condition': 'AC',
        'meals': 'Meals',
        'food': 'Meals',
        'bathroom': 'Bathroom',
        'attached bath': 'Bathroom',
        'parking': 'Parking',
        'security': 'Security',
        'laundry': 'Laundry',
        'washing': 'Laundry'
    };

    for (const [key, val] of Object.entries(facilityMap)) {
        if (lower.includes(key) && !extracted.facs.includes(val)) {
            extracted.facs.push(val);
        }
    }

    // Gender detection (for roommates)
    if (/\b(male|boy|guy)\b/.test(lower) && !/female/.test(lower)) extracted.gender = 'Male';
    if (/\b(female|girl|woman)\b/.test(lower) && !/male/.test(lower)) extracted.gender = 'Female';

    // Service detection
    if (/book|booking|agreement|contract/.test(lower)) extracted.service = 'booking';
    if (/pay|payment|rent|rental/.test(lower)) extracted.service = 'payment';
    if (/admin|owner|manage/.test(lower)) extracted.service = 'admin';

    return extracted;
}

// ─── BUILD REPLY ───────────────────────────────────
export function buildReply(extracted) {
    const { intent, campus, location, pMax, pMin, dist, room, facs, gender, service } = extracted;

    // Handle service requests
    if (intent === 'service' || service) {
        if (service === 'booking') {
            return `📝 <strong>Booking Agreement Service</strong><br>I can help you create secure digital agreements! Visit the <a href="/booking-agreement">Booking Agreement Page</a> to get started.`;
        }
        if (service === 'payment') {
            return `💳 <strong>Payment & Rental Service</strong><br>Manage your monthly payments easily! Check out the <a href="/payment-rental">Payment & Rental Page</a>.`;
        }
        if (service === 'admin') {
            return `⚙️ <strong>Administration Service</strong><br>For boarding owners and admin management, visit the <a href="/admin-monitoring">Administration Dashboard</a>.`;
        }
        
        // Generic service list
        let serviceList = '<strong>Available Services:</strong><br><ul style="margin: 5px 0; padding-left: 20px;">';
        SERVICES.forEach(s => {
            serviceList += `<li>${s.icon} <strong>${s.name}</strong>: ${s.desc}</li>`;
        });
        serviceList += '</ul>';
        return serviceList;
    }

    // Handle roommate requests
    if (intent === 'roommate') {
        let reply = `👥 <strong>Finding Roommates</strong><br>I found potential roommates for you!<br><br>`;
        
        const filtered = ROOMMATES.filter(rm => {
            if (gender && rm.gender !== gender) return false;
            if (pMax && rm.budget > pMax) return false;
            if (location && !rm.location.toLowerCase().includes(location.toLowerCase())) return false;
            return true;
        });

        if (filtered.length > 0) {
            reply += `<strong>${filtered.length} match(es) found:</strong><br><ul style="margin: 5px 0; padding-left: 20px;">`;
            filtered.slice(0, 3).forEach(rm => {
                reply += `<li><strong>${rm.name}</strong> (${rm.gender}, ${rm.year}) - Rs. ${rm.budget}/month in ${rm.location}<br><em>${rm.lookingFor}</em></li>`;
            });
            reply += `</ul><br>Visit the <a href="/roommate-finder">Roommate Finder Page</a> for more details!`;
        } else {
            reply += `Sorry, no exact matches found. Visit the <a href="/roommate-finder">Roommate Finder Page</a> to browse all roommates!`;
        }
        
        return reply;
    }

    // Handle boarding searches
    let reply = '🏠 <strong>Searching for Boarding Places...</strong><br><br>';
    
    const filtered = ROOMS.filter(r => {
        if (campus && r.campus !== campus) return false;
        if (location && !r.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (pMax && r.price > pMax) return false;
        if (pMin && r.price < pMin) return false;
        if (room && r.roomType !== room) return false;
        if (facs.length > 0 && !facs.every(f => r.facilities.includes(f))) return false;
        return true;
    });

    if (filtered.length > 0) {
        reply += `<strong>${filtered.length} boarding place(s) found:</strong><br><ul style="margin: 5px 0; padding-left: 20px;">`;
        filtered.slice(0, 3).forEach(r => {
            reply += `<li><strong>${r.name}</strong> - Rs. ${r.price}/month (${r.roomType})<br>${r.location} - ${r.distKm}km from ${r.campus}<br>Facilities: ${r.facilities.join(', ')}</li>`;
        });
        reply += `</ul><br>Click "Apply Filters" to see all results on the search page!`;
    } else {
        reply += `I couldn't find exact matches. Try adjusting your criteria or visit <a href="/find">Search & Discovery</a> to browse all options!`;
    }

    if (campus) reply += `<br>📍 Campus: <strong>${campus}</strong>`;
    if (pMax) reply += `<br>💰 Budget: <strong>Under Rs. ${pMax}</strong>`;
    if (room) reply += `<br>🛏️ Room Type: <strong>${room}</strong>`;
    if (facs.length) reply += `<br>✨ Facilities: <strong>${facs.join(', ')}</strong>`;

    return reply;
}

// ─── FACILITY ICONS ───────────────────────────────────
export const facIco = { WiFi: '📶', AC: '❄️', Meals: '🍽️', Bathroom: '🚿', Parking: '🅿️', Security: '🔒', Laundry: '👕' };

// ─── FACILITY FORMATTER ───────────────────────────────────
export const fi = (facility) => `${facIco[facility] || '✨'} ${facility}`;

// ─── DISTANCE MAP ───────────────────────────────────────
export const distMap = {
  '0-1': 1,
  '0-2': 2,
  '0-3': 3,
  '0-5': 5,
  '0-10': 10,
  'any': 9999
};
