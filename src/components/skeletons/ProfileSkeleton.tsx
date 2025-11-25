import NoteCardSkeleton from "@/components/skeletons/NoteCardSkeleton";

type ProfileSkeletonProps = {
  noteCount?: number;
};

export default function ProfileSkeleton({ noteCount = 3 }: ProfileSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-transparent bg-white/70 backdrop-blur animate-pulse">
        <div className="h-24 w-24 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-full bg-gray-200" />
          <div className="h-3 w-24 rounded-full bg-gray-200" />
          <div className="flex gap-4 text-xs text-gray-400">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-3 w-16 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
        <div className="ml-auto h-8 w-28 rounded-full bg-gray-200" />
      </div>
        <hr className="my-10 border-gray-600"/>
      <NoteCardSkeleton count={noteCount} />
    </div>
  );
}
