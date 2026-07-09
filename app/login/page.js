"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmailPassword, signUpWithEmail } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Safe redirect: only allow relative paths starting with /
  const rawRedirect = searchParams.get("redirect") || "/";
  const redirectTo  = rawRedirect.startsWith("/") ? rawRedirect : "/";

  const [tab, setTab] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [user, loading, router, redirectTo]);

  function switchTab(t) {
    setTab(t);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleGoogleSignIn() {
    setError("");
    setSubmitting(true);
    const { error: err } = await signInWithGoogle();
    if (err) setError(err);
    else router.replace(redirectTo);
    setSubmitting(false);
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    let result;
    if (tab === "signup") {
      if (!name.trim()) { setError("Please enter your name."); setSubmitting(false); return; }
      result = await signUpWithEmail(name.trim(), email, password);
    } else {
      result = await signInWithEmailPassword(email, password);
    }

    if (result.error) setError(result.error);
    else router.replace(redirectTo);
    setSubmitting(false);
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div className="login-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">
        {/* Logo */}
        <div className="logo-ring">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
            <path d="M8 12h16M8 16h10M8 20h13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tab switcher */}
        <div className="tab-switcher">
          <button
            id="tab-signin"
            className={`tab-btn ${tab === "signin" ? "tab-active" : ""}`}
            onClick={() => switchTab("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            id="tab-signup"
            className={`tab-btn ${tab === "signup" ? "tab-active" : ""}`}
            onClick={() => switchTab("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Google button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          className="google-btn"
          disabled={submitting}
          type="button"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="divider">
          <span>or continue with email</span>
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailSubmit} className="auth-form" noValidate>
          {tab === "signup" && (
            <div className="field">
              <label htmlFor="name-input">Full name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email-input">Email address</label>
            <input
              id="email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password-input">Password</label>
            <div className="password-wrap">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder={tab === "signup" ? "At least 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={tab === "signup" ? "new-password" : "current-password"}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-msg" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            id="email-submit-btn"
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-spinner" />
            ) : tab === "signup" ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="login-footer">
          By continuing, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <style>{`
        .login-root {
          position: relative;
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          background: #09090b;
          overflow: hidden;
          padding: 1.5rem 1rem;
        }

        /* ── Blobs ── */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          pointer-events: none;
          animation: blobFloat 10s ease-in-out infinite;
        }
        .blob-1 { width:500px;height:500px;background:radial-gradient(circle,#7c3aed,transparent 70%);top:-150px;left:-100px;animation-delay:0s; }
        .blob-2 { width:400px;height:400px;background:radial-gradient(circle,#4f46e5,transparent 70%);bottom:-100px;right:-80px;animation-delay:3s; }
        .blob-3 { width:300px;height:300px;background:radial-gradient(circle,#0ea5e9,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:6s;animation-name:blobFloat3; }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-20px) scale(1.05)} 66%{transform:translate(-10px,15px) scale(0.97)} }
        @keyframes blobFloat3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.1)} }

        /* ── Card ── */
        .login-card {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1.25rem;
          width: 100%;
          max-width: 420px;
          padding: 2.25rem 2rem;
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.5rem;
          box-shadow: 0 0 0 1px rgba(124,58,237,0.1), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* ── Logo ── */
        .logo-ring {
          align-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          box-shadow: 0 0 24px rgba(124,58,237,0.2);
        }

        /* ── Tab switcher ── */
        .tab-switcher {
          display: flex;
          align-self: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 3px;
          gap: 2px;
        }
        .tab-btn {
          flex: 1;
          padding: 0.45rem 1.4rem;
          border-radius: 8px;
          border: none;
          background: none;
          color: #71717a;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: inherit;
        }
        .tab-active {
          background: rgba(124,58,237,0.2);
          color: #c4b5fd;
        }

        /* ── Google button ── */
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e4e4e7;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: inherit;
        }
        .google-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #3f3f46;
          font-size: 0.75rem;
        }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }
        .divider span { white-space: nowrap; color: #52525b; }

        /* ── Form ── */
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field label { font-size: 0.8rem; font-weight: 500; color: #a1a1aa; }
        .field input {
          width: 100%;
          padding: 0.7rem 0.875rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fafafa;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .field input::placeholder { color: #52525b; }
        .field input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 2.75rem; }
        .eye-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #52525b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #a1a1aa; }

        /* ── Error ── */
        .error-msg {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.875rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 0.5rem;
          color: #fca5a5;
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .error-msg svg { flex-shrink: 0; }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
          font-family: inherit;
          min-height: 44px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .login-footer {
          font-size: 0.72rem;
          color: #52525b;
          text-align: center;
          margin: 0;
          line-height: 1.6;
        }
        .login-footer a { color: #7c3aed; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
