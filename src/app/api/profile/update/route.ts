import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { displayName, bio, image } = body ?? {};

    if (!displayName && !bio && !image) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    await dbConnect();

    const update: Record<string, unknown> = {};
    if (typeof displayName === "string") update.displayName = displayName;
    if (typeof bio === "string") update.bio = bio;
    if (typeof image === "string") update.image = image;

    const userDoc = await User.findByIdAndUpdate(
      session.user.id,
      { $set: update },
      { new: true, projection: { username: 1, displayName: 1, bio: 1, image: 1 } },
    ).lean();

    if (!userDoc) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user: userDoc }, { status: 200 });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
