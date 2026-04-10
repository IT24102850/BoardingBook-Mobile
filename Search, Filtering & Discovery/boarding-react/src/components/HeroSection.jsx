export default function HeroSection({ onFindRooms }) {
    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="hero-inner">

                    <div className="hero-left">
                        <div className="hero-eyebrow">🇱🇰 Sri Lanka's #1 Student Boarding Platform</div>
                        <h1 className="hero-title">
                            Find Verified Rooms<br />
                            <span className="hl">Near Your Campus</span>
                        </h1>
                        <p className="hero-sub">
                            Search, filter, and discover the perfect boarding house –
                            verified listings only, no agents, no scams.
                        </p>
                        <div className="hero-btns">
                            <button className="btn-hero-primary" onClick={onFindRooms}>
                                <i className="fa-solid fa-location-crosshairs"></i> Find Verified Rooms Near Me
                            </button>
                            <button className="btn-hero-outline">
                                <i className="fa-solid fa-plus"></i> List Your Property
                            </button>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-item"><span className="dot"></span>Verified Listings Only</div>
                            <div className="trust-item"><span className="dot"></span>No Agents, No Scams</div>
                            <div className="trust-item"><span className="dot"></span>Near Your Campus</div>
                        </div>
                        <p className="hero-note">Only verified student housing. Find your place before the semester starts.</p>
                    </div>

                    <div className="hero-right">
                        <div className="hero-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=85"
                                alt="Student boarding room in Sri Lanka"
                            />
                            <div className="hero-badge">
                                <span className="badge-star">⭐</span>
                                <span className="badge-text">4.9 Verified</span>
                            </div>
                        </div>
                        <div className="hero-dots">
                            <span className="active"></span><span></span><span></span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
