"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { getCourseTemplate } from "@/lib/services/course-service";
import { getEnrollmentForCourse } from "@/lib/services/enrollment-service";

interface SoftwareOption {
  id: string;
  name: string;
}

interface CourseStep {
  id: string;
  title: string;
  description: string;
  softwareOptions?: SoftwareOption[];
}

interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  steps?: CourseStep[];
}

interface EnrollmentState {
  id: string;
  progressPercent: number;
  stepProgress?: Record<string, { selectedSoftwareId?: string }>;
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [user] = useAuthState(auth);
  const [course, setCourse] = useState<CourseTemplate | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCourse() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const template = await getCourseTemplate(courseId);

        if (!template) {
          if (isMounted) {
            setCourse(null);
          }
          return;
        }

        const progress = await getEnrollmentForCourse(courseId, {
          createIfMissing: true,
        });

        if (!isMounted) {
          return;
        }

        setCourse(template as unknown as CourseTemplate);
        setEnrollment(progress as EnrollmentState | null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load course.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId, user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Course content is now loaded from Firestore and requires authentication.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-8">Loading course...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-8 text-red-600">{error}</div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/courses"
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Back to course catalog
          </Link>
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-3xl font-semibold tracking-tight">Course not found</h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              This course is not available for your tenant or is not published.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const progress = enrollment?.progressPercent ?? 0;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
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
            <li className="text-zinc-900 dark:text-zinc-100 font-medium">
              {course.title}
            </li>
          </ol>
        </nav>

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/courses"
              className="text-sm text-emerald-600 hover:underline"
            >
              ← Back to course catalog
            </Link>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              {course.title}
            </h1>

            <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
              {course.description}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Course progress
            </p>
            <p className="mt-2 text-3xl font-semibold">{progress}%</p>
            <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Course workflow
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Complete each step in order, then finish with the final quiz.
            </p>
          </div>

          <div className="space-y-4">
            {(course.steps ?? []).map((step, index) => {
              const selectedSoftwareId = enrollment?.stepProgress?.[step.id]?.selectedSoftwareId;
              const selectedSoftware = (step.softwareOptions ?? []).find(
                (option) => option.id === selectedSoftwareId
              );

              return (
              <div
                key={step.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                    {index + 1}
                    </div>

                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-600">
                      Software: {selectedSoftware?.name ?? "Choose on next screen"}
                    </p>
                  </div>
                </div>

                <Link
                href={`/courses/${courseId}/software-select/${step.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Open step
                </Link>
              </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <Link
              href={`/courses/${courseId}/quiz`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Take final quiz
            </Link>
          </div>
          </section>
          </div>
          </main>
  );
}
