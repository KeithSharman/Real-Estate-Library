import Link from "next/link";

const stepContent: Record<string, { title: string; software: string; description: string; stepNumber: number }> = {
  "task-selection": {
    title: "Select task to learn",
    software: "General Overview",
    description: "Choose which real estate workflow you want to complete and understand the basic steps involved.",
    stepNumber: 1,
  },
  "crm-setup": {
    title: "Client Intake in CRM",
    software: "Salesforce CRM",
    description: "Learn how to add a client and prepare their information for follow-up and transaction management.",
    stepNumber: 2,
  },
  "listing-entry": {
    title: "Create Property Listing",
    software: "MLS Platform",
    description: "Learn how to enter listing details into the MLS system, upload property photos, and verify that all required fields are completed correctly.",
    stepNumber: 3,
  },
  "document-submission": {
    title: "Submit Required Documents",
    software: "DocuSign",
    description: "Complete the workflow by finalizing documents, collecting signatures, and submitting to the correct destination.",
    stepNumber: 4,
  },
};

const stepOrder = ["task-selection", "crm-setup", "listing-entry", "document-submission"];

export default async function CourseStepPage({
  params,
}: {
  params: Promise<{ courseId: string; stepId: string }>;
}) {
  const { courseId, stepId } = await params;
  const step = stepContent[stepId];
  const currentStepIndex = stepOrder.indexOf(stepId);
  const isLastStep = currentStepIndex === stepOrder.length - 1;
  const nextStepId = !isLastStep ? stepOrder[currentStepIndex + 1] : null;
  const prevStepId = currentStepIndex > 0 ? stepOrder[currentStepIndex - 1] : null;

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
              {step.software}
            </span>
            <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700">
              Step {step.stepNumber} of 4
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            {step.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            {step.description}
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex aspect-video items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              Placeholder for embedded YouTube training video
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Instructions</h2>

            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <li>1. Learn and review the content for this step.</li>
              <li>2. Follow along with the examples and best practices.</li>
              <li>3. Practice the workflow with sample data.</li>
              <li>4. Refer back to the key points as needed.</li>
              <li>5. Complete this step when you feel confident in the material.</li>
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

            {nextStepId ? (
              <Link
                href={`/courses/${courseId}/software-select/${nextStepId}`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Next step
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}/quiz`}
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Take final quiz
              </Link>
            )}
            </div>
        </div>
      </div>
    </main>
  );
}