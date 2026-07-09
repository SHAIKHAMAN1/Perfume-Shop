/** PATCH /api/admin/users/[id] — block/unblock, change role */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const { id } = await params;
    const { isBlocked, role } = await request.json();
    const update = {};
    if (typeof isBlocked === "boolean") update.isBlocked = isBlocked;
    if (role && ["customer", "admin", "super_admin"].includes(role)) update.role = role;
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select("name email role isBlocked");
    if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
