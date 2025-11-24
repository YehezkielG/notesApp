"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type ProfileStats = { followers: number; following: number; publicNotes: number };

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const username = params.username as string;
  console.log("Username from params:", username);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    followers: 0,
    following: 0,
    publicNotes: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followPending, setFollowPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userRes = await fetch(`/api/profile/${username}`);
        if (!userRes.ok) {
          throw new Error("User not found");
        }
        const userData = await userRes.json();
        setUser(userData.user);
        setStats(
          userData.stats ?? { followers: 0, following: 0, publicNotes: 0 },
        );
        setIsFollowing(userData.isFollowing ?? false);
        setIsOwnProfile(userData.isOwnProfile ?? false);

        // Fetch user's public notes
        const notesRes = await fetch(
          `/api/notes?scope=public&author=${userData.user._id}`,
        );
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          setNotes(notesData.notes ?? []);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadProfile();
    }
  }, [username]);

  const handleFollowToggle = async () => {
    if (!session?.user?.id) {
      router.push("/auth");
      return;
    }
    try {
      setFollowPending(true);
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/profile/${username}/follow`, { method });
      if (!res.ok) {
        if (res.status === 401) router.push("/auth");
        return;
      }
      console.log("Follow toggle response:", await res);
      const data = await res.json();
      setIsFollowing(data.isFollowing ?? false);
      if (data.stats) setStats(data.stats);
    } finally {
      setFollowPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm text-gray-500">Loading profile...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center pt-5 pb-3">
        <Image
          src={user.image || "/default-profile.png"}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-gray-600">@{user.username}</p>
          <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
            <span>
              <strong>{stats.followers}</strong> Followers
            </span>
            <span>
              <strong>{stats.following}</strong> Following
            </span>
            <span>
              <strong>{stats.publicNotes}</strong> Notes
            </span>
          </div>
        </div>
        {!isOwnProfile && session ? (
          <button
            onClick={handleFollowToggle}
            disabled={followPending}
            className="ml-auto rounded-full border border-black px-4 py-1.5 text-sm font-medium text-black hover:bg-black hover:text-white disabled:opacity-50 cursor-pointer"
          >
            {followPending
              ? "..."
              : isFollowing
              ? "Following"
              : "Follow"}
          </button>
        ) : (<button
            onClick={() => router.push("/auth")}
            className="ml-auto rounded-full border border-black px-4 py-1.5 text-sm font-medium text-black hover:bg-black hover:text-white"
          >
            Edit Profile
          </button>) }
      </div>
      {user.bio && (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{user.bio}</p>
      )}
      <hr />
      {/* Notes Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Public Notes ({notes.length})
        </h2>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No public notes yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <article
                key={note._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-semibold mb-1 line-clamp-2">
                  {note.title || "(Untitled note)"}
                </h3>
                <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap mb-2">
                  {note.content}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}