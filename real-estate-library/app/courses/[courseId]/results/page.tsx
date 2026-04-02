"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";

interface QuizResult {
  score: number;
  passed: boolean;
  answers: Record<number, number>;
  timestamp: number;
  autoPassed?: boolean;
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResult = localStorage.getItem(`quiz_${courseId}`);
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error("Error parsing quiz results:", error);
      }
    }
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p>Loading results...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">No Quiz Results Found</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Please complete the quiz first.
            </p>
            <div className="mt-6">
              <Link
                href={`/courses/${courseId}/quiz`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { score, passed, autoPassed } = result;
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
            {passed ? "Course Passed!" : "Course Not Passed"}
          </h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {passed
              ? autoPassed
                ? "Demo course auto-passed successfully!"
                : "Congratulations! You passed the course and can now return to your dashboard."
              : "A minimum score of 80% is required. Review the lessons and try again."}
          </p>

          {autoPassed && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This demo course was auto-passed for demonstration purposes.
              </p>
            </div>
          )}

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

            {passed && (
              <Link
                href={`/courses/${courseId}`}
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Review course
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
