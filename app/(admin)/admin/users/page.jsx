"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Shield, ShieldOff } from "lucide-react";
import useUIStore from "@/store/useUIStore";

export default function AdminUsersPage() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const addToast     = useUIStore((s) => s.addToast);

  const [users,      setUsers]      = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [q,          setQ]          = useState(searchParams.get("q") ?? "");
  const [updating,   setUpdating]   = useState(null);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    try {
      const res  = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (res.ok) { setUsers(data.users); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleBlock = async (userId, currentlyBlocked, name) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentlyBlocked }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast({ type: "success", message: `${name} ${!currentlyBlocked ? "blocked" : "unblocked"}.` });
        setUsers((u) => u.map((x) => x._id === userId ? { ...x, isBlocked: !currentlyBlocked } : x));
      } else {
        addToast({ type: "error", message: data.error });
      }
    } catch { addToast({ type: "error", message: "Failed to update user." }); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-white">Customers</h1>
        <p className="text-sm text-[#B8B8B8]">{pagination?.total ?? 0} registered customers</p>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); updateParam("q", q); }} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/50"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-xl text-sm hover:bg-[rgba(212,175,55,0.15)] transition-colors">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.08)]">
                {["Customer","Email","Joined","Last Login","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-[#B8B8B8] uppercase tracking-widest font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              {loading
                ? Array.from({length: 10}).map((_,i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
                : users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
                          <span className="text-black text-xs font-bold">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
                        </div>
                        <span className="text-white text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#B8B8B8]">{user.email}</td>
                    <td className="px-4 py-3 text-xs text-[#B8B8B8]">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3 text-xs text-[#B8B8B8]">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN") : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${user.isBlocked ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleBlock(user._id, user.isBlocked, user.name)}
                        disabled={updating === user._id}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border transition-all disabled:opacity-50 ${
                          user.isBlocked
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/5"
                            : "border-red-500/30 text-red-400 hover:bg-red-500/5"
                        }`}
                      >
                        {user.isBlocked ? <><Shield className="w-3 h-3" /> Unblock</> : <><ShieldOff className="w-3 h-3" /> Block</>}
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {!loading && users.length === 0 && (
            <p className="text-center py-16 text-sm text-[#B8B8B8]">No customers found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
