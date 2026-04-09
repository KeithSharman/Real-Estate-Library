"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/_utils/firebase";
import {
  listPublishedCourseTemplates,
  listUserEnrollmentsWithTemplates,
} from "@/_services/course-service";
import type {ReactNode} from "react";

interface PublishedCourse {
  id: string;
  title?: string;
}

interface EnrollmentRow {
  id: string;
  courseId: string;
  status?: string;
  updatedAt?: unknown;
  completedAt?: unknown;
  progressPercent?: number;
  quiz?: { score?: number | null };
  course?: {
    title?: string;
    description?: string;
  };
}

function formatTimestamp(timestampValue: unknown) {
  if (!timestampValue) {
    return "-";
  }

  if (
    typeof timestampValue === "object" &&
    timestampValue !== null &&
    "toDate" in timestampValue &&
    typeof timestampValue.toDate === "function"
  ) {
    const tsDate = timestampValue.toDate();
    return tsDate.toLocaleDateString();
  }

  if (
    typeof timestampValue === "string" ||
    typeof timestampValue === "number" ||
    timestampValue instanceof Date
  ) {
    return new Date(timestampValue).toLocaleDateString();
  }

  return "-";
}

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [enrollmentData, publishedTemplates] = await Promise.all([
          listUserEnrollmentsWithTemplates(),
          listPublishedCourseTemplates(),
        ]);

        if (!isMounted) {
          return;
        }

        setEnrollments((enrollmentData.filter(Boolean) as EnrollmentRow[]) ?? []);
        setPublishedCourses((publishedTemplates as PublishedCourse[]) ?? []);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const inProgressCourses = useMemo(
    () => enrollments.filter((item) => item.status === "in_progress"),
    [enrollments]
  );

  const completedCourses = useMemo(
    () => enrollments.filter((item) => item.status === "completed"),
    [enrollments]
  );

  const recommendedCourses = useMemo(() => {
    const enrolledIds = new Set(enrollments.map((item) => item.courseId));
    return publishedCourses
      .filter((course) => !enrolledIds.has(course.id))
      .slice(0, 3)
      .map((course) => ({
        id: course.id,
        title: course.title,
      }));
  }, [enrollments, publishedCourses]);

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Dashboard data now uses Firestore enrollments and requires authentication.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Personal dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back, {user.displayName ?? "Student"}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Continue your current courses, review grades, and start a new learning path.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
           <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
                Back to home
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Business Access
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Browse and enroll in courses
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              View course catalog
            </Link>
            <Link
              href="/admin/courses"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Admin tools
            </Link>
          </div>
        </header>

        {loading && (
          <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            Loading dashboard from Firestore...
          </section>
        )}

        {!loading && error && (
          <section className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
            {error}
          </section>
        )}

        <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="In progress" value={`${inProgressCourses.length}`} note="Courses currently active" />
          <StatCard title="Completed" value={`${completedCourses.length}`} note="Courses finished" />
          <StatCard title="Published" value={`${publishedCourses.length}`} note="Templates available" />
          <StatCard title="Learning streak" value="-" note="Coming soon" />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <CardSection title="In progress courses" subtitle="Pick up where you left off">
              <div className="space-y-4">
                {inProgressCourses.length === 0 && (
                  <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      No in-progress courses. Start one from the catalog.
                    </p>
                  </article>
                )}

                {inProgressCourses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{course.course?.title ?? course.courseId}</h3>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {course.course?.description ?? "Continue where you left off."}
                        </p>
                        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
                          Last updated: {formatTimestamp(course.updatedAt)}
                        </p>
                      </div>

                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex h-fit items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        Continue
                      </Link>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                        <span>Progress</span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                      Next lesson: <span className="font-medium text-zinc-950 dark:text-zinc-50">Continue from your current step</span>
                    </p>
                  </article>
                ))}
              </div>
            </CardSection>

            <CardSection title="Completed courses and grades" subtitle="Track your finished work">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {completedCourses.length === 0 && (
                  <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:col-span-2 xl:col-span-3">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      No completed courses yet.
                    </p>
                  </article>
                )}

                {completedCourses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{course.course?.title ?? course.courseId}</h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          Completed on {formatTimestamp(course.completedAt)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-zinc-950 px-3 py-2 text-lg font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                        {course.quiz?.score ? `${course.quiz.score}%` : "Pass"}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Certificate
                      </span>
                      <span
                        className="font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        Available
                      </span>
                    </div>

                    <button className="mt-4 w-full rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                      View certificate
                    </button>
                  </article>
                ))}
              </div>
            </CardSection>
          </div>

          <aside className="space-y-8">
            <CardSection title="Profile" subtitle="Your account summary">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-semibold text-white">
                  {(user.displayName ?? user.email ?? "U").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.displayName ?? "Student account"}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Student account
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid gap-4 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-zinc-600 dark:text-zinc-400">Role</dt>
                  <dd className="text-sm font-medium">Student</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-zinc-600 dark:text-zinc-400">Department</dt>
                  <dd className="text-sm font-medium">Onboarding</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-zinc-600 dark:text-zinc-400">Member since</dt>
                  <dd className="text-sm font-medium">May 2026</dd>
                </div>
              </dl>
            </CardSection>

            <CardSection title="Recommended next steps" subtitle="Good courses to enroll in next">
              <div className="space-y-3">
                {recommendedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-2xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <p className="font-medium">{course.title}</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/courses"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Enroll in a new course
              </Link>
            </CardSection>

            <CardSection title="Upcoming tasks" subtitle="What to do next">
              <div className="space-y-3 text-sm">
                <TaskItem title="Continue your active enrollment" detail="Pick up at your current step" />
                <TaskItem title="Complete all course steps" detail="Quiz unlocks when you are ready" />
                <TaskItem title="Pass the final quiz" detail="Score 80% or higher" />
              </div>
            </CardSection>
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{note}</p>
    </div>
  );
}

function CardSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function TaskItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-zinc-500 dark:text-zinc-400">{detail}</p>
    </div>
  );
}