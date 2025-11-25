import { Dot, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import {
  getEmojiForLabel,
  getLabelColor,
  extractDominantEmotion,
} from "@/lib/utils/emotionMapping";
import { formatCreatedAt } from "@/lib/utils/notesLib";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";

export default function ListNote({ notes }: { notes: NoteType[] }) {
    const items = notes ?? [];

    return (
      <>
        {items.map((note, index) => {
          const dominant = extractDominantEmotion(note.emotion);
          const emotionLabel = dominant?.label.toLowerCase() ?? "";

          const badgeColor = getLabelColor(emotionLabel);
          const badgeIcon = getEmojiForLabel(emotionLabel);

          // author may be id string or populated object
          const authorObj =
            typeof note.author === "string" || !note.author
              ? undefined
              : (note.author as UserProfileType);

          const authorImage = authorObj?.image || "/default-profile.png";
          const authorUsername = authorObj?.username || "unknown";
          const authorDisplay = authorObj?.displayName || authorUsername || "Unknown Author";

          const likedBy = Array.isArray(note.likedBy)
            ? note.likedBy.map((val) => val?.toString?.() ?? "")
            : [];

          const key =
            typeof note._id === "string"
              ? note._id
              : note._id?.toString?.() ?? `note-skeleton-${index}`;

          return (
            <article
              key={key}
              className=" transition-shadow border border-transparent rounded-xl bg-white/70 backdrop-blur"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image
                    src={authorImage}
                    alt="Author Avatar"
                    width={30}
                    height={30}
                    className="rounded-full mr-3"
                  />
                  <span className="font-medium">
                    <Link href={`/profile/${authorUsername}`}>
                      {authorDisplay}
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
                      backgroundColor: `${badgeColor}20`,
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
                <p className=" text-gray-700 whitespace-pre-wrap mb-2">
                  {note.content}
                </p>
              </Link>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <LikeButton noteId={note._id} likes={note.likes ?? 0} likedBy={likedBy} />
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
        })}
      </>
    );
}