import Link from "next/link";

interface CourseStep {
  id: string;
  title: string;
  description: string;
  software: string;
}

interface Course {
  title: string;
  description: string;
  progress: number;
  steps: CourseStep[];
}

const coursesData: Record<string, Course> = {
  "mls-listing-essentials-demo": {
    title: "MLS Listing Essentials [Demo]",
    description:
      "Learn the complete process for creating, reviewing, and publishing a real estate listing. This demo version works without a backend.",
    progress: 0,
    steps: [
      {
        id: "task-selection",
        title: "Select task to learn",
        description: "Choose which real estate workflow you want to complete.",
        software: "General Overview",
      },
      {
        id: "crm-setup",
        title: "Client Intake in CRM",
        description: "Learn how to add a client and prepare their information.",
        software: "Salesforce CRM",
      },
      {
        id: "listing-entry",
        title: "Create Property Listing",
        description: "Enter listing details into the MLS system.",
        software: "MLS Platform",
      },
      {
        id: "document-submission",
        title: "Submit Required Documents",
        description: "Finalize and send forms to the correct destination.",
        software: "DocuSign",
      },
    ],
  },
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  
  // Always allow demo course to work
  let finalCourse: Course | undefined = coursesData[courseId];
  if (!finalCourse && (courseId === "mls-listing-essentials-demo" || courseId.includes("demo"))) {
    finalCourse = coursesData["mls-listing-essentials-demo"];
  }

  if (!finalCourse) {
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
              This course is not available yet. Currently only the "MLS Listing Essentials [Demo]" course is available without a backend.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses/mls-listing-essentials-demo/task-selection"
                className="inline-block rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Try the demo course
              </Link>
              <Link
                href="/courses"
                className="inline-block rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                View all courses
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
              {finalCourse.title}
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
              {finalCourse.title}
            </h1>

            <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
              {finalCourse.description}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Course progress
            </p>
            <p className="mt-2 text-3xl font-semibold">{finalCourse.progress}%</p>
            <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${finalCourse.progress}%` }}
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
            {finalCourse.steps.map((step, index) => (
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
                      Software: {step.software}
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
            ))}
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
