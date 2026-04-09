"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/_utils/firebase";
import { getCourseTemplate, submitQuizAttempt } from "@/_services/course-service";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface CourseTemplate {
  quiz?: {
    passingPercent?: number;
    questions?: QuizQuestion[];
  };
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [template, setTemplate] = useState<CourseTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadQuiz() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const courseTemplate = (await getCourseTemplate(courseId)) as CourseTemplate | null;

        if (!isMounted) {
          return;
        }

        setTemplate(courseTemplate);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load quiz.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [courseId, user]);

  const quizQuestions = template?.quiz?.questions ?? [];
  const passingPercent = template?.quiz?.passingPercent ?? 80;

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quizQuestions.length) {
      return;
    }

    try {
      setSubmitting(true);
      await submitQuizAttempt(courseId, answers);
      router.push(`/courses/${courseId}/results`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Please sign in to take the quiz.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-8">Loading quiz...</div>
      </main>
    );
  }

  if (!template?.quiz?.questions?.length) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-3xl font-semibold tracking-tight">Quiz unavailable</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              This course does not have quiz questions configured yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

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
            A score of {passingPercent}% or higher is required to pass this course. Answer all questions below.
          </p>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </p>
          )}

          <div className="mt-8 space-y-8">
            {quizQuestions.map((question) => (
              <div key={question.id}>
                <p className="font-medium">
                  {question.id}. {question.question}
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  {question.options.map((option, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${question.id}`}
                        value={index}
                        checked={answers[question.id] === index}
                        onChange={() => handleAnswerChange(question.id, index)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizQuestions.length || submitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>

          {Object.keys(answers).length !== quizQuestions.length && (
            <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
              Please answer all questions before submitting.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
