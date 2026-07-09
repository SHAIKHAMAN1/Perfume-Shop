"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext(null);

/** Exchange a Firebase ID token for a server session cookie. */
async function exchangeTokenForSession(user) {
  try {
    const idToken = await user.getIdToken(/* forceRefresh */ true);
    const res = await fetch("/api/auth/session", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ idToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Session creation failed.");
    return { ok: true, role: data.role };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState("customer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Restore role from server session cookie on every page load / refresh.
        // This prevents role falling back to "customer" after a hard refresh.
        try {
          const res  = await fetch("/api/auth/me");
          const data = await res.json();
          if (data.authenticated) setRole(data.role);
        } catch {
          // silently ignore — role stays as default "customer"
        }
      } else {
        setRole("customer");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ── Google Sign-In ─────────────────────────────────────── */
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { ok, role: r, error } = await exchangeTokenForSession(result.user);
      if (ok) setRole(r);
      return { user: result.user, role: r, error: ok ? null : error };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  /* ── Email / Password Sign-In ───────────────────────────── */
  async function signInWithEmailPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { ok, role: r, error } = await exchangeTokenForSession(result.user);
      if (ok) setRole(r);
      return { user: result.user, role: r, error: ok ? null : error };
    } catch (error) {
      return { user: null, error: friendlyError(error.code) };
    }
  }

  /* ── Email / Password Sign-Up ───────────────────────────── */
  async function signUpWithEmail(name, email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser({ ...result.user, displayName: name });
      const { ok, role: r, error } = await exchangeTokenForSession(result.user);
      if (ok) setRole(r);
      return { user: result.user, role: r, error: ok ? null : error };
    } catch (error) {
      return { user: null, error: friendlyError(error.code) };
    }
  }

  /* ── Sign-Out ───────────────────────────────────────────── */
  async function signOut() {
    try {
      await firebaseSignOut(auth);
      await fetch("/api/auth/signout", { method: "POST" });
      setRole("customer");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  const value = {
    user,
    role,
    loading,
    isAdmin     : role === "admin" || role === "super_admin",
    isSuperAdmin: role === "super_admin",
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/* ── Error helpers ──────────────────────────────────────────── */
function friendlyError(code) {
  const map = {
    "auth/invalid-email"       : "Invalid email address.",
    "auth/user-not-found"      : "No account found with this email.",
    "auth/wrong-password"      : "Incorrect password.",
    "auth/invalid-credential"  : "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password"       : "Password must be at least 6 characters.",
    "auth/too-many-requests"   : "Too many attempts. Please try again later.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
