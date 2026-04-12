import Link from "next/link";
import YouTubeEmbed from "@/app/components/youtube-embed";

export default async function CrmSetupStep({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const placeholderVideoUrl = "https://www.youtube.com/watch?v=ysz5S6PUM-U";

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
              Salesforce CRM
            </span>
            <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700">
              Step 2 of 4
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Client Intake in CRM
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            Learn how to add a client and prepare their information for follow-up and transaction management.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="aspect-video">
              <YouTubeEmbed
                videoUrl={placeholderVideoUrl}
                title="Client intake in CRM training video"
              />
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Instructions</h2>

            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <li>1. Open the CRM system and navigate to the client intake section.</li>
              <li>2. Create a new client record with basic contact information.</li>
              <li>3. Add property preferences and requirements to the client profile.</li>
              <li>4. Set up communication preferences and follow-up reminders.</li>
              <li>5. Save the client record and prepare for the next workflow step.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/courses/${courseId}/software-select/task-selection`}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Previous step
            </Link>

            <Link
              href={`/courses/${courseId}/software-select/listing-entry`}
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
