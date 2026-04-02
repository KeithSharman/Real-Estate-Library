import Link from "next/link";

export default async function TaskSelectionStep({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

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
              General Overview
            </span>
            <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700">
              Step 1 of 4
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Select task to learn
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            Choose which real estate workflow you want to complete and understand the basic steps involved.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex aspect-video items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              Placeholder for embedded YouTube training video
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Instructions</h2>

            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <li>1. Review the different types of real estate workflows available.</li>
              <li>2. Understand the sequence of steps for each workflow type.</li>
              <li>3. Identify which workflow matches your current needs.</li>
              <li>4. Prepare to follow the step-by-step process.</li>
              <li>5. Complete this step when you feel confident in the workflow overview.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/courses/${courseId}/software-select/crm-setup`}
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
