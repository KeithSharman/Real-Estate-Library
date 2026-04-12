import Link from "next/link";
import YouTubeEmbed from "@/app/components/youtube-embed";

export default async function ListingEntryStep({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const placeholderVideoUrl = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to course overview
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              MLS Platform
            </span>
            <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700">
              Step 3 of 4
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Create Property Listing
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            Learn how to enter listing details into the MLS system, upload property photos, and verify that all required fields are completed correctly.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="aspect-video">
              <YouTubeEmbed
                videoUrl={placeholderVideoUrl}
                title="Create property listing training video"
              />
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Instructions</h2>

            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <li>1. Open the MLS platform and create a new listing draft.</li>
              <li>2. Enter the property address, type, and price.</li>
              <li>3. Upload all required property images.</li>
              <li>4. Verify square footage, room counts, and legal details.</li>
              <li>5. Save the listing and send it for internal review.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/courses/${courseId}/software-select/crm-setup`}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Previous step
            </Link>

            <Link
              href={`/courses/${courseId}/software-select/document-submission`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Next step
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
