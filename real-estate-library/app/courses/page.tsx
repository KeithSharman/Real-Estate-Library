import Link from "next/link";

const courses = [
  {
    id: "mls-listing-essentials-demo",
    title: "MLS Listing Essentials [Demo]",
    category: "Listings",
    level: "Beginner",
    duration: "2.5 hours",
    description:
      "Demo course showing a complete listing workflow. Works without backend integration - use this to test the course functionality.",
    featured: true,
    skills: ["MLS Platform", "Property Marketing", "Compliance"],
  },
  {
    id: "mls-listing-essentials",
    title: "MLS Listing Essentials",
    category: "Listings",
    level: "Beginner",
    duration: "2.5 hours",
    description:
      "Learn the full process of creating, reviewing, and publishing a property listing correctly.",
    skills: ["MLS Platform", "Property Marketing", "Compliance"],
  },
  {
    id: "transaction-document-workflow",
    title: "Transaction Document Workflow",
    category: "Compliance",
    level: "Intermediate",
    duration: "3 hours",
    description:
      "Understand the sequence for preparing, signing, and submitting real estate documents.",
    skills: ["Document Management", "Legal Compliance", "Transaction Processing"],
  },
  {
    id: "client-intake-crm-setup",
    title: "Client Intake & CRM Setup",
    category: "Sales",
    level: "Beginner",
    duration: "1.5 hours",
    description:
      "Standardize how new client information is entered and managed in your CRM.",
    skills: ["CRM Management", "Client Relations", "Lead Conversion"],
  },
  {
    id: "brokerage-software-stack",
    title: "Brokerage Software Stack",
    category: "Systems",
    level: "Intermediate",
    duration: "2 hours",
    description:
      "Train employees on the software tools your brokerage uses every day.",
    skills: ["Software Training", "Workflow Optimization", "Team Productivity"],
  },
  {
    id: "offer-preparation-essentials",
    title: "Offer Preparation Essentials",
    category: "Offers",
    level: "Advanced",
    duration: "3.5 hours",
    description:
      "Walk through the steps involved in creating and submitting an offer package.",
    skills: ["Offer Writing", "Negotiation", "Contract Law"],
  },
  {
    id: "property-showing-workflow",
    title: "Property Showing Workflow",
    category: "Operations",
    level: "Beginner",
    duration: "1 hour",
    description:
      "Build consistent habits for scheduling, preparing for, and following up on showings.",
    skills: ["Customer Service", "Property Presentation", "Follow-up Process"],
  },
];

const categories = [
  "All courses",
  "Listings",
  "Compliance",
  "Sales",
  "Systems",
  "Offers",
  "Operations",
];

export default function CoursesPage() {
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
                    placeholder="Search by course title, category, or keyword"
                    className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {courses.map((course) => (
                <article
                  key={course.title}
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
                    {course.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{course.duration}</span>
                    <span>Certificate eligible</span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      Enroll
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