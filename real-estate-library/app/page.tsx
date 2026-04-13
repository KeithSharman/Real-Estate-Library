'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, provider } from '../_utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { listPublishedCourseTemplates } from '../_services/course-service';

function HomeContent() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    listPublishedCourseTemplates()
      .then((templates) => setPublishedCount(templates.length))
      .catch(() => setPublishedCount(0));
  }, [user]);

  const courses = [
    {
      title: "MLS Listing Essentials",
      description: "Create and publish listings accurately with minimal supervision.",
    },
    {
      title: "Transaction Workflows",
      description: "Handle documents, approvals, and submissions step-by-step.",
    },
    {
      title: "Client Intake & CRM",
      description: "Standardize how new clients are added and managed.",
    },
    {
      title: "Brokerage Software Stack",
      description: "Train staff on the exact tools your company uses.",
    },
  ];

  const signin = async () => {
    try {
      await signInWithPopup(auth, provider);
      const redirectTo = searchParams.get('redirect');
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      alert(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-tight">
            <Link href="/">Real Estate Library</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/courses"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Browse course catalog
            </Link>

            <Link
              href="/business"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Get access now
            </Link>

            <Link
              href="/admin/courses"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Admin tools
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={signin}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6">


        {!user ? (
          <section className="grid items-center gap-12 py-20 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Real estate training platform
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Replace shadowing with structured training.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                Help new hires learn faster with repeatable, workflow-based training.
                Reduce onboarding time and keep processes consistent across your team.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={signin}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Sign in with Google
                </button>
                <a
                  href="#courses"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Browse courses
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Live Course Library</h3>
                <span className="text-xs text-emerald-600">Updated live</span>
              </div>

              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white">{publishedCount}</p>
                <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">courses available now</p>
              </div>

              <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                Structured workflows for real estate professionals
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="grid items-center gap-12 py-20 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Signed in as {user.email}
                </p>

                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Replace shadowing with structured training.
                </h1>

                <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                  Help new hires learn faster with repeatable, workflow-based training.
                  Reduce onboarding time and keep processes consistent across your team.
                </p>

                <div className="mt-8 flex gap-4">
                  <a
                    href="#signup"
                    className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Request demo
                  </a>
                  <Link
                    href="/courses"
                    className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Browse courses
                  </Link>
                </div>

                <div className="mt-10 flex gap-8 text-sm text-zinc-500">
                  <div>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white">3x</p>
                    Faster onboarding
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white">100%</p>
                    Standardized training
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white">24/7</p>
                    Access
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Live Course Library</h3>
                  <span className="text-xs text-emerald-600">Updated live</span>
                </div>

                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white">{publishedCount}</p>
                  <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">courses available now</p>
                </div>

                <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                  Structured workflows for real estate professionals
                </p>
              </div>
            </section>

            <section id="courses" className="py-16">
              <div className="mb-10 max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Ready-to-use training modules
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  Give your team structured workflows instead of inconsistent
                  shadowing and guesswork.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {courses.map((course) => (
                  <div
                    key={course.title}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {course.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="signup"
              className="mb-20 rounded-3xl bg-emerald-600 px-8 py-14 text-white"
            >
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold">
                    Train your team the scalable way.
                  </h2>
                  <p className="mt-4 text-emerald-100">
                    Replace manual onboarding with structured learning paths tailored
                    to your brokerage’s workflow.
                  </p>
                </div>

                <div className="flex gap-4">
                  <a
                    href="/business"
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Contact sales
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}