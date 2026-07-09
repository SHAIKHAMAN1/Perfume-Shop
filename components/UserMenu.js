"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="user-menu">
      {user.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || "User"}
          width={32}
          height={32}
          className="user-avatar"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="user-avatar-fallback">
          {(user.displayName || user.email || "U")[0].toUpperCase()}
        </div>
      )}
      <span className="user-name">{user.displayName || user.email}</span>
      <button id="sign-out-btn" onClick={handleSignOut} className="signout-btn">
        Sign out
      </button>

      <style>{`
        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.375rem 0.75rem 0.375rem 0.375rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          font-family: inherit;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        .user-name {
          font-size: 0.85rem;
          color: #a1a1aa;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .signout-btn {
          font-size: 0.8rem;
          font-weight: 500;
          color: #71717a;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .signout-btn:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.08);
        }
      `}</style>
    </div>
  );
}
