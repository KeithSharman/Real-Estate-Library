"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/_utils/firebase";
import {
  completeStepAndAdvance,
  getCourseTemplate,
  getEnrollmentForCourse,
} from "@/_services/course-service";

interface SoftwareOption {
  id: string;
  name: string;
}

interface TemplateStep {
  id: string;
  order: number;
  title: string;
  description: string;
  videoUrl?: string;
  instructions?: string[];
  softwareOptions?: SoftwareOption[];
}

interface CourseTemplate {
  steps?: TemplateStep[];
}

interface EnrollmentState {
  stepProgress?: Record<string, { selectedSoftwareId?: string }>;
}

export default function CourseStepPage({
  params,
}: {
  params: Promise<{ courseId: string; stepId: string }>;
}) {
  const { courseId, stepId } = use(params);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState<CourseTemplate | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStep() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [courseTemplate, enrollmentState] = await Promise.all([
          getCourseTemplate(courseId),
          getEnrollmentForCourse(courseId, { createIfMissing: true }),
        ]);

        if (!isMounted) {
          return;
        }

        setTemplate(courseTemplate as CourseTemplate | null);
        setEnrollment(enrollmentState as EnrollmentState | null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load step content.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStep();

    return () => {
      isMounted = false;
    };
  }, [courseId, user]);

  const steps = useMemo(() => template?.steps ?? [], [template]);
  const currentStepIndex = steps.findIndex((item) => item.id === stepId);
  const step = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const instructions = step?.instructions ?? [];
  const isLastStep = currentStepIndex === steps.length - 1;
  const nextStepId = !isLastStep && currentStepIndex >= 0 ? steps[currentStepIndex + 1].id : null;
  const prevStepId = currentStepIndex > 0 ? steps[currentStepIndex - 1].id : null;

  async function handleCompleteAndContinue() {
    if (!step) {
      return;
    }

    try {
      setSubmitting(true);
      const result = await completeStepAndAdvance(courseId, step.id);

      if (result.nextStepId) {
        router.push(`/courses/${courseId}/software-select/${result.nextStepId}`);
        return;
      }

      router.push(`/courses/${courseId}/quiz`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save step progress.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-red-600">Please sign in to continue.</p>
          <Link href="/" className="mt-4 text-emerald-600 hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-8">Loading step content...</div>
      </main>
    );
  }

  if (!step) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-red-600">Step not found</p>
          <Link href={`/courses/${courseId}`} className="mt-4 text-emerald-600 hover:underline">
            Back to course
          </Link>
        </div>
      </main>
    );
  }

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
              {(step.softwareOptions ?? []).find(
                (option) => option.id === enrollment?.stepProgress?.[step.id]?.selectedSoftwareId
              )?.name ?? "Select software"}
            </span>
            <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700">
              Step {step.order} of {steps.length}
            </span>
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </p>
          )}

          <h1 className="text-4xl font-semibold tracking-tight">
            {step.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            {step.description}
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex aspect-video items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              {step.videoUrl ? (
                <a href={step.videoUrl} target="_blank" rel="noreferrer" className="underline">
                  Open training video
                </a>
              ) : (
                "No video configured for this step"
              )}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Instructions</h2>

            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              {instructions.length > 0 ? (
                instructions.map((instruction, index) => (
                  <li key={instruction}>{index + 1}. {instruction}</li>
                ))
              ) : (
                <li>1. Review the content and complete this step when ready.</li>
              )}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {prevStepId && (
              <Link
                href={`/courses/${courseId}/software-select/${prevStepId}`}
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Previous step
              </Link>
            )}

            <button
              type="button"
              onClick={handleCompleteAndContinue}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : nextStepId
                  ? "Complete step and continue"
                  : "Complete course and continue to quiz"}
            </button>
            </div>
        </div>
      </div>
    </main>
  );
}