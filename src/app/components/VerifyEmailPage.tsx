 /// <reference types="vite/client" />
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader2, MailCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ token?: string }>();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [manualVerificationUrl, setManualVerificationUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('We’ve sent a verification link to your email address. Please check your inbox and follow the instructions to activate your account.');

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = params.token || query.get('token') || '';
  const email = query.get('email') || '';

  const buildFrontendVerificationUrl = (sourceUrl: string) => {
    try {
      const parsed = new URL(sourceUrl);
      const extractedToken = parsed.searchParams.get('token');
      if (!extractedToken) return '';
      return `/verify-email?token=${encodeURIComponent(extractedToken)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      setIsVerifying(true);
      setStatus('idle');

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully. You can now sign in.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Invalid or expired verification link.');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token]);

  useEffect(() => {
    if (status !== 'success') return;

    const timeout = setTimeout(() => {
      const destination = email
        ? `/signin?email=${encodeURIComponent(email)}`
        : '/signin';
      navigate(destination);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [status, email, navigate]);

  const handleResend = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Missing email. Please sign up again to get a new verification link.');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not resend verification email');
      }

      const returnedVerificationUrl = result?.data?.verificationUrl;
      if (typeof returnedVerificationUrl === 'string' && returnedVerificationUrl.trim()) {
        const frontendVerificationUrl = buildFrontendVerificationUrl(returnedVerificationUrl);
        setManualVerificationUrl(frontendVerificationUrl || returnedVerificationUrl);
      }

      setStatus('idle');
      setMessage('Verification link is ready. Check your inbox or use the manual verify button below.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] p-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181f36]/90 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          {isVerifying || isResending ? (
            <Loader2 className="w-10 h-10 text-cyan-300 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          ) : status === 'error' ? (
            <AlertCircle className="w-10 h-10 text-rose-400" />
          ) : (
            <MailCheck className="w-10 h-10 text-cyan-300" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-cyan-300 text-center mb-4">Verify Your Email</h1>
        <p className={`text-center max-w-md mx-auto ${
          status === 'error' ? 'text-rose-100' : 
          status === 'success' ? 'text-emerald-100' : 
          'text-cyan-100'
        }`}>
          {message}
        </p>

        {!isVerifying && !isResending && status !== 'success' && token && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/40 rounded-lg">
            <p className="text-blue-100 text-sm mb-3">
              <strong>Verify via direct link:</strong>
            </p>
            <a
              href={`${API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition text-sm font-medium break-all"
            >
              Click Here to Verify Email
            </a>
            <p className="text-blue-200/70 text-xs mt-2">
              Opens in a new tab. You'll see a confirmation message after verification.
            </p>
          </div>
        )}

        {!token && email && (
          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-600/40 rounded-lg">
            <p className="text-amber-100 text-sm mb-3">
              <strong>If you didn't receive the email:</strong>
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Resending...' : 'Resend Verification Email'}
            </button>

            {manualVerificationUrl && (
              <a
                href={manualVerificationUrl}
                className="mt-3 inline-block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition text-sm font-medium"
              >
                Verify With Fresh Link
              </a>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="w-full rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 py-2.5 font-semibold hover:bg-cyan-500/30 transition"
          >
            Go to Sign In
          </button>
        </div>

        {!token && !email && (
          <p className="text-xs text-cyan-200/70 text-center mt-4">
            Tip: after signup you will be redirected here with your email so you can resend verification.
          </p>
        )}
      </div>
    </div>
  );
}
