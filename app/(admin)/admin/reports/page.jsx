"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Users, Package, ShoppingCart, IndianRupee, Calendar } from "lucide-react";

const REPORT_TYPES = [
  { key: "sales",     label: "Sales Report",     icon: IndianRupee,  desc: "Revenue, orders, and payment breakdown" },
  { key: "products",  label: "Product Report",   icon: Package,      desc: "Best sellers, stock levels, and returns" },
  { key: "customers", label: "Customer Report",  icon: Users,        desc: "New registrations, activity, and retention" },
  { key: "orders",    label: "Orders Report",    icon: ShoppingCart, desc: "Order status, fulfilment times, and returns" },
];

export default function AdminReportsPage() {
  const [selected, setSelected]   = useState("sales");
  const [dateRange, setDateRange] = useState("30");
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setGenerating(true);
    setReportData(null);
    try {
      const r = await fetch(`/api/admin/stats?days=${dateRange}&type=${selected}`);
      const d = await r.json();
      setReportData(d);
    } catch { /* ignore */ }
    finally { setGenerating(false); }
  };

  const downloadCSV = () => {
    if (!reportData) return;
    const rows = [];
    rows.push(["Metric", "Value"]);
    Object.entries(reportData).forEach(([k, v]) => {
      if (typeof v !== "object") rows.push([k, v]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected}-report-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-white">Reports</h1>
        <p className="text-xs text-[#B8B8B8] mt-0.5">Generate and export business reports</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="space-y-5">
          {/* Report Type */}
          <div className="p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-white mb-4">Report Type</h2>
            <div className="space-y-2">
              {REPORT_TYPES.map(({ key, label, icon: Icon, desc }) => (
                <button key={key} onClick={() => setSelected(key)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${selected === key ? "bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)]" : "hover:bg-white/5 border border-transparent"}`}>
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected === key ? "text-[#D4AF37]" : "text-[#B8B8B8]"}`} />
                  <div>
                    <p className={`text-sm font-medium ${selected === key ? "text-[#D4AF37]" : "text-white"}`}>{label}</p>
                    <p className="text-[10px] text-[#B8B8B8] leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" /> Date Range
            </h2>
            <div className="space-y-2">
              {[["7", "Last 7 days"], ["30", "Last 30 days"], ["90", "Last 90 days"], ["365", "Last year"]].map(([val, label]) => (
                <button key={val} onClick={() => setDateRange(val)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${dateRange === val ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]" : "text-[#B8B8B8] hover:bg-white/5"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateReport}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Generating…</>
            ) : (
              <><FileText className="w-4 h-4" /> Generate Report</>
            )}
          </button>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] min-h-96">
            {!reportData && !generating && (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <FileText className="w-14 h-14 text-[#B8B8B8]/20 mb-4" />
                <p className="text-[#B8B8B8] font-medium">No report generated yet</p>
                <p className="text-xs text-[#B8B8B8]/60 mt-1">Select a report type and date range, then click Generate</p>
              </div>
            )}
            {generating && (
              <div className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.15)] border-t-[#D4AF37] animate-spin" />
                  <p className="text-sm text-[#B8B8B8]">Generating report…</p>
                </div>
              </div>
            )}
            {reportData && !generating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl text-white capitalize">
                    {REPORT_TYPES.find((t) => t.key === selected)?.label}
                  </h2>
                  <button onClick={downloadCSV}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(212,175,55,0.2)] text-[#D4AF37] text-xs hover:bg-[rgba(212,175,55,0.05)] transition-colors">
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(reportData).map(([key, value]) => {
                    if (typeof value === "object") return null;
                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                    return (
                      <div key={key} className="p-4 rounded-xl bg-white/[0.03] border border-[rgba(212,175,55,0.06)]">
                        <p className="text-xs text-[#B8B8B8] mb-1">{label}</p>
                        <p className="text-lg font-semibold text-white">
                          {typeof value === "number" && (key.toLowerCase().includes("revenue") || key.toLowerCase().includes("value"))
                            ? `₹${Number(value).toLocaleString("en-IN")}`
                            : value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
