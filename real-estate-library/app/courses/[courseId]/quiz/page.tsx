import Link from "next/link";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to course overview
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-4xl font-semibold tracking-tight">Final Quiz</h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            A score of 80% or higher is required to pass this course.
          </p>

          <div className="mt-8 space-y-8">
            <div>
              <p className="font-medium">
                1. Which software is used to publish a property listing?
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="q1" /> CRM Platform
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="q1" /> MLS Platform
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="q1" /> Accounting Software
                </label>
              </div>
            </div>

            <div>
              <p className="font-medium">
                2. What should you do before submitting documents?
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="q2" /> Skip the review step
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="q2" /> Verify signatures and required fields
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="q2" /> Send incomplete forms
                </label>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href={`/courses/${courseId}/results`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Submit quiz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
