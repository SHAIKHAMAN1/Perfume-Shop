/**
 * GET  /api/admin/stats  — dashboard KPI figures
 * Requires admin or super_admin role.
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();

    const now        = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLast  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLast    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      newCustomersMonth,
    ] = await Promise.all([
      // Revenue totals
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: startOfLast, $lte: endOfLast } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      // Orders
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ status: { $in: ["pending", "confirmed"] } }),
      // Products
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 10 } }),
      // Users
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "customer", createdAt: { $gte: startOfMonth } }),
    ]);

    // Revenue chart — last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const e = new Date(d); e.setHours(23, 59, 59, 999);
      last7Days.push({ date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), start: d, end: e });
    }
    const revenueChart = await Promise.all(
      last7Days.map(async ({ date, start, end }) => {
        const agg = await Order.aggregate([
          { $match: { paymentStatus: "paid", createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
        ]);
        return { date, revenue: agg[0]?.total ?? 0, orders: agg[0]?.count ?? 0 };
      })
    );

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("orderNumber status paymentStatus total createdAt items user")
      .populate("user", "name email")
      .lean();

    const thisMonthRev = monthRevenue[0]?.total ?? 0;
    const lastMonthRev = lastMonthRevenue[0]?.total ?? 0;
    const revenueGrowth = lastMonthRev > 0
      ? (((thisMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1)
      : 100;

    return NextResponse.json({
      stats: {
        totalRevenue   : totalRevenue[0]?.total ?? 0,
        monthRevenue   : thisMonthRev,
        revenueGrowth  : parseFloat(revenueGrowth),
        totalOrders,
        monthOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        newCustomersMonth,
      },
      revenueChart,
      recentOrders,
    });
  } catch (error) {
    console.error("[admin/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
