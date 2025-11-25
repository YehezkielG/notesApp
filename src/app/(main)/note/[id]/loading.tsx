export default function NoteDetailLoading() {
  return (
    <section className="space-y-6">
      <article className="animate-pulse rounded-xl border border-transparent bg-white/70 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 w-1/3 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-1/4 rounded bg-gray-200 mb-3" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-12 rounded bg-gray-200" />
              <div className="h-3 w-8 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200 ml-auto" />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-full rounded bg-gray-200" />
          <div className="h-5 w-11/12 rounded bg-gray-200" />
          <div className="h-5 w-9/12 rounded bg-gray-200" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-5 w-20 rounded-full bg-gray-200" />
          <div className="h-5 w-16 rounded-full bg-gray-200" />
          <div className="h-5 w-20 rounded-full bg-gray-200" />
        </div>

        <div className="mt-5 flex gap-3 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 px-3 rounded-full bg-gray-200 w-28" />
          ))}
        </div>
      </article>
    </section>
  );
}
