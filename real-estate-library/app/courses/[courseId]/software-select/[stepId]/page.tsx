"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getCourseTemplate } from "@/lib/services/course-service";
import { saveSelectedSoftwareForStep } from "@/lib/services/enrollment-service";

interface SoftwareOption {
  id: string;
  name: string;
  description: string;
  category: string;
  isRecommended?: boolean;
  features?: string[];
}

interface TemplateStep {
  id: string;
  softwareOptions?: SoftwareOption[];
}

interface CourseTemplate {
  steps?: TemplateStep[];
}

export default function SoftwareSelectPage({
  params,
}: {
  params: Promise<{ courseId: string; stepId: string }>;
}) {
  const { courseId, stepId } = use(params);
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<TemplateStep | null>(null);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadStep() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const template = (await getCourseTemplate(courseId)) as CourseTemplate | null;
        const templateStep = template?.steps?.find((item) => item.id === stepId);

        if (!isMounted) {
          return;
        }

        setStep(templateStep ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load software options.");
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
  }, [authLoading, courseId, stepId, user]);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const softwareOptions = step?.softwareOptions ?? [];

  async function handleStart(softwareId: string) {
    try {
      setSavingId(softwareId);
      await saveSelectedSoftwareForStep(courseId, stepId, softwareId);
      router.push(`/courses/${courseId}/${stepId}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save software selection.");
    } finally {
      setSavingId("");
    }
  }

  if (!hasMounted || authLoading || loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-8">Loading software options...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Please sign in to continue this course step.
            </p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500">
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!step || softwareOptions.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-red-600">Step not found</p>
            <Link href={`/courses/${courseId}`} className="mt-4 text-emerald-600 hover:underline">
              Back to course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Home
              </Link>
            </li>
            <li className="text-zinc-400">/</li>
            <li>
              <Link href="/courses" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Courses
              </Link>
            </li>
            <li className="text-zinc-400">/</li>
            <li>
              <Link href={`/courses/${courseId}`} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Course Overview
              </Link>
            </li>
            <li className="text-zinc-400">/</li>
            <li className="text-zinc-900 dark:text-zinc-100 font-medium">
              Software Selection
            </li>
          </ol>
        </nav>

        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to course overview
        </Link>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight">
            Select your software
          </h1>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </p>
          )}

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Choose the software platform you&apos;ll be using for this step. Select the one your brokerage uses or try a recommended option.
          </p>

          <div className="mt-8 space-y-4">
            {softwareOptions.map((software) => (
              <div
                key={software.id}
                className={`rounded-2xl border p-6 transition ${
                  software.isRecommended
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">{software.name}</h2>
                      {software.isRecommended && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          Recommended
                        </span>
                      )}
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {software.category}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {software.description}
                    </p>
                    {software.features && (
                      <div className="flex flex-wrap gap-2">
                        {software.features.map((feature, index) => (
                          <span
                            key={index}
                            className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStart(software.id)}
                    disabled={Boolean(savingId)}
                    className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition whitespace-nowrap ${
                      software.isRecommended
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-zinc-600 hover:bg-zinc-500'
                    }`}
                  >
                    {savingId === software.id ? "Saving..." : `Start with ${software.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Don&apos;t see your software?</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              The concepts taught in this course apply to most real estate software platforms. Choose the recommended option to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
