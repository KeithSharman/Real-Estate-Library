import Link from "next/link";

const passed = true;
const score = 85;

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold ${
              passed
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {score}%
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            {passed ? "Course Passed" : "Course Not Passed"}
          </h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {passed
              ? "You passed the course and can now return to your dashboard."
              : "A minimum score of 80% is required. Review the lessons and try again."}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Return to dashboard
            </Link>

            {!passed && (
              <Link
                href={`/courses/${courseId}/quiz`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Retry quiz
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
