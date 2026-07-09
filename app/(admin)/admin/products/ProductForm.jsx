"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";

const CONCENTRATIONS = ["EDC", "EDT", "EDP", "Parfum", "Pure Parfum", "Attar", "Body Mist", "Other"];
const GENDERS        = ["Men","Women","Unisex"];
const FAMILIES       = ["Floral","Oriental","Woody","Fresh","Citrus","Aquatic","Gourmand","Fougère","Chypre","Spicy"];
const OCCASIONS      = ["Casual","Office","Evening","Night Out","Date","Outdoor","Formal","Wedding"];
const SEASONS        = ["Spring","Summer","Autumn","Winter","All Season"];

function TagInput({ label, tags, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setInput("");
  };
  const remove = (tag) => onChange(tags.filter((t) => t !== tag));
  return (
    <div>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-xl text-sm hover:bg-[rgba(212,175,55,0.15)] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] text-[#D4AF37] rounded-full">
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  return (
    <div>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt} type="button"
            onClick={() => onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt])}
            className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
              selected.includes(opt)
                ? "bg-[rgba(212,175,55,0.12)] border-[rgba(212,175,55,0.3)] text-[#D4AF37]"
                : "border-[rgba(212,175,55,0.08)] text-[#B8B8B8] hover:border-[rgba(212,175,55,0.2)] hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, placeholder, required, half }) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
      />
    </div>
  );
}

const EMPTY = {
  name:"", slug:"", sku:"", description:"",
  price:"", salePrice:"", stock:"", concentration:"",
  gender:"", fragranceFamily:"", brand:"", category:"",
  topNotes:[], middleNotes:[], baseNotes:[],
  volumes:[], occasion:[], season:[],
  images:[], longevity:"", projection:"",
  isFeatured:false, isBestSeller:false, isNewArrival:false, isActive:true,
};

