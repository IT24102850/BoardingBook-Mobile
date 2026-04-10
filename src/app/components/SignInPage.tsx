import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Mail, ShieldCheck, UserCheck, ArrowLeft, Eye, EyeOff,
  AlertCircle, Loader2, HelpCircle, FileText, Shield,
  Sparkles, Home
} from 'lucide-react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';

// Professional image for right panel
const ProfessionalVisual = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[90%] h-[80%] max-w-[420px] max-h-[520px]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-indigo-400/20 rounded-3xl blur-3xl animate-pulse" />
        
        {/* Main image card */}
        <div className={`relative w-full h-full rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-1000 ${
          mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <img 
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Modern student housing with comfortable living space"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          {/* Bottom overlay text */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="text-xl font-bold mb-1">Welcome Back!</h3>
            <p className="text-sm text-white/80">Continue your journey to find the perfect room</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  });
  
  const navigate = useNavigate();

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Minimum 6 characters';
    return '';
  };

  const emailError = touchedFields.email ? validateEmail(email) : '';
  const passwordError = touchedFields.password ? validatePassword(password) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouchedFields({ email: true, password: true });
    
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (emailValidation || passwordValidation) {
      setError('Please fix the errors below');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid email or password');
      }
      localStorage.setItem('bb_access_token', result.data.token);
      localStorage.setItem('userRole', result.data.user.role);
      localStorage.setItem('userName', result.data.user.fullName || result.data.user.email.split('@')[0]);
      localStorage.setItem('bb_current_user', JSON.stringify(result.data.user));
      setSuccess('Signed in successfully!');
      const destination = result.data.user.role === 'owner' ? '/owner/dashboard' : '/student/dashboard';
      setTimeout(() => navigate(destination), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Responsive sizing based on Redmi Note 13
  const isRedmiNote13 = windowWidth >= 360 && windowWidth <= 400;

  return (
    <div style={{ minHeight: '100vh', background: '#0f1629', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes si-float-a  { 0%,100%{transform:translateY(0) scale(1);}  50%{transform:translateY(-28px) scale(1.04);} }
        @keyframes si-float-b  { 0%,100%{transform:translateY(0) scale(1);}  50%{transform:translateY(-18px) scale(1.06);} }
        @keyframes si-drift    { 0%,100%{transform:translate(0,0);} 33%{transform:translate(16px,-12px);} 66%{transform:translate(-10px,14px);} }
        @keyframes si-ring     { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes si-fade-up  { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
        @keyframes si-shake    { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-3px);} 40%,80%{transform:translateX(3px);} }
        @keyframes si-shimmer  { 0%,100%{opacity:.5;} 50%{opacity:1;} }

        .si-orb-a   { animation: si-float-a 9s  ease-in-out infinite; }
        .si-orb-b   { animation: si-float-b 7s  ease-in-out infinite 1.2s; }
        .si-orb-c   { animation: si-drift   12s ease-in-out infinite 2s; }
        .si-ring-1  { animation: si-ring    20s linear infinite; }
        .si-ring-2  { animation: si-ring    14s linear infinite reverse; }
        .si-form    { animation: si-fade-up 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .si-shake   { animation: si-shake 0.45s ease-in-out; }
        .si-badge   { animation: si-shimmer 3s ease-in-out infinite; }

        .si-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(129,140,248,0.18);
          border-radius: 13px;
          padding: 13px 44px;
          font-size: 14px; color: #fff; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .si-input::placeholder { color: rgba(148,163,184,0.45); }
        .si-input:focus { border-color: rgba(129,140,248,0.7); background: rgba(129,140,248,0.06); box-shadow: 0 0 0 4px rgba(129,140,248,0.10); }
        .si-input.valid   { border-color: rgba(34,197,94,0.5); }
        .si-input.invalid { border-color: rgba(239,68,68,0.6); background: rgba(239,68,68,0.04); }

        .si-btn {
          width:100%; padding:14px; border-radius:13px; border:none;
          background: linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#22d3ee 100%);
          color:#fff; font-size:15px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          transition: opacity .2s, transform .15s, box-shadow .2s;
          position:relative; overflow:hidden;
        }
        .si-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%); pointer-events:none; }
        .si-btn:hover:not(:disabled) { opacity:.92; transform:translateY(-1px); box-shadow:0 8px 32px rgba(99,102,241,.45); }
        .si-btn:disabled { opacity:.6; cursor:not-allowed; }

        .si-back {
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:99px;
          background:rgba(255,255,255,.05); border:1px solid rgba(129,140,248,.18);
          color:rgba(165,180,252,.8); font-size:13px; font-weight:500;
          cursor:pointer; transition:all .2s; text-decoration:none;
        }
        .si-back:hover { background:rgba(129,140,248,.1); border-color:rgba(129,140,248,.4); color:#a5b4fc; }
      `}</style>

      {/* Animated background */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div className="si-orb-a" style={{ position:'absolute', top:'-8%', left:'-6%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)' }} />
        <div className="si-orb-b" style={{ position:'absolute', bottom:'-10%', right:'-5%', width:460, height:460, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,.14) 0%,transparent 70%)' }} />
        <div className="si-orb-c" style={{ position:'absolute', top:'45%', left:'48%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(129,140,248,.07) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(129,140,248,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,.035) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
      </div>

      {/* Back button */}
      <div style={{ position:'absolute', top:20, left:20, zIndex:20 }}>
        <button type="button" onClick={handleBack} className="si-back">
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {/* Left panel — branding */}
      <div style={{ flex:1, flexDirection:'column', justifyContent:'center', padding:'60px 64px', position:'relative', display:'none' }} className="si-left-panel">
        <style>{`@media(min-width:1024px){.si-left-panel{display:flex!important;}}`}</style>

        <div className="si-ring-1" style={{ position:'absolute', top:'10%', right:'-90px', width:340, height:340, border:'1px solid rgba(129,140,248,.1)', borderRadius:'50%', borderTopColor:'rgba(129,140,248,.35)' }} />
        <div className="si-ring-2" style={{ position:'absolute', top:'18%', right:'-50px', width:230, height:230, border:'1px solid rgba(34,211,238,.07)', borderRadius:'50%', borderRightColor:'rgba(34,211,238,.28)' }} />

        <a href="/" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:48, textDecoration:'none' }}>
          <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#818cf8,#22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(129,140,248,.5)' }}>
            <UserCheck size={22} color="#fff" />
          </div>
          <div>
            <p style={{ color:'#fff', fontWeight:800, fontSize:18, letterSpacing:'-0.02em', lineHeight:1 }}>BoardingBook</p>
            <p style={{ color:'rgba(148,163,184,.65)', fontSize:11, marginTop:2, fontWeight:500 }}>SLIIT Student Platform</p>
          </div>
        </a>

        <h2 style={{ fontSize:36, fontWeight:800, color:'#fff', lineHeight:1.18, letterSpacing:'-0.03em', marginBottom:14 }}>
          Your perfect room<br/>
          <span style={{ background:'linear-gradient(135deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>is one sign-in away</span>
        </h2>
        <p style={{ color:'rgba(148,163,184,.6)', fontSize:15, lineHeight:1.65, marginBottom:44, maxWidth:360 }}>
          Find verified boarding rooms near SLIIT, connect with roommates, and manage your stay — all in one place.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[
            { color:'#818cf8', bg:'rgba(129,140,248,.1)', icon:<Home size={15} color="#818cf8" />, label:'Verified Rooms Near SLIIT', sub:'Browse hundreds of trusted listings' },
            { color:'#22d3ee', bg:'rgba(34,211,238,.1)',  icon:<UserCheck size={15} color="#22d3ee" />, label:'Roommate Finder', sub:'Get matched with compatible housemates' },
            { color:'#a78bfa', bg:'rgba(167,139,250,.1)', icon:<ShieldCheck size={15} color="#a78bfa" />, label:'Safe & Verified',  sub:'KYC-verified owners you can trust' },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.icon}</div>
              <div>
                <p style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, lineHeight:1 }}>{f.label}</p>
                <p style={{ color:'rgba(148,163,184,.5)', fontSize:11.5, marginTop:3 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px', position:'relative', zIndex:10 }} className="si-right-panel">
        <style>{`@media(min-width:1024px){.si-right-panel{width:480px!important;margin:0!important;borderLeft:'1px solid rgba(129,140,248,.07)';background:rgba(15,22,41,.6);backdropFilter:blur(24px);}}`}</style>

        <div className="si-form" style={{ width:'100%', maxWidth:380 }}>

          {/* Mobile logo */}
          <div style={{ textAlign:'center', marginBottom:32 }} className="si-mobile-logo">
            <style>{`@media(min-width:1024px){.si-mobile-logo{display:none;}}`}</style>
            <a href="/" style={{ textDecoration:'none', display:'inline-block' }}>
              <div style={{ width:50, height:50, borderRadius:16, background:'linear-gradient(135deg,#818cf8,#22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', boxShadow:'0 0 26px rgba(129,140,248,.45)' }}>
                <UserCheck size={24} color="#fff" />
              </div>
              <p style={{ color:'#fff', fontWeight:800, fontSize:20, letterSpacing:'-0.02em' }}>BoardingBook</p>
              <p style={{ color:'rgba(148,163,184,.55)', fontSize:12, marginTop:4 }}>SLIIT Student Platform</p>
            </a>
          </div>

          {/* Heading */}
          <div style={{ marginBottom:26 }}>
            <div className="si-badge" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(129,140,248,.1)', border:'1px solid rgba(129,140,248,.2)', borderRadius:99, padding:'5px 12px', marginBottom:14 }}>
              <Lock size={11} color="#818cf8" />
              <span style={{ fontSize:11, fontWeight:600, color:'#a5b4fc', letterSpacing:'0.06em', textTransform:'uppercase' }}>Secure Sign In</span>
            </div>
            <h2 style={{ color:'#fff', fontSize:26, fontWeight:800, letterSpacing:'-0.025em', lineHeight:1.2, margin:0 }}>Welcome back</h2>
            <p style={{ color:'rgba(148,163,184,.55)', fontSize:13.5, marginTop:6 }}>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(203,213,225,.85)', marginBottom:7, letterSpacing:'0.01em' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focusedField === 'email' ? '#818cf8' : 'rgba(148,163,184,.5)', pointerEvents:'none', transition:'color .2s' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="student@my.sliit.lk"
                  autoComplete="email"
                  className={`si-input${emailError && touchedFields.email ? ' invalid' : email && !emailError ? ' valid' : ''}`}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, email: true })); }}
                  style={{ paddingRight: 14 }}
                />
                {email && !emailError && touchedFields.email && (
                  <svg style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)' }} width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#4ade80" strokeWidth="2"/><path d="M6 10L9 13L14 7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
              </div>
              {emailError && touchedFields.email && <p style={{ color:'#f87171', fontSize:11.5, marginTop:5, display:'flex', alignItems:'center', gap:4 }}><AlertCircle size={11} />{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(203,213,225,.85)', marginBottom:7, letterSpacing:'0.01em' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focusedField === 'password' ? '#818cf8' : 'rgba(148,163,184,.5)', pointerEvents:'none', transition:'color .2s' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`si-input${passwordError && touchedFields.password ? ' invalid' : password && !passwordError ? ' valid' : ''}`}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, password: true })); }}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(148,163,184,.5)', padding:0, display:'flex', transition:'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#cbd5e1')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(148,163,184,.5)')}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordError && touchedFields.password && <p style={{ color:'#f87171', fontSize:11.5, marginTop:5, display:'flex', alignItems:'center', gap:4 }}><AlertCircle size={11} />{passwordError}</p>}
            </div>

            {/* Forgot password */}
            <div style={{ textAlign:'right', marginTop:-4 }}>
              <a href="/forgot-password" style={{ fontSize:12, color:'#818cf8', fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4 }}
                onMouseEnter={e => (e.currentTarget.style.color='#a5b4fc')} onMouseLeave={e => (e.currentTarget.style.color='#818cf8')}>
                <HelpCircle size={12} /> Forgot password?
              </a>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="si-shake" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderRadius:10, padding:'10px 14px' }}>
                <AlertCircle size={14} color="#f87171" style={{ flexShrink:0 }} />
                <span style={{ color:'#f87171', fontSize:13 }}>{error}</span>
              </div>
            )}
            {success && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', borderRadius:10, padding:'10px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0 }}><circle cx="10" cy="10" r="8" stroke="#4ade80" strokeWidth="2"/><path d="M6 10L9 13L14 7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{ color:'#4ade80', fontSize:13 }}>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="si-btn" style={{ marginTop:6 }}>
              {isLoading
                ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} />Signing in…</>
                : <><Sparkles size={15} />Sign In</>}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ marginTop:22, textAlign:'center' }}>
            <p style={{ color:'rgba(148,163,184,.5)', fontSize:13, marginBottom:14 }}>
              Don't have an account?{' '}
              <a href="/signup" style={{ color:'#818cf8', fontWeight:600, textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget.style.color='#a5b4fc')} onMouseLeave={e => (e.currentTarget.style.color='#818cf8')}>
                Sign Up
              </a>
            </p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
              <a href="/privacy" style={{ fontSize:11, color:'rgba(148,163,184,.35)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                onMouseEnter={e => (e.currentTarget.style.color='rgba(165,180,252,.6)')} onMouseLeave={e => (e.currentTarget.style.color='rgba(148,163,184,.35)')}>
                <FileText size={10} />Privacy
              </a>
              <span style={{ color:'rgba(148,163,184,.2)', fontSize:11 }}>·</span>
              <a href="/terms" style={{ fontSize:11, color:'rgba(148,163,184,.35)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                onMouseEnter={e => (e.currentTarget.style.color='rgba(165,180,252,.6)')} onMouseLeave={e => (e.currentTarget.style.color='rgba(148,163,184,.35)')}>
                <Shield size={10} />Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}