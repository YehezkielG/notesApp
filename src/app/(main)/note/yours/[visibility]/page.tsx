"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dot, Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import {
  getEmojiForLabel,
  getLabelColor,
  extractDominantEmotion,
} from "@/lib/utils/emotionMapping";
import { formatCreatedAt } from "@/lib/utils/notesLib";

export default function PublicNotesPage() {
  const params = useParams();
  const { data: session } = useSession();

  const user = session?.user;
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/notes/yours/${params.visibility}`);
        const data = await response.json();
        setNotes(data.notes ?? []);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [params.visibility]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <span
            className="inline-block h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
            aria-label="Loading"
          />
        </div>
      ) : (
        notes.map((note) => {
          const dominant = extractDominantEmotion(note.emotion);
          const emotionLabel = dominant?.label.toLowerCase() ?? "";

          const badgeColor = getLabelColor(emotionLabel);
          const badgeIcon = getEmojiForLabel(emotionLabel);
          return (
            <article
              key={note._id}
              className="p-4 hover:shadow-sm transition-shadow border border-transparent rounded-xl bg-white/70 backdrop-blur"
            >
              <div className="flex justify-between items-center">
                <div className="flex  items-center">
                  <Image
                  src={user?.image || "/default-profile.png"}
                  alt="Author Avatar"
                  width={30}
                  height={30}
                  className="rounded-full mr-3"
                />
                <span className="font-medium">
                  <Link href={`/profile/${user?.username}`}>
                    {user?.displayName || "Unknown Author"}
                  </Link>
                </span>
                <Dot className="mx-2 text-gray-400" size={8} />
                <span className="text-xs text-gray-500">
                  {formatCreatedAt(note.createdAt)}
                </span>
                </div>
                {dominant && (
                  <span
                  className="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-gray-700 font-medium bg-gray-700/15"
                  style={{
                    backgroundColor: `${badgeColor}26`,
                  }}
                  >
                  <span>{badgeIcon}</span>
                  <span className="capitalize ">{dominant.label}</span>
                  <span className="opacity-80">
                    {(dominant.score * 100).toFixed(0)}%
                  </span>
                  </span>
                )}
              </div>
              <Link href={`/note/${note._id}`}>
                <h3 className="font-semibold mb-1 mt-2">
                  {note.title || "(Untitled note)"}
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                  {note.content}
                </p>
              </Link>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <button className="inline-flex items-center gap-1 hover:text-gray-700">
                  <Heart size={16} />
                  <span>{note.likes ?? 0}</span>
                </button>
                <button className="inline-flex items-center gap-1 hover:text-gray-700">
                  <MessageCircle size={16} />
                  <span>0</span>
                </button>
                <button className="inline-flex items-center gap-1 hover:text-gray-700">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </article>
          );
        })
      )}
    </>
  );
}
