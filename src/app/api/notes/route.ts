import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { analyzeEmotion } from "@/lib/analyzeEmotion";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import User from "@/models/User";

// =======================
// POST: CREATE NOTE
// =======================
export async function POST(request: Request) {
    try {
        const session = await auth();

        // FIX: ensure user.id exists (requires callback in auth.config)
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Not authenticated." },
                { status: 401 }
            );
        }

        const { title, content, isPublic } = await request.json();

        if (!title?.trim()) {
            return NextResponse.json(
                { message: "Title is required." },
                { status: 400 }
            );
        }

        if (!content?.trim()) {
            return NextResponse.json(
                { message: "Note content is required." },
                { status: 400 }
            );
        }

        await dbConnect();

        // FIX: Sanitize HTML → prevent XSS
        const safeTitle = sanitizeHtml(title.trim());
        const safeContent = sanitizeHtml(content.trim());

        // Emotion analysis (safe fail)
        let emotionResult = null;
        try {
            emotionResult = await analyzeEmotion(safeContent);
        } catch (err) {
            console.error("Emotion analysis error:", err);
            emotionResult = null;
        }

        const newNote = new Note({
            author: session.user.id,
            title: safeTitle,
            content: safeContent,
            isPublic: !!isPublic,
            emotion: emotionResult?.raw ?? null,
        });

        await newNote.save();

        return NextResponse.json(
            { message: "Note created successfully!", note: newNote },
            { status: 201 }
        );

    } catch (error) {
        console.error("Failed to create note:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}



// =======================
// GET: FETCH NOTES
// =======================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("author");
    const noteId = searchParams.get("id");

    await dbConnect();
    await User;

    let notes;

    if (authorId) {
      notes = await Note.find({ author: authorId, isPublic: true })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ notes }, { status: 200 });
    }

    if (noteId) {
      if (!mongoose.isValidObjectId(noteId)) {
        return NextResponse.json(
          { message: "Invalid note ID." },
          { status: 400 },
        );
      }

      const note = await Note.findById(noteId)
        .populate("author", "username displayName image")
        .lean();

      if (!note) {
        return NextResponse.json({ message: "Note not found." }, { status: 404 });
      }
    }
    notes = await Note.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json({ notes }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 }
    );
  }
}
