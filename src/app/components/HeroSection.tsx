import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { Typewriter } from './ui/Typewriter';
import {
  BiBuilding, BiKey, BiStar, BiMap, BiGroup,
  BiShield, BiCheckCircle, BiWifi, BiBot, BiBookOpen,
} from 'react-icons/bi';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';

// ─────────────────────────────────────────────
// LOTTIE: Inline "Floating Key + Sparkles" animation
// Built from scratch — no external URL dependency
// ─────────────────────────────────────────────
const KEY_LOTTIE = {
  v: '5.9.0', fr: 30, ip: 0, op: 90, w: 120, h: 120,
  nm: 'KeySparkle', ddd: 0, assets: [],
  layers: [
    // Key body (rotating + floating)
    {
      ddd: 0, ind: 1, ty: 4, nm: 'Key', sr: 1, ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [
          { t: 0,  s: [-15], e: [15],  i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 45, s: [15],  e: [-15], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 90, s: [-15] }
        ]},
        p: { a: 1, k: [
          { t: 0,  s: [60,70,0], e: [60,50,0], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 45, s: [60,50,0], e: [60,70,0], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 90, s: [60,70,0] }
        ]},
        a: { a: 0, k: [0,0,0] },
        s: { a: 0, k: [100,100,100] }
      },
      shapes: [
        // Key ring (circle)
        { ty: 'el', d: 1, s: { a: 0, k: [28,28] }, p: { a: 0, k: [-10,0] }, nm: 'Ring' },
        { ty: 'st', c: { a: 0, k: [0.13,0.83,0.93,1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 2, nm: 'Stroke' },
        { ty: 'fl', c: { a: 0, k: [0.05,0.1,0.2,1] }, o: { a: 0, k: 100 }, nm: 'Fill' },
        // Key shaft
        { ty: 'rc', d: 1, s: { a: 0, k: [36,8] }, p: { a: 0, k: [14,0] }, r: { a: 0, k: 4 }, nm: 'Shaft' },
        { ty: 'st', c: { a: 0, k: [0.13,0.83,0.93,1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 2, nm: 'ShaftStroke' },
        // Teeth
        { ty: 'rc', d: 1, s: { a: 0, k: [6,10] }, p: { a: 0, k: [22,5] }, r: { a: 0, k: 2 }, nm: 'Tooth1' },
        { ty: 'st', c: { a: 0, k: [0.13,0.83,0.93,1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 2, nm: 'T1Stroke' },
        { ty: 'rc', d: 1, s: { a: 0, k: [6,14] }, p: { a: 0, k: [30,7] }, r: { a: 0, k: 2 }, nm: 'Tooth2' },
        { ty: 'st', c: { a: 0, k: [0.5,0.55,0.97,1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 2, nm: 'T2Stroke' },
      ],
      ip: 0, op: 90, st: 0, bm: 0
    },
    // Sparkle 1 (top-right)
    {
      ddd: 0, ind: 2, ty: 4, nm: 'Spark1', sr: 1, ks: {
        o: { a: 1, k: [
          { t: 0,  s: [0],   e: [100], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 20, s: [100], e: [0],   i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 40, s: [0] }
        ]},
        p: { a: 0, k: [90,20,0] },
        s: { a: 1, k: [
          { t: 0,  s: [0,0,100],     e: [100,100,100], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 20, s: [100,100,100], e: [0,0,100],     i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 40, s: [0,0,100] }
        ]},
        r: { a: 0, k: 0 }, a: { a: 0, k: [0,0,0] }
      },
      shapes: [
        { ty: 'sr', sy: 1, d: 1, pt: { a: 0, k: 4 }, p: { a: 0, k: [0,0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 4 }, is: { a: 0, k: 0 }, or: { a: 0, k: 10 }, os: { a: 0, k: 0 }, ix: 1, nm: 'Star' },
        { ty: 'fl', c: { a: 0, k: [0.98,0.86,0.37,1] }, o: { a: 0, k: 100 }, nm: 'Fill' },
      ],
      ip: 0, op: 90, st: 0, bm: 0
    },
    // Sparkle 2 (bottom-left, offset timing)
    {
      ddd: 0, ind: 3, ty: 4, nm: 'Spark2', sr: 1, ks: {
        o: { a: 1, k: [
          { t: 20, s: [0],   e: [100], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 40, s: [100], e: [0],   i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 60, s: [0] }
        ]},
        p: { a: 0, k: [25,85,0] },
        s: { a: 0, k: [80,80,100] },
        r: { a: 0, k: 45 }, a: { a: 0, k: [0,0,0] }
      },
      shapes: [
        { ty: 'sr', sy: 1, d: 1, pt: { a: 0, k: 4 }, p: { a: 0, k: [0,0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 3 }, is: { a: 0, k: 0 }, or: { a: 0, k: 8 }, os: { a: 0, k: 0 }, ix: 1, nm: 'Star2' },
        { ty: 'fl', c: { a: 0, k: [0.5,0.55,0.97,1] }, o: { a: 0, k: 100 }, nm: 'Fill2' },
      ],
      ip: 0, op: 90, st: 0, bm: 0
    },
    // Sparkle 3 (centre, delayed)
    {
      ddd: 0, ind: 4, ty: 4, nm: 'Spark3', sr: 1, ks: {
        o: { a: 1, k: [
          { t: 45, s: [0],   e: [100], i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 65, s: [100], e: [0],   i: { x:[0.5], y:[1] }, o: { x:[0.5], y:[0] } },
          { t: 85, s: [0] }
        ]},
        p: { a: 0, k: [80,90,0] },
        s: { a: 0, k: [60,60,100] },
        r: { a: 0, k: 20 }, a: { a: 0, k: [0,0,0] }
      },
      shapes: [
        { ty: 'sr', sy: 1, d: 1, pt: { a: 0, k: 4 }, p: { a: 0, k: [0,0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 3 }, is: { a: 0, k: 0 }, or: { a: 0, k: 7 }, os: { a: 0, k: 0 }, ix: 1, nm: 'Star3' },
        { ty: 'fl', c: { a: 0, k: [0.13,0.83,0.93,1] }, o: { a: 0, k: 100 }, nm: 'Fill3' },
      ],
      ip: 0, op: 90, st: 0, bm: 0
    },
  ]
} as unknown as object;

// ─────────────────────────────────────────────
// LOTTIE WRAPPER COMPONENT
// ─────────────────────────────────────────────
const LottieKeySparkle: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: KEY_LOTTIE,
    });
    return () => anim.destroy();
  }, []);
  return <div ref={ref} className={className} style={style} />;
};

// ─────────────────────────────────────────────
// SVG CHARACTER: Animated House
// ─────────────────────────────────────────────
const HouseCharacter: React.FC = () => (
  <svg
    viewBox="0 0 140 160"
    width="140"
    height="160"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 0 18px rgba(34,211,238,0.35))' }}
  >
    {/* ── Chimney ── */}
    <rect x="88" y="28" width="12" height="28" rx="3" fill="#1e2a4a" stroke="#22d3ee" strokeWidth="1.5" />
    {/* Smoke puffs */}
    <circle cx="94" cy="26" r="4" fill="rgba(200,220,255,0.18)" style={{ animation: 'bbSmoke 2.4s ease-out infinite' }} />
    <circle cx="92" cy="18" r="5.5" fill="rgba(200,220,255,0.12)" style={{ animation: 'bbSmoke 2.4s ease-out infinite 0.8s' }} />
    <circle cx="96" cy="10" r="7" fill="rgba(200,220,255,0.07)" style={{ animation: 'bbSmoke 2.4s ease-out infinite 1.6s' }} />

    {/* ── Roof ── */}
    <polygon points="10,70 70,28 130,70" fill="#0f1f40" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
    {/* Roof glow line */}
    <polygon points="10,70 70,28 130,70" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />

    {/* ── Body ── */}
    <rect x="18" y="68" width="104" height="80" rx="4" fill="#0d1a35" stroke="#818cf8" strokeWidth="1.5" />

    {/* ── Door ── */}
    <rect x="54" y="110" width="32" height="38" rx="4" fill="#0a1124" stroke="#22d3ee" strokeWidth="1.5" />
    {/* Door knob */}
    <circle cx="80" cy="131" r="2.5" fill="#22d3ee" style={{ animation: 'bbGlowPulse 2s ease-in-out infinite' }} />
    {/* Door window */}
    <rect x="60" y="116" width="20" height="12" rx="2" fill="#1a2a50" stroke="#818cf8" strokeWidth="1" />

    {/* ── Windows ── */}
    {/* Left window */}
    <rect x="26" y="84" width="28" height="20" rx="3" fill="#0a1124" stroke="#818cf8" strokeWidth="1.5" />
    <rect x="26" y="84" width="28" height="20" rx="3"
      fill="rgba(34,211,238,0.18)"
      style={{ animation: 'bbBlinkWindow 5s ease-in-out infinite' }}
    />
    {/* Window cross */}
    <line x1="40" y1="84" x2="40" y2="104" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
    <line x1="26" y1="94" x2="54" y2="94" stroke="#818cf8" strokeWidth="1" opacity="0.5" />

    {/* Right window */}
    <rect x="86" y="84" width="28" height="20" rx="3" fill="#0a1124" stroke="#818cf8" strokeWidth="1.5" />
    <rect x="86" y="84" width="28" height="20" rx="3"
      fill="rgba(129,140,248,0.2)"
      style={{ animation: 'bbBlinkWindow 5s ease-in-out infinite 2.5s' }}
    />
    <line x1="100" y1="84" x2="100" y2="104" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
    <line x1="86" y1="94" x2="114" y2="94" stroke="#818cf8" strokeWidth="1" opacity="0.5" />

    {/* ── Roof star/antenna ── */}
    <line x1="70" y1="28" x2="70" y2="14" stroke="#22d3ee" strokeWidth="1.5" />
    <circle cx="70" cy="11" r="3" fill="#22d3ee" style={{ animation: 'bbGlowPulse 1.5s ease-in-out infinite' }} />

    {/* ── Ground shadow ── */}
    <ellipse cx="70" cy="152" rx="50" ry="6" fill="rgba(34,211,238,0.08)" />
  </svg>
);

// ─────────────────────────────────────────────
// SVG CHARACTER: Student with backpack
// ─────────────────────────────────────────────
const StudentCharacter: React.FC = () => (
  <svg
    viewBox="0 0 80 120"
    width="80"
    height="120"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 0 12px rgba(129,140,248,0.4))' }}
  >
    {/* ── Head ── */}
    <circle cx="40" cy="22" r="14" fill="#0d1a35" stroke="#818cf8" strokeWidth="2" />
    {/* Hair */}
    <path d="M26,18 Q30,8 40,8 Q50,8 54,18" fill="#22d3ee" opacity="0.7" />
    {/* Eyes */}
    <circle cx="35" cy="21" r="2.5" fill="#22d3ee" style={{ animation: 'bbBlinkEye 4s ease-in-out infinite' }} />
    <circle cx="45" cy="21" r="2.5" fill="#22d3ee" style={{ animation: 'bbBlinkEye 4s ease-in-out infinite 0.1s' }} />
    {/* Smile */}
    <path d="M34,28 Q40,33 46,28" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* ── Body ── */}
    <rect x="27" y="38" width="26" height="30" rx="5" fill="#0d1a35" stroke="#818cf8" strokeWidth="1.5" />
    {/* Shirt stripe */}
    <line x1="27" y1="50" x2="53" y2="50" stroke="rgba(34,211,238,0.4)" strokeWidth="2" />

    {/* ── Backpack ── */}
    <rect x="51" y="38" width="14" height="24" rx="4" fill="#0a1124" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="53" y="42" width="10" height="8" rx="2" fill="rgba(34,211,238,0.15)" />
    <circle cx="58" cy="63" r="2" fill="#22d3ee" opacity="0.7" />

    {/* ── Arms ── */}
    <line x1="27" y1="45" x2="16" y2="58" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" style={{ animation: 'bbArmSwing 2s ease-in-out infinite' }} />
    <line x1="53" y1="45" x2="51" y2="38" stroke="transparent" strokeWidth="0" />
    {/* Key in hand */}
    <circle cx="14" cy="61" r="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
    <line x1="14" y1="65" x2="14" y2="74" stroke="#22d3ee" strokeWidth="1.5" />
    <line x1="14" y1="69" x2="17" y2="69" stroke="#22d3ee" strokeWidth="1.5" />
    <line x1="14" y1="72" x2="17" y2="72" stroke="#22d3ee" strokeWidth="1.5" />

    {/* ── Legs ── */}
    <rect x="29" y="67" width="9" height="26" rx="4" fill="#0d1a35" stroke="#818cf8" strokeWidth="1.5" style={{ animation: 'bbLegSwingL 2s ease-in-out infinite' }} />
    <rect x="42" y="67" width="9" height="26" rx="4" fill="#0d1a35" stroke="#818cf8" strokeWidth="1.5" style={{ animation: 'bbLegSwingR 2s ease-in-out infinite' }} />
    {/* Shoes */}
    <ellipse cx="33" cy="94" rx="7" ry="3" fill="#22d3ee" opacity="0.8" />
    <ellipse cx="47" cy="94" rx="7" ry="3" fill="#22d3ee" opacity="0.8" />
  </svg>
);

// ─────────────────────────────────────────────
// FLOATING PARTICLES
// ─────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 3.7 + 2) % 98}%`,
  size: 2 + (i % 3),
  duration: 6 + (i % 8),
  delay: (i * 0.4) % 7,
  color: i % 3 === 0 ? 'rgba(34,211,238,0.5)' : i % 3 === 1 ? 'rgba(129,140,248,0.5)' : 'rgba(168,85,247,0.4)',
}));

