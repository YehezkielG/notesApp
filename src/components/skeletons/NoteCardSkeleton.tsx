type NoteCardSkeletonProps = {
  count?: number;
};

export default function NoteCardSkeleton({ count = 1 }: NoteCardSkeletonProps) {
  return (
    <div className="space-y-10">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="animate-pulse rounded-xl border border-transparent bg-white/70 backdrop-blur"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-2.5 w-24 rounded-full bg-gray-200" />
                <div className="h-2 w-16 rounded-full bg-gray-200" />
              </div>
            </div>
            <div className="h-5 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-gray-200" />
            <div className="h-3 w-2/3 rounded-full bg-gray-200" />
            <div className="h-3 w-1/3 rounded-full bg-gray-200" />
          </div>
          <div className="mt-4 flex gap-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-3 w-12 rounded-full bg-gray-200" />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
