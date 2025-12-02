import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/utils/adminAuth";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.authorized) {
    return adminCheck.response;
  }

  try {
    const params = await Promise.resolve(context.params);
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Note ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    await Note.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