// ─────────────────────────────────────────────
// FLOATING ICON BADGE
// ─────────────────────────────────────────────
interface FloatBadgeProps {
  icon: React.ReactNode;
  label: string;
  style?: React.CSSProperties;
  colorClass?: string;
}
const FloatBadge: React.FC<FloatBadgeProps> = ({ icon, label, style, colorClass = 'text-cyan-400' }) => (
  <div
    className={`absolute flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 shadow-lg pointer-events-none select-none`}
    style={style}
  >
    <span className={`${colorClass} text-lg`}>{icon}</span>
    <span className="text-white text-xs font-semibold whitespace-nowrap">{label}</span>
  </div>
);

// ─────────────────────────────────────────────
// STAT COUNTER
// ─────────────────────────────────────────────
interface StatProps { value: string; label: string; icon: React.ReactNode; }
const Stat: React.FC<StatProps> = ({ value, label, icon }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-1.5 text-cyan-400 text-xl font-bold">{icon}<span>{value}</span></div>
    <p className="text-gray-500 text-xs">{label}</p>
  </div>
);

// ─────────────────────────────────────────────
// MAIN HERO SECTION
// ─────────────────────────────────────────────
export function HeroSection() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ listings: 0, students: 0, owners: 0, avgRating: 4.9 });

  useEffect(() => {
    fetch('http://localhost:5001/api/stats')
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setStats(d.data); })
      .catch(() => { /* keep defaults */ });
  }, []);

  /* subtle canvas star field */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
    }));
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.o})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ─── Global keyframes ─── */}
      <style>{`
        @keyframes bbFloat {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-22px) rotate(1.5deg); }
        }
        @keyframes bbFloatSlow {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes bbFloatReverse {
          0%,100% { transform: translateY(-12px); }
          50%      { transform: translateY(6px); }
        }
        @keyframes bbGlowPulse {
          0%,100% { opacity: 0.7; filter: brightness(1); }
          50%      { opacity: 1; filter: brightness(1.5) drop-shadow(0 0 6px currentColor); }
        }
        @keyframes bbBlinkWindow {
          0%,85%,100% { opacity: 1; }
          90%          { opacity: 0.1; }
          95%          { opacity: 0.8; }
        }
        @keyframes bbBlinkEye {
          0%,90%,100% { transform: scaleY(1); }
          95%          { transform: scaleY(0.1); }
        }
        @keyframes bbSmoke {
          0%   { opacity:0; transform: translateY(0) scale(0.6); }
          30%  { opacity:0.7; }
          100% { opacity:0; transform: translateY(-28px) scale(1.8); }
        }
        @keyframes bbArmSwing {
          0%,100% { transform: rotate(0deg); transform-origin: 27px 45px; }
          50%      { transform: rotate(-20deg); transform-origin: 27px 45px; }
        }
        @keyframes bbLegSwingL {
          0%,100% { transform: rotate(0deg); transform-origin: 33px 67px; }
          50%      { transform: rotate(12deg); transform-origin: 33px 67px; }
        }
        @keyframes bbLegSwingR {
          0%,100% { transform: rotate(0deg); transform-origin: 47px 67px; }
          50%      { transform: rotate(-12deg); transform-origin: 47px 67px; }
        }
        @keyframes bbParticle {
          0%   { opacity:0; transform: translateY(0) scale(0.8); }
          20%  { opacity:1; }
          80%  { opacity:0.6; }
          100% { opacity:0; transform: translateY(-80px) scale(1.3); }
        }
        @keyframes bbSpinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bbFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bbBlobDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-20px) scale(1.05); }
          66%     { transform: translate(-20px,15px) scale(0.97); }
        }
        @keyframes bbShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bbBounceGentle {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes bbPillGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
          50%      { box-shadow: 0 0 18px 4px rgba(34,211,238,0.25); }
        }
        @keyframes bbOrbitStar {
          from { transform: rotate(0deg) translateX(28px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
        }
        @keyframes bbBadgeFly {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes bbScrollBounce {
          0%,100% { transform: translateY(0); opacity:0.6; }
          50%      { transform: translateY(8px); opacity:1; }
        }

        .bb-float        { animation: bbFloat 6s ease-in-out infinite; }
        .bb-float-slow   { animation: bbFloatSlow 8s ease-in-out infinite; }
        .bb-float-rev    { animation: bbFloatReverse 7s ease-in-out infinite; }
        .bb-glow-pulse   { animation: bbGlowPulse 2.5s ease-in-out infinite; }
        .bb-spin-slow    { animation: bbSpinSlow 24s linear infinite; }
        .bb-bounce       { animation: bbBounceGentle 3s ease-in-out infinite; }

        .bb-fade-up-1    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) both; }
        .bb-fade-up-2    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) 0.15s both; }
        .bb-fade-up-3    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) 0.3s both; }
        .bb-fade-up-4    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) 0.45s both; }
        .bb-fade-up-5    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) 0.6s both; }
        .bb-fade-up-6    { animation: bbFadeUp 0.7s cubic-bezier(.4,0,.2,1) 0.75s both; }

        .bb-shimmer-text {
          background: linear-gradient(90deg, #818cf8 0%, #22d3ee 30%, #a78bfa 50%, #22d3ee 70%, #818cf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bbShimmer 4s linear infinite;
        }
        .bb-grid-bg {
          background-image:
            linear-gradient(rgba(129,140,248,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(129,140,248,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* ─── Star field canvas ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ─── Grid pattern ─── */}
      <div className="absolute inset-0 bb-grid-bg pointer-events-none" style={{ zIndex: 1 }} />

      {/* ─── Gradient blobs ─── */}
      <div className="absolute pointer-events-none" style={{ zIndex: 2 }}>
        <div style={{ position:'absolute', top:'-10%', left:'-8%', width:480, height:480, background:'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius:'50%', animation:'bbBlobDrift 14s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'20%', right:'-12%', width:520, height:520, background:'radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)', borderRadius:'50%', animation:'bbBlobDrift 18s ease-in-out infinite 3s' }} />
        <div style={{ position:'absolute', bottom:'-5%', left:'30%', width:400, height:400, background:'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', borderRadius:'50%', animation:'bbBlobDrift 16s ease-in-out infinite 6s' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'5%', width:300, height:300, background:'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)', borderRadius:'50%', animation:'bbBlobDrift 20s ease-in-out infinite 9s' }} />
      </div>

      {/* ─── Floating particles ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {PARTICLES.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              bottom: 0,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              animation: `bbParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ─── Orbiting ring (desktop only) ─── */}
      <div
        className="absolute hidden lg:block pointer-events-none bb-spin-slow"
        style={{
          zIndex: 3,
          top: '50%',
          left: '50%',
          width: 680,
          height: 680,
          marginTop: -340,
          marginLeft: -340,
          borderRadius: '50%',
          border: '1px dashed rgba(129,140,248,0.12)',
        }}
      />

      {/* ─── HOUSE CHARACTER (top-right) ─── */}
      <div
        className="absolute hidden md:block bb-float pointer-events-none"
        style={{ zIndex: 4, top: '10%', right: '5%' }}
      >
        <HouseCharacter />
        {/* Orbit stars around house */}
        <div style={{ position:'absolute', top:'50%', left:'50%', width:0, height:0 }}>
          {[0,1,2].map(i => (
            <div
              key={i}
              style={{
                position:'absolute',
                width:6, height:6,
                borderRadius:'50%',
                background: i===0 ? '#22d3ee' : i===1 ? '#818cf8' : '#a78bfa',
                animation: `bbOrbitStar ${3+i}s linear infinite ${i*1.2}s`,
                top: -3, left: -3,
              }}
            />
          ))}
        </div>
      </div>

      {/* ─── STUDENT CHARACTER (bottom-left) ─── */}
      <div
        className="absolute hidden lg:block bb-float-rev pointer-events-none"
        style={{ zIndex: 4, bottom: '12%', left: '5%' }}
      >
        <StudentCharacter />
      </div>

      {/* ─── LOTTIE KEY + SPARKLES (bottom-right, desktop) ─── */}
      <div
        className="absolute hidden lg:block pointer-events-none bb-float"
        style={{ zIndex: 4, bottom: '10%', right: '7%' }}
      >
        <div className="relative">
          {/* Glow ring behind lottie */}
          <div style={{
            position: 'absolute', inset: -16,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)',
            animation: 'bbGlowPulse 3s ease-in-out infinite',
          }} />
          <LottieKeySparkle style={{ width: 120, height: 120 }} />
        </div>
      </div>

      {/* ─── FLOATING ICON BADGES ─── */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 4 }}>
        <FloatBadge
          icon={<BiCheckCircle />}
          label="KYC Verified Owners"
          colorClass="text-green-400"
          style={{ top:'18%', left:'7%', animation:'bbBadgeFly 5s ease-in-out infinite' }}
        />
        <FloatBadge
          icon={<BiKey />}
          label="Instant Booking"
          colorClass="text-cyan-400"
          style={{ top:'30%', right:'8%', animation:'bbBadgeFly 6s ease-in-out infinite 1s' }}
        />
        <FloatBadge
          icon={<BiStar />}
          label="4.9 ★ Rating"
          colorClass="text-yellow-400"
          style={{ bottom:'28%', left:'8%', animation:'bbBadgeFly 7s ease-in-out infinite 2s' }}
        />
        <FloatBadge
          icon={<BiGroup />}
          label="2,400+ Students"
          colorClass="text-purple-400"
          style={{ bottom:'22%', right:'6%', animation:'bbBadgeFly 5.5s ease-in-out infinite 0.5s' }}
        />
        <FloatBadge
          icon={<BiWifi />}
          label="Wi-Fi Included"
          colorClass="text-indigo-400"
          style={{ top:'62%', left:'4%', animation:'bbBadgeFly 6.5s ease-in-out infinite 3s' }}
        />
        <FloatBadge
          icon={<BiMap />}
          label="Near Your Campus"
          colorClass="text-pink-400"
          style={{ top:'55%', right:'4%', animation:'bbBadgeFly 4.8s ease-in-out infinite 1.5s' }}
        />
      </div>

      {/* ─── HERO CONTENT ─── */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        style={{ paddingTop: '4rem', paddingBottom: '2rem' }}
      >
        {/* Pill badge */}
        <div
          className="bb-fade-up-1 inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm"
          style={{ animation: 'bbFadeUp 0.7s both, bbPillGlow 3s ease-in-out 0.7s infinite' }}
        >
          <span className="bb-glow-pulse">
            <BiBuilding className="text-cyan-400" size={18} />
          </span>
          <span className="text-cyan-300 text-sm font-semibold tracking-wide">Built for SLIIT Students · Malabe & Kaduwela</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 bb-glow-pulse" />
        </div>

        {/* Headline */}
        <h1 className="bb-fade-up-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 tracking-tight">
          <span className="text-white">Find Your </span>
          <span className="bb-shimmer-text">Perfect Home</span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Near </span>
          <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">SLIIT Campus</span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="bb-fade-up-3 text-xl md:text-2xl font-semibold mb-4 h-9">
          <span className="text-gray-400">For </span>
          <span className="text-cyan-400">
            <Typewriter
              words={['SLIIT Students', 'Malabe Boarders', 'SLIIT Freshers', 'Campus Roommates', 'Property Owners']}
              speed={60}
            />
          </span>
        </div>

        {/* Description */}
        <p className="bb-fade-up-3 text-gray-400 text-base md:text-lg max-w-xl mb-3 leading-relaxed">
          The smartest way for SLIIT students to find verified boarding near campus — browse, book, pay, and manage everything in one place.
        </p>

        {/* Expanding universities note */}
        <div className="bb-fade-up-3 flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
          <BiBookOpen size={16} />
          <span>Starting with SLIIT · Expanding to UOM, NSBM &amp; more soon</span>
        </div>

        {/* CTA Buttons */}
        <div className="bb-fade-up-4 flex flex-col sm:flex-row gap-3 mb-10 w-full sm:w-auto justify-center">
          <button
            onClick={() => navigate('/find')}
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
          >
            <Search size={20} />
            Find Rooms Near Me
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/boarding-management')}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold text-base py-3.5 px-8 rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm hover:scale-105"
          >
            <BiBuilding size={20} className="text-cyan-400" />
            List Your Property
          </button>
          <button
            onClick={() => navigate('/chatbot')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white font-semibold text-base py-3.5 px-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 backdrop-blur-sm hover:scale-105"
          >
            <BiBot size={20} /> AI Assistant
          </button>
        </div>

        {/* Trust badges */}
        <div className="bb-fade-up-5 flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: <BiShield className="text-green-400" size={16} />, text: 'No Scams', color: 'border-green-500/20 bg-green-500/8' },
            { icon: <BiCheckCircle className="text-cyan-400" size={16} />, text: 'Verified Listings', color: 'border-cyan-500/20 bg-cyan-500/8' },
            { icon: <BiMap className="text-purple-400" size={16} />, text: 'Campus Proximity', color: 'border-purple-500/20 bg-purple-500/8' },
            { icon: <BiKey className="text-yellow-400" size={16} />, text: 'Instant Access', color: 'border-yellow-500/20 bg-yellow-500/8' },
          ].map(({ icon, text, color }) => (
            <span key={text} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-white/80 text-sm font-medium backdrop-blur-sm ${color}`}>
              {icon}{text}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="bb-fade-up-6 w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 grid grid-cols-4 gap-4 divide-x divide-white/10">
          <Stat value={stats.listings > 0 ? `${stats.listings}+` : '...'} label="Listings" icon={<BiBuilding size={18} />} />
          <Stat value={stats.students > 0 ? `${stats.students > 999 ? (stats.students/1000).toFixed(1)+'k' : stats.students}+` : '...'} label="Students" icon={<BiGroup size={18} />} />
          <Stat value={stats.owners > 0 ? `${stats.owners}+` : '...'} label="Owners" icon={<BiBuilding size={18} />} />
          <Stat value={stats.avgRating > 0 ? `${stats.avgRating}★` : '4.9★'} label="Rating" icon={<BiStar size={18} />} />
        </div>
      </div>

      {/* ─── Scroll indicator ─── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 pointer-events-none"
        style={{ zIndex: 10, animation: 'bbScrollBounce 2s ease-in-out infinite' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
