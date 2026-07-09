/**
 * seed-full.js — Comprehensive seed script for LUXEURE
 * Inserts brands, categories, and dummy products into MongoDB Atlas.
 * Run with: node seed-full.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

// ── Inline schemas (mirrors production models exactly) ──────────────────────

const BrandSchema = new mongoose.Schema({
  name       : { type: String, required: true, trim: true },
  slug       : { type: String, required: true, unique: true, lowercase: true },
  logo       : String,
  description: String,
  country    : String,
  isFeatured : { type: Boolean, default: false },
  isActive   : { type: Boolean, default: true },
  order      : { type: Number, default: 0 },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name      : { type: String, required: true, trim: true },
  slug      : { type: String, required: true, unique: true, lowercase: true },
  description: String,
  icon      : String,
  parentId  : { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive  : { type: Boolean, default: true },
  order     : { type: Number, default: 0 },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name            : { type: String, required: true, trim: true },
  slug            : { type: String, required: true, unique: true, lowercase: true },
  brand           : { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category        : { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description     : { type: String, required: true },
  price           : { type: Number, required: true, min: 0 },
  salePrice       : { type: Number, min: 0 },
  sku             : { type: String, unique: true, sparse: true, uppercase: true },
  stock           : { type: Number, required: true, default: 0 },
  images          : [String],
  volumes         : [String],
  concentration   : String,
  fragranceFamily : String,
  gender          : String,
  topNotes        : [String],
  middleNotes     : [String],
  baseNotes       : [String],
  longevity       : Number,
  projection      : Number,
  occasion        : [String],
  season          : [String],
  isFeatured      : { type: Boolean, default: false },
  isBestSeller    : { type: Boolean, default: false },
  isNewArrival    : { type: Boolean, default: true },
  isActive        : { type: Boolean, default: true },
  rating          : { type: Number, default: 0 },
  reviewCount     : { type: Number, default: 0 },
  soldCount       : { type: Number, default: 0 },
  tags            : [String],
}, { timestamps: true });

// Register models safely
const Brand    = mongoose.models.Brand    || mongoose.model('Brand',    BrandSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product  = mongoose.models.Product  || mongoose.model('Product',  ProductSchema);

// ── Seed data ───────────────────────────────────────────────────────────────

const BRANDS = [
  { name: 'Dior',          slug: 'dior',          country: 'France',       isFeatured: true,  description: 'House of Dior — iconic French luxury house.' },
  { name: 'Chanel',        slug: 'chanel',        country: 'France',       isFeatured: true,  description: 'Timeless elegance from the house of Chanel.' },
  { name: 'Tom Ford',      slug: 'tom-ford',      country: 'USA',          isFeatured: true,  description: 'Bold, provocative luxury fragrances.' },
  { name: 'Creed',         slug: 'creed',         country: 'France',       isFeatured: true,  description: 'Royal niche perfumery since 1760.' },
  { name: 'Versace',       slug: 'versace',       country: 'Italy',        isFeatured: false, description: 'Italian luxury fashion and fragrance.' },
  { name: 'Armani',        slug: 'armani',        country: 'Italy',        isFeatured: true,  description: 'Sophisticated Italian elegance.' },
  { name: 'YSL',           slug: 'ysl',           country: 'France',       isFeatured: false, description: 'Yves Saint Laurent — bold French fashion house.' },
  { name: 'Maison Margiela', slug: 'maison-margiela', country: 'France',  isFeatured: true,  description: 'Replica collection — evocative memories.' },
  { name: 'Amouage',       slug: 'amouage',       country: 'Oman',         isFeatured: true,  description: 'The gift of kings — luxury Arabian perfumery.' },
  { name: 'Jo Malone',     slug: 'jo-malone',     country: 'UK',           isFeatured: false, description: 'Simple, elegant London-born fragrances.' },
];

const CATEGORIES = [
  { name: 'Men',            slug: 'men',            icon: '👔', description: 'Fragrances crafted for men.' },
  { name: 'Women',          slug: 'women',          icon: '👗', description: 'Fragrances crafted for women.' },
  { name: 'Unisex',         slug: 'unisex',         icon: '✨', description: 'Gender-neutral fragrances for everyone.' },
  { name: 'Arabic',         slug: 'arabic',         icon: '🌙', description: 'Rich, oud-forward Arabic fragrances.' },
  { name: 'Niche',          slug: 'niche',          icon: '💎', description: 'Exclusive niche and artisanal perfumes.' },
  { name: 'Celebrity',      slug: 'celebrity',      icon: '⭐', description: 'Celebrity-endorsed fragrances.' },
  { name: 'Gift Sets',      slug: 'gift-sets',      icon: '🎁', description: 'Curated luxury fragrance gift sets.' },
  { name: 'Body Mist',      slug: 'body-mist',      icon: '🌸', description: 'Light and refreshing body mists.' },
];

// Will be populated after brand/category insertion
const PRODUCTS_TEMPLATE = [
  {
    name           : 'Dior Sauvage EDP',
    slug           : 'dior-sauvage-edp',
    sku            : 'DIOR-SAU-EDP-100',
    description    : 'An authentic act of freedom from Dior. Dior Sauvage EDP is a raw and noble fragrance, an expression of a nature that is both wild and of great distinction. Fresh top notes of Calabrian bergamot give way to a spicy and woody heart, with a base of smoky woods and musk.',
    price          : 12500,
    salePrice      : 10999,
    stock          : 50,
    brandKey       : 'dior',
    categoryKey    : 'men',
    images         : ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Men',
    fragranceFamily: 'Fresh',
    topNotes       : ['Calabrian Bergamot', 'Pepper'],
    middleNotes    : ['Sichuan Pepper', 'Lavender', 'Iris'],
    baseNotes      : ['Cedar', 'Labdanum', 'Ambroxan'],
    volumes        : ['60ml', '100ml', '200ml'],
    longevity      : 8,
    projection     : 7,
    occasion       : ['Casual', 'Office', 'Evening'],
    season         : ['Spring', 'Autumn', 'Winter'],
    isFeatured     : true,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.8,
    reviewCount    : 234,
    soldCount      : 1820,
    tags           : ['fresh', 'spicy', 'woody', 'masculine'],
  },
  {
    name           : 'Chanel No. 5 Parfum',
    slug           : 'chanel-no-5-parfum',
    sku            : 'CHAN-NO5-PAR-100',
    description    : "The world's most iconic fragrance. Chanel No. 5 Parfum is the quintessential floral aldehyde fragrance — an abstract, revolutionary scent that transformed the world of perfumery. Timeless, sophisticated, and utterly feminine.",
    price          : 18500,
    salePrice      : null,
    stock          : 30,
    brandKey       : 'chanel',
    categoryKey    : 'women',
    images         : ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'Parfum',
    gender         : 'Women',
    fragranceFamily: 'Floral',
    topNotes       : ['Aldehydes', 'Neroli', 'Ylang-Ylang'],
    middleNotes    : ['Iris', 'Jasmine', 'Rose'],
    baseNotes      : ['Civet', 'Sandalwood', 'Vetiver', 'Vanilla'],
    volumes        : ['35ml', '75ml', '200ml'],
    longevity      : 9,
    projection     : 8,
    occasion       : ['Evening', 'Formal', 'Wedding'],
    season         : ['All Season'],
    isFeatured     : true,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.9,
    reviewCount    : 512,
    soldCount      : 3200,
    tags           : ['floral', 'classic', 'feminine', 'timeless'],
  },
  {
    name           : 'Tom Ford Oud Wood EDP',
    slug           : 'tom-ford-oud-wood-edp',
    sku            : 'TF-OUD-EDP-50',
    description    : 'Oud Wood is the first fragrance to make rare oud accessible. Tom Ford blends this precious, smoky wood with rosewood and cardamom, then tempers the precious oud wood with subtle smokiness of vetiver and the sensuality of sandalwood.',
    price          : 22000,
    salePrice      : 19500,
    stock          : 20,
    brandKey       : 'tom-ford',
    categoryKey    : 'unisex',
    images         : ['https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Unisex',
    fragranceFamily: 'Woody',
    topNotes       : ['Rosewood', 'Cardamom', 'Chinese Pepper'],
    middleNotes    : ['Oud Wood', 'Sandalwood', 'Vetiver'],
    baseNotes      : ['Tonka Bean', 'Amber', 'Musk'],
    volumes        : ['50ml', '100ml', '250ml'],
    longevity      : 10,
    projection     : 8,
    occasion       : ['Evening', 'Night Out', 'Formal'],
    season         : ['Autumn', 'Winter'],
    isFeatured     : true,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.7,
    reviewCount    : 198,
    soldCount      : 980,
    tags           : ['oud', 'woody', 'luxury', 'niche'],
  },
  {
    name           : 'Creed Aventus EDP',
    slug           : 'creed-aventus-edp',
    sku            : 'CREED-AVN-EDP-100',
    description    : 'Aventus celebrates strength, success, and power in a sophisticated and distinctive fragrance. Inspired by the dramatic life of a historic emperor, this vibrant scent starts with bright top notes of blackcurrant and bergamot.',
    price          : 28000,
    salePrice      : 25500,
    stock          : 15,
    brandKey       : 'creed',
    categoryKey    : 'men',
    images         : ['https://images.unsplash.com/photo-1615397323565-5c1dbcfdb03e?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Men',
    fragranceFamily: 'Fresh',
    topNotes       : ['Blackcurrant', 'Bergamot', 'Apple', 'Pineapple'],
    middleNotes    : ['Birch', 'Rose', 'Jasmine', 'Patchouli'],
    baseNotes      : ['Ambergris', 'Oakmoss', 'Sandalwood', 'Musk', 'Vanilla'],
    volumes        : ['100ml', '250ml'],
    longevity      : 9,
    projection     : 8,
    occasion       : ['Office', 'Formal', 'Evening'],
    season         : ['Spring', 'Summer', 'Autumn'],
    isFeatured     : true,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.9,
    reviewCount    : 445,
    soldCount      : 2100,
    tags           : ['fresh', 'fruity', 'masculine', 'power'],
  },
  {
    name           : 'Armani Acqua di Giò EDP',
    slug           : 'armani-acqua-di-gio-edp',
    sku            : 'ARM-ADG-EDP-110',
    description    : 'Acqua di Giò is a hymn to the Mediterranean, a breath of fresh water on the skin, a fusion of sea notes and natural mineral elements. The EDP version adds depth and sophistication to the classic fresh marine scent.',
    price          : 9800,
    salePrice      : 8499,
    stock          : 60,
    brandKey       : 'armani',
    categoryKey    : 'men',
    images         : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Men',
    fragranceFamily: 'Aquatic',
    topNotes       : ['Bergamot', 'Mandarin', 'Lemon'],
    middleNotes    : ['Sage', 'Rosemary', 'Geranium'],
    baseNotes      : ['Patchouli', 'Cedar', 'Musk'],
    volumes        : ['40ml', '75ml', '110ml'],
    longevity      : 7,
    projection     : 7,
    occasion       : ['Casual', 'Office', 'Outdoor'],
    season         : ['Spring', 'Summer'],
    isFeatured     : false,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.6,
    reviewCount    : 320,
    soldCount      : 2400,
    tags           : ['fresh', 'aquatic', 'marine', 'summer'],
  },
  {
    name           : 'YSL Libre EDP',
    slug           : 'ysl-libre-edp',
    sku            : 'YSL-LIB-EDP-90',
    description    : 'Libre is a fragrance inspired by the freedom of femininity. A harmony between Lavender from Provence, a signature YSL ingredient, and Orange Blossom from Morocco creates a warm, sweet, and powdery floral fragrance.',
    price          : 11500,
    salePrice      : 9999,
    stock          : 35,
    brandKey       : 'ysl',
    categoryKey    : 'women',
    images         : ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Women',
    fragranceFamily: 'Floral',
    topNotes       : ['Lavender', 'Mandarin', 'Petitgrain'],
    middleNotes    : ['Orange Blossom', 'Jasmine'],
    baseNotes      : ['Musk', 'Vanilla', 'Ambergris'],
    volumes        : ['30ml', '50ml', '90ml'],
    longevity      : 8,
    projection     : 7,
    occasion       : ['Casual', 'Date', 'Evening'],
    season         : ['Spring', 'Summer', 'Autumn'],
    isFeatured     : true,
    isBestSeller   : false,
    isNewArrival   : true,
    rating         : 4.5,
    reviewCount    : 187,
    soldCount      : 890,
    tags           : ['floral', 'lavender', 'feminine', 'freedom'],
  },
  {
    name           : 'Maison Margiela Replica — Beach Walk',
    slug           : 'maison-margiela-replica-beach-walk',
    sku            : 'MM-REP-BW-100',
    description    : 'Capturing the memory of a sunny walk on the beach, this Replica fragrance is inspired by sand, sunscreen, and refreshing sea breezes. Fresh coconut milk and white musk evoke the carefree happiness of summer holidays.',
    price          : 14500,
    salePrice      : null,
    stock          : 25,
    brandKey       : 'maison-margiela',
    categoryKey    : 'unisex',
    images         : ['https://images.unsplash.com/photo-1595425970377-c9703bc48b12?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDT',
    gender         : 'Unisex',
    fragranceFamily: 'Fresh',
    topNotes       : ['Bergamot', 'Lemon', 'Pink Pepper'],
    middleNotes    : ['Coconut Milk', 'Iris', 'Jasmine'],
    baseNotes      : ['White Musk', 'Sandalwood', 'Cedarwood'],
    volumes        : ['100ml'],
    longevity      : 6,
    projection     : 6,
    occasion       : ['Casual', 'Outdoor', 'Date'],
    season         : ['Spring', 'Summer'],
    isFeatured     : true,
    isBestSeller   : false,
    isNewArrival   : true,
    rating         : 4.4,
    reviewCount    : 98,
    soldCount      : 450,
    tags           : ['fresh', 'beachy', 'unisex', 'summer'],
  },
  {
    name           : 'Amouage Interlude Man EDP',
    slug           : 'amouage-interlude-man-edp',
    sku            : 'AMO-INT-EDP-100',
    description    : 'Interlude Man opens with a rush of oregano, bergamot, and incense, evolving into a rich floral heart of amber, opoponax, and sandalwood. A story of conflict and resolution expressed in scent.',
    price          : 32000,
    salePrice      : 28999,
    stock          : 10,
    brandKey       : 'amouage',
    categoryKey    : 'niche',
    images         : ['https://images.unsplash.com/photo-1563170351-be54bcbec27a?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDP',
    gender         : 'Men',
    fragranceFamily: 'Oriental',
    topNotes       : ['Oregano', 'Bergamot', 'Incense'],
    middleNotes    : ['Amber', 'Opoponax', 'Cistus'],
    baseNotes      : ['Sandalwood', 'Agarwood', 'Patchouli'],
    volumes        : ['100ml'],
    longevity      : 10,
    projection     : 9,
    occasion       : ['Evening', 'Night Out', 'Formal'],
    season         : ['Autumn', 'Winter'],
    isFeatured     : true,
    isBestSeller   : false,
    isNewArrival   : false,
    rating         : 4.8,
    reviewCount    : 76,
    soldCount      : 280,
    tags           : ['oriental', 'incense', 'oud', 'niche', 'powerful'],
  },
  {
    name           : 'Versace Eros EDT',
    slug           : 'versace-eros-edt',
    sku            : 'VER-ERO-EDT-100',
    description    : 'Versace Eros is the powerfully masculine fragrance — a bold creation inspired by the Greek god of love. A fresh and contrasting composition of cold mint and sweet Italian lemon, with a hint of green apple.',
    price          : 7500,
    salePrice      : 6499,
    stock          : 80,
    brandKey       : 'versace',
    categoryKey    : 'men',
    images         : ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDT',
    gender         : 'Men',
    fragranceFamily: 'Fresh',
    topNotes       : ['Mint', 'Green Apple', 'Lemon'],
    middleNotes    : ['Tonka Bean', 'Ambroxan', 'Geranium'],
    baseNotes      : ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar'],
    volumes        : ['50ml', '100ml', '200ml'],
    longevity      : 7,
    projection     : 8,
    occasion       : ['Casual', 'Date', 'Evening'],
    season         : ['Spring', 'Summer'],
    isFeatured     : false,
    isBestSeller   : true,
    isNewArrival   : false,
    rating         : 4.5,
    reviewCount    : 267,
    soldCount      : 1500,
    tags           : ['fresh', 'mint', 'masculine', 'versatile'],
  },
  {
    name           : 'Jo Malone Peony & Blush Suede Cologne',
    slug           : 'jo-malone-peony-blush-suede',
    sku            : 'JM-PBS-COL-100',
    description    : 'Peony & Blush Suede is a softly feminine, voluptuous floral. Sumptuous peonies are gently kissed with the blush of red apple, rose, and jasmine, with a sensual base of gilded suede.',
    price          : 15500,
    salePrice      : null,
    stock          : 18,
    brandKey       : 'jo-malone',
    categoryKey    : 'women',
    images         : ['https://images.unsplash.com/photo-1588776813677-77adb5595db1?auto=format&fit=crop&q=80&w=600'],
    concentration  : 'EDC',
    gender         : 'Women',
    fragranceFamily: 'Floral',
    topNotes       : ['Red Apple', 'Peony'],
    middleNotes    : ['Rose', 'Jasmine'],
    baseNotes      : ['Suede', 'Gilded Amber'],
    volumes        : ['30ml', '100ml'],
    longevity      : 6,
    projection     : 5,
    occasion       : ['Casual', 'Date', 'Wedding'],
    season         : ['Spring', 'Summer'],
    isFeatured     : false,
    isBestSeller   : false,
    isNewArrival   : true,
    rating         : 4.3,
    reviewCount    : 54,
    soldCount      : 210,
    tags           : ['floral', 'feminine', 'suede', 'soft'],
  },
];

// ── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env.local');

    console.log('🔌 Connecting to MongoDB Atlas…');
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'my-app',
    });
    console.log('✅ Connected!\n');

    // ── Step 1: Clear existing data ──────────────────────────────────────
    console.log('🧹 Clearing existing brands, categories, products…');
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
    console.log('   Cleared.\n');

    // ── Step 2: Insert brands ────────────────────────────────────────────
    console.log('🏷️  Inserting brands…');
    const insertedBrands = await Brand.insertMany(BRANDS);
    const brandMap = {};
    insertedBrands.forEach((b) => { brandMap[b.slug] = b._id; });
    console.log(`   ${insertedBrands.length} brands inserted.`);
    insertedBrands.forEach((b) => console.log(`   • ${b.name}  (${b._id})`));
    console.log();

    // ── Step 3: Insert categories ────────────────────────────────────────
    console.log('📂 Inserting categories…');
    const insertedCats = await Category.insertMany(CATEGORIES);
    const catMap = {};
    insertedCats.forEach((c) => { catMap[c.slug] = c._id; });
    console.log(`   ${insertedCats.length} categories inserted.`);
    insertedCats.forEach((c) => console.log(`   • ${c.name}  (${c._id})`));
    console.log();

    // ── Step 4: Insert products ──────────────────────────────────────────
    console.log('📦 Inserting products…');
    const productsToInsert = PRODUCTS_TEMPLATE.map((p) => {
      const { brandKey, categoryKey, ...rest } = p;
      const brand    = brandMap[brandKey];
      const category = catMap[categoryKey];
      if (!brand)    { console.warn(`   ⚠️  Brand "${brandKey}" not found for product "${p.name}"`); }
      if (!category) { console.warn(`   ⚠️  Category "${categoryKey}" not found for product "${p.name}"`); }
      return { ...rest, brand, category };
    });

    const insertedProds = await Product.insertMany(productsToInsert);
    console.log(`   ${insertedProds.length} products inserted.`);
    insertedProds.forEach((p) => console.log(`   • ${p.name}  (₹${p.price.toLocaleString('en-IN')})`));
    console.log();

    console.log('🎉 Database seeded successfully!');
    console.log('   You can now log into the admin panel and see all brands, categories, and products.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    if (err.errors) {
      Object.entries(err.errors).forEach(([field, e]) => {
        console.error(`   • ${field}: ${e.message}`);
      });
    }
    process.exit(1);
  }
}

seed();
