"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listPublishedCourseTemplatesPublic } from '@/lib/services/course-service';

interface CourseTemplate {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
}

// Public catalog with client-side search and category filtering.
export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All courses");

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        // Uses public tenant-scoped read so this page can load before enrollment.
        const templates = await listPublishedCourseTemplatesPublic();

        if (!isMounted) {
          return;
        }

        setCourses(templates as CourseTemplate[]);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load courses.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set(["All courses"]);
    courses.forEach((course) => {
      if (course.category) {
        categorySet.add(course.category);
      }
    });
    return Array.from(categorySet);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    // Filter pipeline: category first, then free-text match across key metadata fields.
    return courses.filter((course) => {
      const inCategory =
        selectedCategory === "All courses" || course.category === selectedCategory;

      if (!inCategory) {
        return false;
      }

      if (!searchValue.trim()) {
        return true;
      }

      const lowerSearch = searchValue.toLowerCase();
      return [course.title, course.description, course.category, course.level]
        .join(" ")
        .toLowerCase()
        .includes(lowerSearch);
    });
  }, [courses, searchValue, selectedCategory]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Home
              </Link>
            </li>
            <li className="text-zinc-400">/</li>
            <li className="text-zinc-900 dark:text-zinc-100 font-medium">
              Course Catalog
            </li>
          </ol>
        </nav>

        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Course catalog
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Browse and enroll in training modules
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Find the right course path for onboarding, compliance, and workflow training.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Back to dashboard
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Business Access
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div>
            <div className="mb-6 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Search courses
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search by course title, category, or keyword"
                    className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      type="button"
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {loading && (
                <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:col-span-2">
                  Loading courses from Firestore...
                </article>
              )}

              {!loading && error && (
                <article className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/20 dark:text-red-200 md:col-span-2">
                  {error}
                </article>
              )}

              {!loading && !error && filteredCourses.length === 0 && (
                <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:col-span-2">
                  No courses matched your search.
                </article>
              )}

              {!loading && !error && filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {course.category}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {course.level}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold tracking-tight">
                    {course.title ?? "Untitled course"}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {course.description ?? "No description provided."}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{course.duration ?? "Self-paced"}</span>
                    <span>Certificate eligible</span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      Start
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      Preview
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Recommended path
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                New employee onboarding
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Start with beginner courses, then move into documents, compliance,
                and workflow-specific modules.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "MLS Listing Essentials",
                  "Client Intake & CRM Setup",
                  "Transaction Document Workflow",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Start from dashboard
              </Link>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white dark:border-zinc-800">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                For businesses
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Turn training into a repeatable system
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Use structured courses to reduce shadowing time, standardize onboarding,
                and keep your team aligned.
              </p>
              <button className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500">
                Request business access
              </button>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}