export default function ProductFormPage() {
  const router   = useRouter();
  const params   = useParams();
  const addToast = useUIStore((s) => s.addToast);
  const isEdit   = !!params?.id;

  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands").then(async (r) => {
        const data = await r.json();
        if (!r.ok) { console.error("[ProductForm] brands fetch error:", data); return { brands: [] }; }
        return data;
      }),
      fetch("/api/admin/categories").then(async (r) => {
        const data = await r.json();
        if (!r.ok) { console.error("[ProductForm] categories fetch error:", data); return { categories: [] }; }
        return data;
      }),
    ]).then(([bData, cData]) => {
      const bs = bData.brands ?? [];
      const cs = cData.categories ?? [];
      setBrands(bs);
      setCategories(cs);
      if (bs.length === 0) addToast({ type: "info", message: "No brands found. Please seed the database first." });
      if (cs.length === 0) addToast({ type: "info", message: "No categories found. Please seed the database first." });
    }).catch((err) => {
      console.error("[ProductForm] fetch error:", err);
      addToast({ type: "error", message: "Failed to load brands/categories. Check your connection." });
    });
  }, []);


  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          const p = d.product;
          setForm({
            ...EMPTY, ...p,
            price    : p.price ?? "",
            salePrice: p.salePrice ?? "",
            stock    : p.stock ?? "",
            brand    : p.brand?._id ?? p.brand ?? "",
            category : p.category?._id ?? p.category ?? "",
            longevity: p.longevity ?? "",
            projection: p.projection ?? "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isEdit, params?.id]);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({
      ...f, name,
      slug: f.slug === "" || f.slug === f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : f.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation ──────────────────────────────────────────
    const validationErrors = [];
    if (!form.name.trim())        validationErrors.push("Product name is required.");
    if (!form.description.trim()) validationErrors.push("Description is required.");
    if (!form.brand)              validationErrors.push("Please select a brand.");
    if (!form.category)           validationErrors.push("Please select a category.");
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
                                  validationErrors.push("A valid price is required.");
    if (form.stock === "" || isNaN(parseInt(form.stock)) || parseInt(form.stock) < 0)
                                  validationErrors.push("A valid stock quantity is required.");

    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => addToast({ type: "error", message: msg }));
      return;
    }
    // ───────────────────────────────────────────────────────────────────

    setSaving(true);
    try {
      // Build payload — only include optional ObjectId / numeric fields when they have values
      const payload = {
        ...form,
        name       : form.name.trim(),
        slug       : form.slug.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: form.description.trim(),
        brand      : form.brand,      // already validated non-empty above
        category   : form.category,   // already validated non-empty above
        price      : parseFloat(form.price),
        stock      : parseInt(form.stock),
      };

      // Optional numeric fields — only include when provided
      if (form.salePrice && !isNaN(parseFloat(form.salePrice))) {
        payload.salePrice = parseFloat(form.salePrice);
      } else {
        delete payload.salePrice;
      }
      if (form.longevity && !isNaN(parseInt(form.longevity))) {
        payload.longevity = parseInt(form.longevity);
      } else {
        delete payload.longevity;
      }
      if (form.projection && !isNaN(parseInt(form.projection))) {
        payload.projection = parseInt(form.projection);
      } else {
        delete payload.projection;
      }
      // Remove any remaining empty-string optional fields
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });

      const url    = isEdit ? `/api/admin/products/${params.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (res.ok) {
        addToast({ type: "success", message: `Product ${isEdit ? "updated" : "created"} successfully!` });
        router.push("/admin/products");
        router.refresh(); // bust Next.js router cache so the new product appears immediately
      } else {
        addToast({ type: "error", message: data.error || "Failed to save product." });
      }
    } catch { addToast({ type: "error", message: "Failed to save product." }); }
    finally { setSaving(false); }
  };


  if (loading) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#B8B8B8] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-white">{isEdit ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-sm text-[#B8B8B8]">{isEdit ? "Update product details" : "Fill in the details below"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic info */}
        <section className="luxury-card p-6">
          <h2 className="font-medium text-white mb-5 text-sm uppercase tracking-widest text-[#D4AF37]">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Product Name <span className="text-red-400">*</span></label>
              <input
                name="name" value={form.name} onChange={handleNameChange} required placeholder="e.g. Dior Sauvage EDP"
                className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
              />
            </div>
            <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} placeholder="dior-sauvage-edp" half />
            <InputField label="SKU" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU-001" half />
            <div className="col-span-2">
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4} required
                placeholder="Describe the fragrance…"
                className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing & Stock */}
        <section className="luxury-card p-6">
          <h2 className="font-medium text-sm uppercase tracking-widest text-[#D4AF37] mb-5">Pricing & Stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} placeholder="4999" required half />
            <InputField label="Sale Price (₹)" name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="Leave blank if no sale" half />
            <InputField label="Stock Quantity" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" required half />
            <div className="col-span-1">
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Brand <span className="text-red-400">*</span></label>
              <select name="brand" value={form.brand} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none appearance-none">
                <option value="" className="bg-[#171717]">Select Brand…</option>
                {brands.map((b) => <option key={b._id} value={b._id} className="bg-[#171717]">{b.name}</option>)}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Category <span className="text-red-400">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none appearance-none">
                <option value="" className="bg-[#171717]">Select Category…</option>
                {categories.map((c) => <option key={c._id} value={c._id} className="bg-[#171717]">{c.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Fragrance details */}
        <section className="luxury-card p-6 space-y-5">
          <h2 className="font-medium text-sm uppercase tracking-widest text-[#D4AF37]">Fragrance Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Concentration</label>
              <select name="concentration" value={form.concentration} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none appearance-none">
                <option value="" className="bg-[#171717]">Select…</option>
                {CONCENTRATIONS.map((c) => <option key={c} value={c} className="bg-[#171717]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none appearance-none">
                <option value="" className="bg-[#171717]">Select…</option>
                {GENDERS.map((g) => <option key={g} value={g} className="bg-[#171717]">{g}</option>)}
              </select>
            </div>
          </div>
          <MultiSelect label="Fragrance Family" options={FAMILIES} selected={form.fragranceFamily ? [form.fragranceFamily] : []}
            onChange={(v) => set("fragranceFamily", v[v.length - 1] ?? "")} />
          <TagInput label="Top Notes" tags={form.topNotes} onChange={(v) => set("topNotes", v)} placeholder="e.g. Bergamot" />
          <TagInput label="Heart Notes" tags={form.middleNotes} onChange={(v) => set("middleNotes", v)} placeholder="e.g. Rose" />
          <TagInput label="Base Notes" tags={form.baseNotes} onChange={(v) => set("baseNotes", v)} placeholder="e.g. Musk" />
          <TagInput label="Available Volumes" tags={form.volumes} onChange={(v) => set("volumes", v)} placeholder="e.g. 50ml" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Longevity (1–10)" name="longevity" type="number" value={form.longevity} onChange={handleChange} placeholder="7" half />
            <InputField label="Projection (1–10)" name="projection" type="number" value={form.projection} onChange={handleChange} placeholder="8" half />
          </div>
          <MultiSelect label="Occasion" options={OCCASIONS} selected={form.occasion} onChange={(v) => set("occasion", v)} />
          <MultiSelect label="Season" options={SEASONS} selected={form.season} onChange={(v) => set("season", v)} />
        </section>

        {/* Images */}
        <section className="luxury-card p-6">
          <h2 className="font-medium text-sm uppercase tracking-widest text-[#D4AF37] mb-4">Product Images</h2>
          <TagInput label="Image URLs" tags={form.images} onChange={(v) => set("images", v)} placeholder="https://…" />
          <p className="text-[10px] text-[#B8B8B8]/50 mt-2">Add full image URLs. Cloudinary integration coming in Phase 5.</p>
        </section>

        {/* Flags */}
        <section className="luxury-card p-6">
          <h2 className="font-medium text-sm uppercase tracking-widest text-[#D4AF37] mb-4">Flags & Visibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "isActive",    label: "Active (visible)" },
              { name: "isFeatured",  label: "Featured" },
              { name: "isBestSeller",label: "Best Seller" },
              { name: "isNewArrival",label: "New Arrival" },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2.5 p-3 rounded-xl border border-[rgba(212,175,55,0.08)] cursor-pointer hover:border-[rgba(212,175,55,0.2)] transition-colors">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="accent-[#D4AF37] w-4 h-4" />
                <span className="text-sm text-white">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <GoldButton type="submit" disabled={saving} size="lg">
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-4 h-4" /> {isEdit ? "Update Product" : "Create Product"}</span>
            )}
          </GoldButton>
          <Link href="/admin/products"><GoldButton variant="outline" size="lg">Cancel</GoldButton></Link>
        </div>
      </form>
    </div>
  );
}
