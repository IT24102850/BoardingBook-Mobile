import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2,
  Shield, Mail, Lock, CheckCircle, XCircle, FileText, ShieldCheck, Upload,
  Building, Phone, User, Home, Briefcase, Sparkles,
  ChevronRight, Zap, Award, Clock, Calendar, CreditCard, GraduationCap, Hash
} from 'lucide-react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';

// Professional online image for right panel
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
          {/* Professional student housing image */}
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
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
            <h3 className="text-xl font-bold mb-1">Find Your Perfect Roommate</h3>
            <p className="text-sm text-white/80">Join thousands of students already connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SignUpPage() {
  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [currentStep, setCurrentStep] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  
  // Owner-specific fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ownerNic, setOwnerNic] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerOccupation, setOwnerOccupation] = useState('');

  // Student-specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [nic, setNic] = useState('');
  const [studentIdPrefix, setStudentIdPrefix] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [signedUpToken, setSignedUpToken] = useState('');
  const [signedUpOwnerName, setSignedUpOwnerName] = useState('');
  const [kycFiles, setKycFiles] = useState<{ nicFront: File|null; nicBack: File|null; selfie: File|null }>({ nicFront: null, nicBack: null, selfie: null });
  const [kycUploading, setKycUploading] = useState(false);
  const [kycError, setKycError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    confirm: false,
    fullName: false,
    phoneNumber: false,
    ownerNic: false,
    ownerAddress: false,
    firstName: false,
    lastName: false,
    birthday: false,
    academicYear: false,
    nic: false,
    studentIdPrefix: false,
  });
  
  const navigate = useNavigate();

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const strength = score === 4 ? 'Strong' : score >= 2 ? 'Medium' : 'Weak';
    const strengthColor = score === 4 ? 'bg-green-500' : score >= 2 ? 'bg-yellow-500' : 'bg-red-500';
    
    return { checks, strength, score, strengthColor };
  };

  const validateEmail = (emailVal: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (role === 'student') {
      // email is derived from studentIdPrefix for students
      return '';
    }
    if (!emailVal) return 'Email is required';
    if (!emailRegex.test(emailVal)) return 'Invalid email format';
    if (emailVal.endsWith('@sliit.lk') || emailVal.endsWith('@my.sliit.lk')) {
      return 'Use business/personal email';
    }
    return '';
  };

  const validateStudentId = (prefix: string) => {
    if (!prefix) return 'Student ID is required';
    if (!/^IT\d{8}$/i.test(prefix)) return 'Format: IT followed by 8 digits (e.g. IT21234567)';
    return '';
  };

  const validateFirstName = (v: string) => !v.trim() ? 'First name is required' : '';
  const validateLastName = (v: string) => !v.trim() ? 'Last name is required' : '';
  const validateBirthday = (v: string) => {
    if (!v) return 'Birthday is required';
    const dob = new Date(v);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear() -
      (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age < 16) return 'You must be at least 16 years old';
    if (age > 100) return 'Please enter a valid date of birth';
    return '';
  };
  const validateAcademicYear = (v: string) => !v ? 'Academic year is required' : '';
  const validateNic = (v: string) => {
    if (!v) return 'NIC is required';
    if (!/^(\d{9}[vVxX]|\d{12})$/.test(v)) return 'Invalid NIC (e.g. 123456789V or 200012345678)';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    
    if (role === 'student') {
      if (password.length < 8) return 'Minimum 8 characters';
      if (!/\d/.test(password)) return 'Include a number';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Include a symbol';
      if (!/[A-Z]/.test(password)) return 'Include uppercase letter';
    } else {
      if (password.length < 6) return 'Minimum 6 characters';
    }
    return '';
  };

  const validateConfirm = (confirm: string) => {
    if (!confirm) return 'Please confirm';
    if (confirm !== password) return 'Passwords do not match';
    return '';
  };

  const validateFullName = (name: string) => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Name too short';
    return '';
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return 'Phone is required';
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) return 'Invalid format';
    return '';
  };

  const validateOwnerNic = (v: string) => {
    if (!v) return 'NIC is required';
    if (!/^(\d{9}[vVxX]|\d{12})$/.test(v)) return 'Invalid NIC (e.g. 123456789V or 200012345678)';
    return '';
  };

  const validateOwnerAddress = (v: string) => {
    if (!v.trim()) return 'Address is required';
    if (v.trim().length < 8) return 'Please enter a full address';
    return '';
  };

  // Derive the full student email
  const studentEmail = role === 'student' ? `${studentIdPrefix}@my.sliit.lk` : email;
  const effectiveEmail = role === 'student' ? studentEmail : email;

  const emailError = touchedFields.email ? validateEmail(email) : '';
  const studentIdError = role === 'student' && touchedFields.studentIdPrefix ? validateStudentId(studentIdPrefix) : '';
  const passwordError = touchedFields.password ? validatePassword(password) : '';
  const confirmError = touchedFields.confirm ? validateConfirm(confirm) : '';
  const fullNameError = role === 'owner' && touchedFields.fullName ? validateFullName(fullName) : '';
  const phoneNumberError = role === 'owner' && touchedFields.phoneNumber ? validatePhoneNumber(phoneNumber) : '';
  const ownerNicError = role === 'owner' && touchedFields.ownerNic ? validateOwnerNic(ownerNic) : '';
  const ownerAddressError = role === 'owner' && touchedFields.ownerAddress ? validateOwnerAddress(ownerAddress) : '';
  const firstNameError = role === 'student' && touchedFields.firstName ? validateFirstName(firstName) : '';
  const lastNameError = role === 'student' && touchedFields.lastName ? validateLastName(lastName) : '';
  const birthdayError = role === 'student' && touchedFields.birthday ? validateBirthday(birthday) : '';
  const academicYearError = role === 'student' && touchedFields.academicYear ? validateAcademicYear(academicYear) : '';
  const nicError = role === 'student' && touchedFields.nic ? validateNic(nic) : '';
  
  const passwordStrength = password ? checkPasswordStrength(password) : null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouchedFields({
      email: true,
      password: true,
      confirm: true,
      fullName: role === 'owner',
      phoneNumber: role === 'owner',
      ownerNic: role === 'owner',
      ownerAddress: role === 'owner',
      firstName: role === 'student',
      lastName: role === 'student',
      birthday: role === 'student',
      academicYear: role === 'student',
      nic: role === 'student',
      studentIdPrefix: role === 'student',
    });
    
    const emailValidation = role === 'student' ? validateStudentId(studentIdPrefix) : validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validateConfirm(confirm);
    const fullNameValidation = role === 'owner' ? validateFullName(fullName) : '';
    const phoneNumberValidation = role === 'owner' ? validatePhoneNumber(phoneNumber) : '';
    const ownerNicValidation = role === 'owner' ? validateOwnerNic(ownerNic) : '';
    const ownerAddressValidation = role === 'owner' ? validateOwnerAddress(ownerAddress) : '';
    const studentFieldsValidation = role === 'student'
      ? (validateFirstName(firstName) || validateLastName(lastName) || validateBirthday(birthday) || validateAcademicYear(academicYear) || validateNic(nic))
      : '';

    if (emailValidation || passwordValidation || confirmValidation || fullNameValidation || phoneNumberValidation || ownerNicValidation || ownerAddressValidation || studentFieldsValidation) {
      setError('Please fix the errors below');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const payload: Record<string, string | number> = {
        email: role === 'student' ? `${studentIdPrefix}@my.sliit.lk` : email,
        password,
        role,
      };

      if (role === 'owner') {
        payload.fullName = fullName;
        payload.phoneNumber = phoneNumber;
        payload.nic = ownerNic;
        payload.address = ownerAddress;
        if (ownerOccupation) payload.occupation = ownerOccupation;
      }

      if (role === 'student') {
        payload.firstName = firstName;
        payload.lastName = lastName;
        payload.birthday = birthday;
        payload.academicYear = academicYear;
        payload.nic = nic;
        payload.studentId = studentIdPrefix.toUpperCase();
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create account');
      }

      if (role === 'owner') {
        localStorage.setItem('bb_access_token', result.data.token);
        localStorage.setItem('userRole', 'owner');
        localStorage.setItem('userName', result.data.user.fullName || result.data.user.email);
        setSignedUpToken(result.data.token);
        setSignedUpOwnerName(result.data.user.fullName || '');
        setCurrentStep(2);
      } else {
        setSignedUpEmail(effectiveEmail);
        setCurrentStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signedUpEmail }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setResendMessage('Verification email resent! Check your inbox.');
    } catch (err) {
      setResendMessage(err instanceof Error ? err.message : 'Failed to resend. Try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleKycSubmit = async () => {
    const { nicFront, nicBack, selfie } = kycFiles;
    if (!nicFront || !nicBack || !selfie) { setKycError('Please select all three documents.'); return; }
    setKycUploading(true); setKycError('');
    try {
      const form = new FormData();
      form.append('nicFront', nicFront);
      form.append('nicBack', nicBack);
      form.append('selfie', selfie);
      const res = await fetch(`${API_BASE_URL}/api/kyc/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${signedUpToken}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      navigate('/signin?kyc=submitted');
    } catch (err: any) {
      setKycError(err.message || 'Upload failed. Try again.');
    } finally {
      setKycUploading(false);
    }
  };

  // Responsive sizing based on Redmi Note 13 (1080 x 2400)
  const isRedmiNote13 = windowWidth >= 360 && windowWidth <= 400;

  return (
    <div style={{ minHeight:'100vh', background:'#0f1629', fontFamily:'Inter,system-ui,sans-serif', position:'relative', overflowX:'hidden' }}>
      <style>{`
        @keyframes su-float-a { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-26px) scale(1.03);} }
        @keyframes su-float-b { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-16px) scale(1.05);} }
        @keyframes su-ring    { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes su-fade-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes su-shake   { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-3px);} 40%,80%{transform:translateX(3px);} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(.5);} to{opacity:1;transform:scale(1);} }
        @keyframes slideDown   { from{opacity:0;transform:translateY(-5px);} to{opacity:1;transform:translateY(0);} }

        .su-orb-a { animation: su-float-a 9s ease-in-out infinite; }
        .su-orb-b { animation: su-float-b 7s ease-in-out infinite 1.5s; }
        .su-ring  { animation: su-ring    18s linear infinite; }
        .su-form  { animation: su-fade-up 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .su-shake { animation: su-shake 0.45s ease-in-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-shake     { animation: su-shake 0.5s ease-in-out; }
        .animate-float     { animation: su-float-a 6s ease-in-out infinite; }

        .su-back {
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:99px;
          background:rgba(255,255,255,.05); border:1px solid rgba(129,140,248,.18);
          color:rgba(165,180,252,.8); font-size:13px; font-weight:500;
          cursor:pointer; transition:all .2s; text-decoration:none; outline:none;
        }
        .su-back:hover { background:rgba(129,140,248,.1); border-color:rgba(129,140,248,.4); color:#a5b4fc; }

        /* keep existing field styles intact */
        .animation-delay-2000 { animation-delay:2s; }
        @media(max-width:400px){ input,button{ min-height:44px; } }
      `}</style>

      {/* Background orbs + grid */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
        <div className="su-orb-a" style={{ position:'absolute', top:'-8%', left:'-6%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.16) 0%,transparent 70%)' }} />
        <div className="su-orb-b" style={{ position:'absolute', bottom:'-10%', right:'-5%', width:460, height:460, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,.12) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(129,140,248,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
      </div>

      {/* Back button */}
      <div style={{ position:'absolute', top:18, left:18, zIndex:30 }}>
        <button onClick={handleBack} className="su-back">
          <ArrowLeft size={15} />Back
        </button>
      </div>

      {/* Main layout */}
      <div style={{ display:'flex', minHeight:'100vh', position:'relative', zIndex:1 }}>

      {/* Left branding panel — desktop only */}
      <div style={{ flex:1, flexDirection:'column', justifyContent:'center', padding:'60px 56px', position:'relative', display:'none' }} className="su-left-panel">
        <style>{`@media(min-width:1024px){.su-left-panel{display:flex!important;}}`}</style>
        <div className="su-ring" style={{ position:'absolute', top:'8%', right:'-80px', width:330, height:330, border:'1px solid rgba(129,140,248,.1)', borderRadius:'50%', borderTopColor:'rgba(129,140,248,.35)' }} />
        <a href="/" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:44, textDecoration:'none' }}>
          <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#818cf8,#22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 22px rgba(129,140,248,.5)' }}>
            <UserCheck size={22} color="#fff" />
          </div>
          <div>
            <p style={{ color:'#fff', fontWeight:800, fontSize:18, letterSpacing:'-0.02em', lineHeight:1 }}>BoardingBook</p>
            <p style={{ color:'rgba(148,163,184,.65)', fontSize:11, marginTop:2 }}>SLIIT Student Platform</p>
          </div>
        </a>
        <h2 style={{ fontSize:34, fontWeight:800, color:'#fff', lineHeight:1.2, letterSpacing:'-0.03em', marginBottom:14 }}>
          Join thousands of<br/>
          <span style={{ background:'linear-gradient(135deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SLIIT students</span>
        </h2>
        <p style={{ color:'rgba(148,163,184,.6)', fontSize:15, lineHeight:1.65, marginBottom:40, maxWidth:340 }}>
          Create your account in minutes and start finding your perfect boarding place near campus.
        </p>
        {[
          { bg:'rgba(129,140,248,.1)', icon:<Home size={15} color="#818cf8" />, label:'Find Rooms Near SLIIT', sub:'Hundreds of verified listings' },
          { bg:'rgba(34,211,238,.1)',  icon:<UserCheck size={15} color="#22d3ee" />, label:'Roommate Matching', sub:'Find compatible housemates' },
          { bg:'rgba(167,139,250,.1)',icon:<ShieldCheck size={15} color="#a78bfa" />, label:'Verified & Safe', sub:'KYC-checked owners only' },
        ].map(f => (
          <div key={f.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.icon}</div>
            <div>
              <p style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, lineHeight:1 }}>{f.label}</p>
              <p style={{ color:'rgba(148,163,184,.5)', fontSize:11.5, marginTop:3 }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right form panel */}
      <div style={{ width:'100%', maxWidth:520, margin:'0 auto', display:'flex', flexDirection:'column', justifyContent:'center', padding:'70px 24px 32px', position:'relative' }} className="su-right-panel">
        <style>{`@media(min-width:1024px){.su-right-panel{width:520px!important;margin:0!important;borderLeft:'1px solid rgba(129,140,248,.07)';background:rgba(15,22,41,.55);backdropFilter:blur(20px);}}`}</style>

      <div className="su-form" style={{ width:'100%', maxWidth:420, margin:'0 auto' }}>
        <div className="w-full max-w-md mx-auto mt-8 md:mt-0">
          {/* Progress Steps - Mobile optimized */}
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step < currentStep 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                      : step === currentStep
                      ? 'bg-white text-cyan-600 border-2 border-cyan-400 shadow-lg'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle size={isRedmiNote13 ? 14 : 16} />
                    ) : (
                      <span className="font-bold text-sm md:text-base">{step}</span>
                    )}
                  </div>
                  <span className={`absolute -bottom-5 text-[8px] md:text-[10px] font-medium whitespace-nowrap ${
                    step === currentStep ? 'text-cyan-400' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Account'}
                    {step === 2 && (role === 'owner' ? 'Complete' : 'Verify')}
                    {step === 3 && (role === 'owner' ? 'KYC' : 'Done')}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-[1px] md:h-[2px] mx-1 md:mx-2 transition-all duration-500 ${
                    step < currentStep ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className="relative">
            <div style={{ background:'rgba(22,30,55,0.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(129,140,248,0.14)', borderRadius:20, padding:'24px 20px', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>
              
              {/* Mobile logo — hidden on desktop where left panel shows */}
              <div className="flex flex-col items-center mb-4 md:mb-5 su-card-logo">
                <style>{`@media(min-width:1024px){.su-card-logo{display:none;}}`}</style>
                <a href="/" style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:42, height:42, borderRadius:14, background:'linear-gradient(135deg,#818cf8,#22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, boxShadow:'0 0 22px rgba(129,140,248,.4)' }}>
                    <UserCheck size={20} color="#fff" />
                  </div>
                  <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#a5b4fc,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    BoardingBook
                  </span>
                  <span style={{ fontSize:10, color:'rgba(165,180,252,.5)', marginTop:2, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    SLIIT Student Platform
                  </span>
                </a>
              </div>

              {/* ── Owner Step 2: Animated Success ── */}
              {currentStep === 2 && role === 'owner' ? (
                <div className="flex flex-col items-center text-center py-4" style={{ animation: 'fadeSlideUp 0.5s ease forwards' }}>
                  <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-cyan-400/20 flex items-center justify-center" style={{ animation: 'scaleIn 0.4s ease forwards' }}>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                        <CheckCircle className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Account Created!</h2>
                  <p className="text-sm text-cyan-300 font-medium mb-1">{signedUpOwnerName}</p>
                  <p className="text-xs text-gray-400 mb-8 max-w-xs">Your owner account is ready. Complete identity verification to unlock all features and list your properties.</p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 mb-3"
                  >
                    Continue to Verification
                  </button>
                  <button onClick={() => navigate('/signin')} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    Skip for now — verify later
                  </button>
                </div>

              /* ── Owner Step 3: KYC Upload ── */
              ) : currentStep === 3 && role === 'owner' ? (
                <div style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-3">
                      <ShieldCheck className="text-purple-400" size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-white">Verify Your Identity</h2>
                    <p className="text-xs text-gray-400 mt-1 text-center">Upload clear photos of your NIC (front & back) and a selfie holding the NIC.</p>
                  </div>

                  {(['nicFront', 'nicBack', 'selfie'] as const).map((field) => {
                    const labels = { nicFront: 'NIC Front', nicBack: 'NIC Back', selfie: 'Selfie with NIC' };
                    const icons = { nicFront: '🪪', nicBack: '🪪', selfie: '🤳' };
                    return (
                      <div key={field} className="mb-3">
                        <label className="block text-xs font-medium text-gray-400 mb-1">{icons[field]} {labels[field]}</label>
                        <label className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          kycFiles[field] ? 'border-green-500/50 bg-green-500/5 text-green-400' : 'border-white/10 bg-white/5 text-gray-400 hover:border-cyan-400/40 hover:bg-cyan-400/5'
                        }`}>
                          <Upload size={14} />
                          <span className="text-xs truncate flex-1">{kycFiles[field] ? kycFiles[field]!.name : 'Choose file (JPG, PNG, PDF · max 5MB)'}</span>
                          {kycFiles[field] && <CheckCircle size={14} className="text-green-400 flex-shrink-0" />}
                          <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                            onChange={e => setKycFiles(p => ({ ...p, [field]: e.target.files?.[0] ?? null }))} />
                        </label>
                      </div>
                    );
                  })}

                  {kycError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg mt-1 mb-3">
                      <AlertCircle size={13} />{kycError}
                    </div>
                  )}

                  <button onClick={handleKycSubmit} disabled={kycUploading}
                    className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {kycUploading ? <><Loader2 size={14} className="animate-spin" />Uploading…</> : 'Submit for Verification'}
                  </button>
                  <button onClick={() => navigate('/signin')} className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    Verify later — go to sign in
                  </button>
                </div>

              /* ── Student Step 2: Verify Email ── */
              ) : currentStep === 2 && role === 'student' ? (
                <div className="flex flex-col items-center text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <Mail className="text-cyan-400" size={32} />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-2">Check your inbox</h2>
                  <p className="text-xs md:text-sm text-cyan-200/60 mb-1">We sent a verification link to</p>
                  <p className="text-sm md:text-base font-semibold text-cyan-300 mb-6 break-all">{signedUpEmail}</p>
                  <p className="text-xs text-gray-400 mb-6">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
                  {resendMessage && (
                    <div className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-4 ${
                      resendMessage.includes('resent') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                      <AlertCircle size={13} />{resendMessage}
                    </div>
                  )}
                  <button onClick={handleResend} disabled={isResending}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-cyan-300 text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                  >
                    {isResending ? <><Loader2 size={14} className="animate-spin" />Resending…</> : 'Resend verification email'}
                  </button>
                  <button onClick={() => navigate('/signin')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Go to Sign In
                  </button>
                </div>
              ) : (
                <>
              <h2 style={{ textAlign:'center', fontSize:20, fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:4 }}>Create your account</h2>
              <p style={{ textAlign:'center', fontSize:13, color:'rgba(148,163,184,.55)', marginBottom:16 }}>Join thousands finding their perfect housing</p>

              {/* Role Toggle - Mobile optimized */}
              <div className="relative bg-white/5 p-0.5 md:p-1 rounded-xl md:rounded-2xl mb-4 md:mb-6 border border-white/10">
                <div className={`absolute top-0.5 bottom-0.5 w-1/2 rounded-lg md:rounded-xl transition-all duration-300 ${
                  role === 'student' 
                    ? 'left-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600' 
                    : 'left-[calc(50%-0.125rem)] md:left-[calc(50%-0.25rem)] bg-gradient-to-r from-purple-500 to-purple-600'
                }`} />
                <div className="relative flex">
                  <button
                    type="button"
                    className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                      role === 'student' ? 'text-white' : 'text-gray-400 hover:text-cyan-200'
                    }`}
                    onClick={() => {
                      setRole('student');
                      setError('');
                    }}
                  >
                    <span className="flex items-center justify-center gap-1 md:gap-2">
                      <User size={isRedmiNote13 ? 14 : 16} />
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                      role === 'owner' ? 'text-white' : 'text-gray-400 hover:text-purple-200'
                    }`}
                    onClick={() => {
                      setRole('owner');
                      setError('');
                    }}
                  >
                    <span className="flex items-center justify-center gap-1 md:gap-2">
                      <Building size={isRedmiNote13 ? 14 : 16} />
                      Owner
                    </span>
                  </button>
                </div>
              </div>

              <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit} noValidate>
                {/* Student Fields */}
                {role === 'student' && (
                  <div className="space-y-2 md:space-y-3 animate-slideDown">
                    {/* First Name + Last Name */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {/* First Name */}
                      <div className="relative">
                        <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] ${
                          firstNameError ? 'text-red-400' : focusedField === 'firstName' ? 'text-cyan-400' : 'text-gray-400'
                        }`}>First Name</label>
                        <div className="relative">
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, firstName: true })); }}
                            className={`w-full pl-7 md:pl-9 pr-2 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                              firstNameError ? 'border-red-400 bg-red-400/5' :
                              firstName && !firstNameError ? 'border-green-400 bg-green-400/5' :
                              focusedField === 'firstName' ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5'
                            } text-white placeholder-transparent focus:outline-none`} placeholder="John" />
                          <User className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 ${ focusedField === 'firstName' ? 'text-cyan-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 12 : 14} />
                        </div>
                        {firstNameError && <p className="text-red-400 text-[9px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={9} />{firstNameError}</p>}
                      </div>
                      {/* Last Name */}
                      <div className="relative">
                        <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] ${
                          lastNameError ? 'text-red-400' : focusedField === 'lastName' ? 'text-cyan-400' : 'text-gray-400'
                        }`}>Last Name</label>
                        <div className="relative">
                          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, lastName: true })); }}
                            className={`w-full pl-7 md:pl-9 pr-2 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                              lastNameError ? 'border-red-400 bg-red-400/5' :
                              lastName && !lastNameError ? 'border-green-400 bg-green-400/5' :
                              focusedField === 'lastName' ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5'
                            } text-white placeholder-transparent focus:outline-none`} placeholder="Doe" />
                          <User className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 ${ focusedField === 'lastName' ? 'text-cyan-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 12 : 14} />
                        </div>
                        {lastNameError && <p className="text-red-400 text-[9px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={9} />{lastNameError}</p>}
                      </div>
                    </div>

                    {/* Birthday + Academic Year */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {/* Birthday */}
                      <div className="relative">
                        <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] transition-colors ${
                          birthdayError ? 'text-red-400' : focusedField === 'birthday' ? 'text-cyan-400' : 'text-gray-400'
                        }`}>Date of Birth</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={birthday}
                            onChange={e => { setBirthday(e.target.value); setTouchedFields(p => ({ ...p, birthday: true })); }}
                            onFocus={() => setFocusedField('birthday')}
                            onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, birthday: true })); }}
                            min={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 100); return d.toISOString().split('T')[0]; })()}
                            max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 16); return d.toISOString().split('T')[0]; })()}
                            className={`w-full pl-7 md:pl-9 pr-2 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-xs md:text-sm transition-all [color-scheme:dark] focus:outline-none ${
                              birthdayError ? 'border-red-400 bg-red-400/5 text-red-300' :
                              birthday && !birthdayError ? 'border-green-400 bg-green-400/5 text-white' :
                              focusedField === 'birthday' ? 'border-cyan-400 bg-cyan-400/5 text-white' :
                              'border-white/10 bg-white/5 text-white'
                            }`}
                          />
                          <Calendar className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'birthday' ? 'text-cyan-400' : birthdayError ? 'text-red-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 12 : 14} />
                        </div>
                        {birthdayError
                          ? <p className="text-red-400 text-[9px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={9} />{birthdayError}</p>
                          : <p className="text-gray-500 text-[9px] mt-1 ml-1">Must be 16 or older</p>
                        }
                      </div>
                      {/* Academic Year */}
                      <div className="relative">
                        <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] ${
                          academicYearError ? 'text-red-400' : focusedField === 'academicYear' ? 'text-cyan-400' : 'text-gray-400'
                        }`}>Academic Year</label>
                        <div className="relative">
                          <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
                            onFocus={() => setFocusedField('academicYear')}
                            onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, academicYear: true })); }}
                            className={`w-full pl-7 md:pl-9 pr-2 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all appearance-none ${
                              academicYearError ? 'border-red-400 bg-red-400/5' :
                              academicYear ? 'border-green-400 bg-green-400/5' :
                              focusedField === 'academicYear' ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5'
                            } text-white focus:outline-none [color-scheme:dark]`}>
                            <option value="" disabled className="bg-[#1e253f]">Select</option>
                            {['1st Year','2nd Year','3rd Year','4th Year'].map(y => (
                              <option key={y} value={y} className="bg-[#1e253f]">{y}</option>
                            ))}
                          </select>
                          <GraduationCap className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 pointer-events-none ${ focusedField === 'academicYear' ? 'text-cyan-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 12 : 14} />
                        </div>
                        {academicYearError && <p className="text-red-400 text-[9px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={9} />{academicYearError}</p>}
                      </div>
                    </div>

                    {/* NIC */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] ${
                        nicError ? 'text-red-400' : focusedField === 'nic' ? 'text-cyan-400' : 'text-gray-400'
                      }`}>NIC Number</label>
                      <div className="relative">
                        <input type="text" value={nic} onChange={e => setNic(e.target.value)}
                          onFocus={() => setFocusedField('nic')}
                          onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, nic: true })); }}
                          className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                            nicError ? 'border-red-400 bg-red-400/5' :
                            nic && !nicError ? 'border-green-400 bg-green-400/5' :
                            focusedField === 'nic' ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5'
                          } text-white placeholder-transparent focus:outline-none`} placeholder="123456789V" />
                        <CreditCard className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 ${ focusedField === 'nic' ? 'text-cyan-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 14 : 16} />
                        {nic && !nicError && touchedFields.nic && <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />}
                      </div>
                      {nicError
                        ? <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} />{nicError}</p>
                        : <p className="text-[8px] text-cyan-400/40 mt-1 ml-1">Old: 123456789V · New: 200012345678</p>}
                    </div>

                    {/* Student Email (split input) */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium z-10 bg-[#1e253f] ${
                        studentIdError ? 'text-red-400' : focusedField === 'studentIdPrefix' ? 'text-cyan-400' : 'text-gray-400'
                      }`}>Student Email</label>
                      <div className={`flex items-center rounded-lg md:rounded-xl border-2 overflow-hidden transition-all ${
                        studentIdError ? 'border-red-400 bg-red-400/5' :
                        studentIdPrefix && !studentIdError ? 'border-green-400 bg-green-400/5' :
                        focusedField === 'studentIdPrefix' ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5'
                      }`}>
                        <div className="pl-8 md:pl-10 relative flex-shrink-0">
                          <Mail className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 ${ focusedField === 'studentIdPrefix' ? 'text-cyan-400' : 'text-gray-400'}`} size={isRedmiNote13 ? 14 : 16} />
                        </div>
                        <input type="text" value={studentIdPrefix}
                          onChange={e => setStudentIdPrefix(e.target.value.toUpperCase())}
                          onFocus={() => setFocusedField('studentIdPrefix')}
                          onBlur={() => { setFocusedField(null); setTouchedFields(p => ({ ...p, studentIdPrefix: true })); }}
                          className="flex-1 min-w-0 py-2 md:py-3 text-sm md:text-base text-white bg-transparent focus:outline-none"
                          placeholder="IT21234567" maxLength={10} />
                        <span className="pr-3 text-xs md:text-sm text-cyan-400/70 font-medium whitespace-nowrap flex-shrink-0 border-l border-white/10 pl-2 md:pl-3 py-2 md:py-3 bg-white/5">
                          @my.sliit.lk
                        </span>
                      </div>
                      {studentIdError
                        ? <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} />{studentIdError}</p>
                        : <p className="text-[8px] text-cyan-400/40 mt-1 ml-1">Format: IT followed by 8 digits · e.g. IT21234567@my.sliit.lk</p>}
                    </div>
                  </div>
                )}

                {/* Owner Fields */}
                {role === 'owner' && (
                  <div className="space-y-2 md:space-y-3 animate-slideDown">
                    {/* Full Name */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                        fullNameError && touchedFields.fullName
                          ? 'text-red-400'
                          : focusedField === 'fullName'
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouchedFields(prev => ({ ...prev, fullName: true }));
                          }}
                          className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                            fullNameError && touchedFields.fullName
                              ? 'border-red-400 bg-red-400/5'
                              : fullName && !fullNameError
                              ? 'border-green-400 bg-green-400/5'
                              : focusedField === 'fullName'
                              ? 'border-purple-400 bg-purple-400/5'
                              : 'border-white/10 bg-white/5'
                          } text-white placeholder-transparent focus:outline-none`}
                          placeholder="John Doe"
                        />
                        <User className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                          focusedField === 'fullName' ? 'text-purple-400' : 'text-gray-400'
                        }`} size={isRedmiNote13 ? 14 : 16} />
                        {fullName && !fullNameError && touchedFields.fullName && (
                          <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />
                        )}
                      </div>
                      {fullNameError && touchedFields.fullName && (
                        <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1">
                          <AlertCircle size={10} />
                          {fullNameError}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                        phoneNumberError && touchedFields.phoneNumber
                          ? 'text-red-400'
                          : focusedField === 'phoneNumber'
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          onFocus={() => setFocusedField('phoneNumber')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouchedFields(prev => ({ ...prev, phoneNumber: true }));
                          }}
                          className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                            phoneNumberError && touchedFields.phoneNumber
                              ? 'border-red-400 bg-red-400/5'
                              : phoneNumber && !phoneNumberError
                              ? 'border-green-400 bg-green-400/5'
                              : focusedField === 'phoneNumber'
                              ? 'border-purple-400 bg-purple-400/5'
                              : 'border-white/10 bg-white/5'
                          } text-white placeholder-transparent focus:outline-none`}
                          placeholder="+94 77 123 4567"
                        />
                        <Phone className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                          focusedField === 'phoneNumber' ? 'text-purple-400' : 'text-gray-400'
                        }`} size={isRedmiNote13 ? 14 : 16} />
                        {phoneNumber && !phoneNumberError && touchedFields.phoneNumber && (
                          <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />
                        )}
                      </div>
                      {phoneNumberError && touchedFields.phoneNumber && (
                        <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1">
                          <AlertCircle size={10} />
                          {phoneNumberError}
                        </p>
                      )}
                    </div>

                    {/* NIC */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                        ownerNicError && touchedFields.ownerNic
                          ? 'text-red-400'
                          : focusedField === 'ownerNic'
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}>
                        NIC Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ownerNic}
                          onChange={e => setOwnerNic(e.target.value.trim())}
                          onFocus={() => setFocusedField('ownerNic')}
                          onBlur={() => { setFocusedField(null); setTouchedFields(prev => ({ ...prev, ownerNic: true })); }}
                          className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                            ownerNicError && touchedFields.ownerNic
                              ? 'border-red-400 bg-red-400/5'
                              : ownerNic && !ownerNicError
                              ? 'border-green-400 bg-green-400/5'
                              : focusedField === 'ownerNic'
                              ? 'border-purple-400 bg-purple-400/5'
                              : 'border-white/10 bg-white/5'
                          } text-white placeholder-transparent focus:outline-none`}
                          placeholder="200012345678"
                        />
                        <CreditCard className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                          focusedField === 'ownerNic' ? 'text-purple-400' : 'text-gray-400'
                        }`} size={isRedmiNote13 ? 14 : 16} />
                        {ownerNic && !ownerNicError && touchedFields.ownerNic && (
                          <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />
                        )}
                      </div>
                      {ownerNicError && touchedFields.ownerNic ? (
                        <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} />{ownerNicError}</p>
                      ) : (
                        <p className="text-[8px] md:text-[10px] text-gray-500 mt-1 ml-1">Old format: 123456789V · New: 200012345678</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                        ownerAddressError && touchedFields.ownerAddress
                          ? 'text-red-400'
                          : focusedField === 'ownerAddress'
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}>
                        Residential Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ownerAddress}
                          onChange={e => setOwnerAddress(e.target.value)}
                          onFocus={() => setFocusedField('ownerAddress')}
                          onBlur={() => { setFocusedField(null); setTouchedFields(prev => ({ ...prev, ownerAddress: true })); }}
                          className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                            ownerAddressError && touchedFields.ownerAddress
                              ? 'border-red-400 bg-red-400/5'
                              : ownerAddress && !ownerAddressError
                              ? 'border-green-400 bg-green-400/5'
                              : focusedField === 'ownerAddress'
                              ? 'border-purple-400 bg-purple-400/5'
                              : 'border-white/10 bg-white/5'
                          } text-white placeholder-transparent focus:outline-none`}
                          placeholder="123 Main St, Colombo"
                        />
                        <Home className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                          focusedField === 'ownerAddress' ? 'text-purple-400' : 'text-gray-400'
                        }`} size={isRedmiNote13 ? 14 : 16} />
                        {ownerAddress && !ownerAddressError && touchedFields.ownerAddress && (
                          <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />
                        )}
                      </div>
                      {ownerAddressError && touchedFields.ownerAddress && (
                        <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} />{ownerAddressError}</p>
                      )}
                    </div>

                    {/* Occupation */}
                    <div className="relative">
                      <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                        focusedField === 'ownerOccupation' ? 'text-purple-400' : 'text-gray-400'
                      }`}>
                        Occupation <span className="text-gray-600">(optional)</span>
                      </label>
                      <div className="relative">
                        <select
                          value={ownerOccupation}
                          onChange={e => setOwnerOccupation(e.target.value)}
                          onFocus={() => setFocusedField('ownerOccupation')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all appearance-none bg-[#0f1629] ${
                            focusedField === 'ownerOccupation'
                              ? 'border-purple-400'
                              : ownerOccupation
                              ? 'border-green-400'
                              : 'border-white/10'
                          } ${ownerOccupation ? 'text-white' : 'text-gray-500'} focus:outline-none`}
                        >
                          <option value="">Select occupation</option>
                          <option value="Property Owner">Property Owner</option>
                          <option value="Landlord">Landlord / Property Manager</option>
                          <option value="Real Estate Agent">Real Estate Agent</option>
                          <option value="Developer">Developer / Builder</option>
                          <option value="Other">Other</option>
                        </select>
                        <Briefcase className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                          focusedField === 'ownerOccupation' ? 'text-purple-400' : 'text-gray-400'
                        }`} size={isRedmiNote13 ? 14 : 16} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field — owners only; students use studentIdPrefix above */}
                {role === 'owner' && (
                <div className="relative">
                  <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                    emailError && touchedFields.email
                      ? 'text-red-400'
                      : focusedField === 'email'
                      ? 'text-purple-400'
                      : 'text-gray-400'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => {
                        setFocusedField(null);
                        setTouchedFields(prev => ({ ...prev, email: true }));
                      }}
                      className={`w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                        emailError && touchedFields.email
                          ? 'border-red-400 bg-red-400/5'
                          : email && !emailError
                          ? 'border-green-400 bg-green-400/5'
                          : focusedField === 'email'
                          ? role === 'student' ? 'border-cyan-400 bg-cyan-400/5' : 'border-purple-400 bg-purple-400/5'
                          : 'border-white/10 bg-white/5'
                      } text-white placeholder-transparent focus:outline-none`}
                      placeholder="owner@company.com"
                    />
                    <Mail className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors text-purple-400" size={isRedmiNote13 ? 14 : 16} />
                    {email && !emailError && touchedFields.email && (
                      <CheckCircle className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-green-400" size={isRedmiNote13 ? 14 : 16} />
                    )}
                  </div>
                  {emailError && touchedFields.email ? (
                    <p className="text-red-400 text-[9px] md:text-xs mt-1 ml-1 flex items-center gap-1">
                      <AlertCircle size={10} />
                      {emailError}
                    </p>
                  ) : (
                    <p className="text-[8px] md:text-[10px] text-cyan-400/40 mt-1 ml-1 flex items-center gap-1">
                      <Mail size={8} />
                      Business or personal email
                    </p>
                  )}
                </div>
                )} {/* end role === 'owner' email field */}

                {/* Password Fields Grid */}
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {/* Password */}
                  <div className="relative">
                    <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                      passwordError && touchedFields.password
                        ? 'text-red-400'
                        : focusedField === 'password'
                        ? role === 'student' ? 'text-cyan-400' : 'text-purple-400'
                        : 'text-gray-400'
                    }`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouchedFields(prev => ({ ...prev, password: true }));
                        }}
                        className={`w-full pl-7 md:pl-9 pr-7 md:pr-9 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                          passwordError && touchedFields.password
                            ? 'border-red-400 bg-red-400/5'
                            : password && !passwordError
                            ? 'border-green-400 bg-green-400/5'
                            : focusedField === 'password'
                            ? role === 'student' ? 'border-cyan-400 bg-cyan-400/5' : 'border-purple-400 bg-purple-400/5'
                            : 'border-white/10 bg-white/5'
                        } text-white placeholder-transparent focus:outline-none`}
                        placeholder="••••••••"
                      />
                      <Lock className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        focusedField === 'password'
                          ? role === 'student' ? 'text-cyan-400' : 'text-purple-400'
                          : 'text-gray-400'
                      }`} size={isRedmiNote13 ? 12 : 14} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <EyeOff size={isRedmiNote13 ? 12 : 14} /> : <Eye size={isRedmiNote13 ? 12 : 14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className={`absolute -top-1.5 md:-top-2 left-2 md:left-3 px-1 text-[8px] md:text-[10px] font-medium transition-all z-10 bg-[#1e253f] ${
                      confirmError && touchedFields.confirm
                        ? 'text-red-400'
                        : focusedField === 'confirm'
                        ? role === 'student' ? 'text-cyan-400' : 'text-purple-400'
                        : 'text-gray-400'
                    }`}>
                      Confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouchedFields(prev => ({ ...prev, confirm: true }));
                        }}
                        className={`w-full pl-7 md:pl-9 pr-7 md:pr-9 py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all ${
                          confirmError && touchedFields.confirm
                            ? 'border-red-400 bg-red-400/5'
                            : confirm && !confirmError
                            ? 'border-green-400 bg-green-400/5'
                            : focusedField === 'confirm'
                            ? role === 'student' ? 'border-cyan-400 bg-cyan-400/5' : 'border-purple-400 bg-purple-400/5'
                            : 'border-white/10 bg-white/5'
                        } text-white placeholder-transparent focus:outline-none`}
                        placeholder="••••••••"
                      />
                      <Lock className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        focusedField === 'confirm'
                          ? role === 'student' ? 'text-cyan-400' : 'text-purple-400'
                          : 'text-gray-400'
                      }`} size={isRedmiNote13 ? 12 : 14} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={isRedmiNote13 ? 12 : 14} /> : <Eye size={isRedmiNote13 ? 12 : 14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1.5 md:space-y-2 animate-slideDown">
                    {/* Requirement checks — students have stricter rules */}
                    {role === 'student' ? (
                      <div className="grid grid-cols-2 gap-1 md:gap-2">
                        {[
                          { label: '8+ chars', check: password.length >= 8 },
                          { label: 'Number', check: /\d/.test(password) },
                          { label: 'Symbol', check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
                          { label: 'Uppercase', check: /[A-Z]/.test(password) },
                        ].map((req, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center ${
                              req.check ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                            }`}>
                              {req.check ? <CheckCircle size={8} /> : <div className="w-1 h-1 rounded-full bg-gray-400" />}
                            </div>
                            <span className={`text-[8px] md:text-[10px] ${req.check ? 'text-green-400' : 'text-gray-400'}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          password.length >= 6 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {password.length >= 6 ? <CheckCircle size={8} /> : <div className="w-1 h-1 rounded-full bg-gray-400" />}
                        </div>
                        <span className={`text-[8px] md:text-[10px] ${password.length >= 6 ? 'text-green-400' : 'text-gray-400'}`}>
                          Min 6 characters
                        </span>
                      </div>
                    )}

                    {/* Strength Meter */}
                    <div className="space-y-0.5 md:space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] md:text-[10px] text-gray-400">Strength</span>
                        <span className={`text-[8px] md:text-[10px] font-medium ${
                          passwordStrength?.strength === 'Strong' ? 'text-green-400' :
                          passwordStrength?.strength === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {passwordStrength?.strength}
                        </span>
                      </div>
                      <div className="h-1 md:h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${passwordStrength?.strengthColor}`}
                          style={{ width: `${(passwordStrength?.score || 0) * 25}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                  <div className="flex items-center gap-1.5 md:gap-2 bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl p-2 md:p-3 animate-shake">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={isRedmiNote13 ? 14 : 16} />
                    <span className="text-red-400 text-xs md:text-sm">{error}</span>
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-1.5 md:gap-2 bg-green-500/10 border border-green-500/30 rounded-lg md:rounded-xl p-2 md:p-3 animate-pulse">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={isRedmiNote13 ? 14 : 16} />
                    <span className="text-green-400 text-xs md:text-sm">{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ width:'100%', marginTop:8, padding:'13px', borderRadius:13, border:'none', background:'linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#22d3ee 100%)', color:'#fff', fontSize:15, fontWeight:700, cursor:isLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 24px rgba(99,102,241,.35)', opacity:isLoading?0.65:1, transition:'opacity .2s,transform .15s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.opacity='0.92'; e.currentTarget.style.transform='translateY(-1px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.opacity=isLoading?'0.65':'1'; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%)', pointerEvents:'none' }} />
                  {isLoading
                    ? <><Loader2 size={16} className="animate-spin" />Creating account…</>
                    : <><Sparkles size={15} />Create Account</>}
                </button>
              </form>

              <div style={{ marginTop:18, textAlign:'center' }}>
                <p style={{ color:'rgba(148,163,184,.5)', fontSize:13, marginBottom:12 }}>
                  Already have an account?{' '}
                  <a href="/signin" style={{ color:'#818cf8', fontWeight:600, textDecoration:'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color='#a5b4fc')} onMouseLeave={e => (e.currentTarget.style.color='#818cf8')}>
                    Sign in
                  </a>
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14 }}>
                  <a href="/terms" style={{ fontSize:11, color:'rgba(148,163,184,.35)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                    onMouseEnter={e => (e.currentTarget.style.color='rgba(165,180,252,.6)')} onMouseLeave={e => (e.currentTarget.style.color='rgba(148,163,184,.35)')}>
                    <FileText size={10} />Terms
                  </a>
                  <span style={{ color:'rgba(148,163,184,.2)', fontSize:11 }}>·</span>
                  <a href="/privacy" style={{ fontSize:11, color:'rgba(148,163,184,.35)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                    onMouseEnter={e => (e.currentTarget.style.color='rgba(165,180,252,.6)')} onMouseLeave={e => (e.currentTarget.style.color='rgba(148,163,184,.35)')}>
                    <Shield size={10} />Privacy
                  </a>
                </div>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* close su-right-panel + main layout */}
      </div>{/* su-right-panel */}
      </div>{/* main layout flex */}

      <style>{`
        @keyframes ping { 0%{transform:scale(1);opacity:.6;} 75%,100%{transform:scale(2);opacity:0;} }
        .animate-ping { animation: ping 1.5s cubic-bezier(0,0,.2,1) infinite; }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Redmi Note 13 specific optimizations */
        @media (max-width: 400px) {
          input, button {
            min-height: 44px;
          }
          .text-xs {
            font-size: 11px;
          }
          .gap-1 {
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}