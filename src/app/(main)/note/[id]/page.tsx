import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import { MessageCircle, Share2, Lock, Globe } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { auth } from "@/auth";
import User from "@/models/User";
import Response from "./Response";
import { getEmojiForLabel, getLabelColor } from "@/lib/utils/emotionMapping";
import LikeButton from "@/components/LikeButton";
import { formatCreatedAt } from "@/lib/utils/notesLib";

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }

  await dbConnect();
  await User;

  const note = (await Note.findById(id)
    .populate("author", "username displayName image")
    .lean()) as NoteType | null;

  if (!note) {
    notFound();
  }

  if (!note.isPublic) {
    const session = await auth();
    const requesterId =
      session?.user?.id ??
      (session?.user as Record<string, any> | undefined)?._id?.toString?.() ??
      null;

    const rawAuthor = note.author as UserProfileType | string | undefined;
    const noteAuthorId =
      typeof rawAuthor === "object" && rawAuthor !== null
        ? rawAuthor._id?.toString?.() ?? ""
        : rawAuthor?.toString?.() ?? "";

    if (!requesterId || requesterId !== noteAuthorId) {
      return (
        <div className="flex h-[300px] items-center justify-center gap-2 text-sm text-gray-600">
          <Lock size={18} />
          <span>This note is private.</span>
        </div>
      );
    }
  }

  const authorObj = note.author as UserProfileType | undefined;
  const author = authorObj
    ? {
        username: authorObj.username ?? "unknown",
        displayName: authorObj.displayName ?? authorObj.username ?? "Unknown",
        image: authorObj.image ?? "/default-profile.png",
      }
    : {
        username: "unknown",
        displayName: "Unknown Author",
        image: "/default-profile.png",
      };

  const likedBy = Array.isArray(note.likedBy)
    ? note.likedBy.map((val) => val?.toString?.() ?? "")
    : [];
  const likes = note.likes ?? 0;

  return (
    <>
      <article className="rounded-xl border border-transparent bg-white/70 backdrop-blur transition-shadow">
        <div className="relative flex items-center">
          <Image
            src={author.image}
            alt="Author Avatar"
            width={50}
            height={50}
            className="mr-3 rounded-full"
          />
          <div className="font-medium">
            <Link href={`/profile/${author.username}`}>
              {author.displayName}
            </Link>
            <p className="text-sm text-gray-500">@{author.username}</p>
          </div>
          <div className="absolute right-0 top-0 text-gray-500">
            {note.isPublic ? <Globe size={20} /> : <Lock size={20} />}
          </div>
        </div>

        <span className="mt-5 block text-xs text-gray-500">{formatCreatedAt(note.createdAt)} ago</span>

        <h3 className="mt-2 font-semibold">
          {note.title?.trim() || "(Untitled note)"}
        </h3>
        <p className="mt-2 whitespace-pre-wrap text-gray-700">
          {note.content}
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <LikeButton
            noteId={note._id?.toString?.() ?? ""}
            likes={likes}
            likedBy={likedBy}
          />
          <button className="inline-flex items-center gap-1 hover:text-gray-700">
            <MessageCircle size={16} />
            <span>0</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-gray-700">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>

        <div className="flex flex-wrap mt-5 gap-3">
          {Array.isArray(note.emotion) && note.emotion.length > 0 ? (
            note.emotion.map((item: { label: string; score: number }) => {
              const bgColor = getLabelColor(item.label) ?? "#f3f4f6";
              return (
                <div
                  key={item.label}
                  className="group py-1 px-2 rounded-2xl"
                  style={{
                    backgroundColor: bgColor + "20",
                    border: `1px solid ${bgColor}33`,
                  }}
                >
                  <div className="flex justify-between items-center text-sm mb-1 text-gray-700">
                    <span className="flex items-center mr-2 gap-2 font-medium capitalize">
                      <span>{getEmojiForLabel(item.label)}</span> {item.label}
                    </span>
                    <span className="font-mono text-xs flex items-center text-gray-500">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-3 mt-4 w-full">No emotions detected.</div>
          )}
        </div>
      </article>
      <Response />
    </>
  );
}
