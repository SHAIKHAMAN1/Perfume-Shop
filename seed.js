import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, brand: mongoose.Schema.Types.ObjectId, category: mongoose.Schema.Types.ObjectId,
  description: String, price: Number, stock: Number, images: [String], concentration: String, gender: String, isActive: Boolean
});
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const brands = [
  { name: "Dior", slug: "dior" },
  { name: "Chanel", slug: "chanel" },
  { name: "Tom Ford", slug: "tom-ford" }
];

const categories = [
  { name: "Signature", slug: "signature" },
  { name: "Exclusive", slug: "exclusive" },
  { name: "Everyday", slug: "everyday" }
];

const products = [
  { name: "Dior Sauvage", slug: "dior-sauvage", description: "A fresh and spicy fragrance for men.", price: 9500, stock: 50, images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=500"], concentration: "EDP", gender: "Men", isActive: true },
  { name: "Chanel No 5", slug: "chanel-no-5", description: "The classic floral aldehyde fragrance.", price: 12500, stock: 30, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500"], concentration: "Parfum", gender: "Women", isActive: true },
  { name: "Tom Ford Oud Wood", slug: "tom-ford-oud-wood", description: "Rare, exotic, and distinctive woody scent.", price: 18000, stock: 20, images: ["https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?auto=format&fit=crop&q=80&w=500"], concentration: "EDP", gender: "Unisex", isActive: true },
  { name: "Dior Homme Intense", slug: "dior-homme-intense", description: "A sophisticated iris and woody composition.", price: 10500, stock: 40, images: ["https://images.unsplash.com/photo-1615397323565-5c1dbcfdb03e?auto=format&fit=crop&q=80&w=500"], concentration: "EDP", gender: "Men", isActive: true },
  { name: "Bleu de Chanel", slug: "bleu-de-chanel", description: "A woody aromatic fragrance for the modern man.", price: 11000, stock: 45, images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500"], concentration: "EDP", gender: "Men", isActive: true },
  { name: "Tom Ford Black Orchid", slug: "tom-ford-black-orchid", description: "A luxurious and sensual fragrance.", price: 13500, stock: 25, images: ["https://images.unsplash.com/photo-1595425970377-c9703bc48b12?auto=format&fit=crop&q=80&w=500"], concentration: "EDP", gender: "Unisex", isActive: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    await Brand.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const insertedBrands = await Brand.insertMany(brands);
    const insertedCategories = await Category.insertMany(categories);

    const bMap = insertedBrands.reduce((acc, b) => { acc[b.name] = b._id; return acc; }, {});
    const cMap = insertedCategories.reduce((acc, c) => { acc[c.slug] = c._id; return acc; }, {});

    for (const p of products) {
      if (p.name.includes("Dior")) { p.brand = bMap["Dior"]; p.category = cMap["signature"]; }
      else if (p.name.includes("Chanel")) { p.brand = bMap["Chanel"]; p.category = cMap["exclusive"]; }
      else if (p.name.includes("Tom Ford")) { p.brand = bMap["Tom Ford"]; p.category = cMap["exclusive"]; }
    }

    await Product.insertMany(products);
    console.log("Successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
