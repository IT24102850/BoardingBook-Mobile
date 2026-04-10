import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiStar, BiMap, BiGroup, BiHome } from 'react-icons/bi';
import { ArrowRight } from 'lucide-react';

const API = 'http://localhost:5001/api';

interface Listing {
  _id: string;
  name: string;
  address: string;
  monthlyPrice: number;
  deposit?: number;
  roomType?: string;
  genderPreference?: string;
  rating?: number;
  totalReviews?: number;
  features?: string[];
  image?: string;
  images?: string[];
  description?: string;
}

// Gradient palettes for cards without images
const CARD_GRADIENTS = [
  'from-indigo-600/30 to-cyan-600/20',
  'from-purple-600/30 to-indigo-600/20',
  'from-cyan-600/30 to-blue-600/20',
  'from-violet-600/30 to-purple-600/20',
  'from-blue-600/30 to-indigo-600/20',
  'from-indigo-500/30 to-violet-600/20',
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <BiStar
          key={i}
          size={13}
          className={i < full ? 'text-yellow-400' : half && i === full ? 'text-yellow-400/60' : 'text-white/20'}
        />
      ))}
    </span>
  );
}

function ListingCard({ listing, index }: { listing: Listing; index: number }) {
  const navigate = useNavigate();
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const hasImage = !!(listing.image || (listing.images && listing.images.length > 0));
  const imgSrc = listing.image || listing.images?.[0] || '';
  const topFeatures = (listing.features || []).slice(0, 3);

  return (
    <div
      className="group relative flex-shrink-0 w-72 sm:w-auto bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
      onClick={() => navigate('/find')}
    >
      {/* Image / Gradient Hero */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {hasImage ? (
          <img
            src={imgSrc}
            alt={listing.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BiHome size={48} className="text-white/10" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1124] via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-sm bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
            Rs. {listing.monthlyPrice.toLocaleString()}<span className="text-white/50 font-normal text-xs">/mo</span>
          </span>
        </div>

        {/* Gender badge */}
        {listing.genderPreference && listing.genderPreference !== 'any' && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${listing.genderPreference === 'girls' ? 'bg-pink-500/20 border-pink-400/30 text-pink-300' : 'bg-blue-500/20 border-blue-400/30 text-blue-300'}`}>
              {listing.genderPreference === 'girls' ? 'Girls Only' : 'Boys Only'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-cyan-200 transition-colors">
          {listing.name}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
          <BiMap size={12} className="flex-shrink-0" />
          <span className="truncate">{listing.address}</span>
        </div>

        {/* Rating + Room type row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {listing.rating && listing.rating > 0 ? (
              <>
                <StarRating rating={listing.rating} />
                <span className="text-yellow-400 text-xs font-semibold">{listing.rating.toFixed(1)}</span>
                {listing.totalReviews ? (
                  <span className="text-white/30 text-xs">({listing.totalReviews})</span>
                ) : null}
              </>
            ) : (
              <span className="text-white/25 text-xs">No reviews yet</span>
            )}
          </div>
          {listing.roomType && (
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
              {listing.roomType}
            </span>
          )}
        </div>

        {/* Feature tags */}
        {topFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {topFeatures.map(f => (
              <span key={f} className="text-[10px] text-cyan-400/70 bg-cyan-500/8 border border-cyan-500/15 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 transition-all duration-200 group-hover:border-cyan-500/30 group-hover:text-cyan-300">
          View Details <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-72 sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden animate-pulse">
      <div className="h-40 bg-white/[0.05]" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/[0.06] rounded-full w-3/4" />
        <div className="h-2.5 bg-white/[0.04] rounded-full w-1/2" />
        <div className="h-2.5 bg-white/[0.04] rounded-full w-2/3" />
        <div className="h-7 bg-white/[0.04] rounded-xl mt-4" />
      </div>
    </div>
  );
}

export function ListingsSection() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/owner/public/houses`)
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          setListings(d.data.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // If not loading and no listings — don't render the section
  if (!loading && listings.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8 md:mb-10">
        <div>
          <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">Near SLIIT Campus</p>
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
            Featured <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Listings</span>
          </h2>
        </div>
        <button
          onClick={() => navigate('/find')}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-cyan-400 transition-colors font-medium"
        >
          View all <ArrowRight size={15} />
        </button>
      </div>

      {/* Cards — horizontal scroll on mobile, grid on desktop */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* Mobile: horizontal scroll */}
          <div className="flex sm:hidden gap-4 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
            {listings.map((l, i) => (
              <div key={l._id} className="snap-start">
                <ListingCard listing={l} index={i} />
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l, i) => (
              <ListingCard key={l._id} listing={l} index={i} />
            ))}
          </div>
        </>
      )}

      {/* Bottom CTA strip */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="text-white/40 text-sm text-center">
          Can't find what you're looking for?
        </div>
        <button
          onClick={() => navigate('/find')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-indigo-500/80 to-cyan-500/80 hover:from-indigo-500 hover:to-cyan-500 border border-indigo-500/30 shadow-lg shadow-indigo-500/15 transition-all duration-200 hover:scale-105"
        >
          Browse All Rooms <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}
