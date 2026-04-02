import Link from "next/link";

const stepSoftwareOptions: Record<string, Array<{ id: string; name: string; description: string; category: string; isRecommended?: boolean; features?: string[] }>> = {
  "task-selection": [
    {
      id: "general-overview",
      name: "General Overview",
      description: "Start with an overview of the complete workflow",
      category: "Learning",
      isRecommended: true,
      features: ["Complete workflow overview", "Process mapping", "Best practices"],
    },
  ],
  "crm-setup": [
    {
      id: "salesforce",
      name: "Salesforce CRM",
      description: "Practice client intake and communication management",
      category: "CRM Platforms",
      isRecommended: true,
      features: ["Client database", "Communication tracking", "Lead management", "Task automation"],
    },
    {
      id: "hubspot",
      name: "HubSpot CRM",
      description: "Alternative CRM platform for client management",
      category: "CRM Platforms",
      features: ["Contact management", "Email integration", "Deal tracking", "Marketing automation"],
    },
    {
      id: "zoho",
      name: "Zoho CRM",
      description: "Cloud-based CRM solution",
      category: "CRM Platforms",
      features: ["Multi-channel support", "Analytics dashboard", "Mobile app", "API integrations"],
    },
    {
      id: "propertybase",
      name: "Propertybase",
      description: "Real estate specific CRM platform",
      category: "Real Estate CRM",
      features: ["MLS integration", "Property tracking", "Commission management", "Transaction workflow"],
    },
  ],
  "listing-entry": [
    {
      id: "mls-platform",
      name: "MLS Platform",
      description: "Learn property listing entry and management",
      category: "MLS Systems",
      isRecommended: true,
      features: ["Property database", "Listing management", "IDX feeds", "Compliance tracking"],
    },
    {
      id: "zillow",
      name: "Zillow Mortgages",
      description: "Alternative listing platform",
      category: "Listing Platforms",
      features: ["Lead generation", "Mortgage tools", "Property search", "Market data"],
    },
    {
      id: "realtor-com",
      name: "Realtor.com",
      description: "Popular real estate listing site",
      category: "Listing Platforms",
      features: ["Property listings", "Agent directory", "Market reports", "Lead capture"],
    },
    {
      id: "flexmls",
      name: "Flex MLS",
      description: "Advanced MLS platform with mobile tools",
      category: "MLS Systems",
      features: ["Mobile app", "Photo management", "Open house tools", "CMA reports"],
    },
  ],
  "document-submission": [
    {
      id: "docusign",
      name: "DocuSign",
      description: "Complete document workflows and signing",
      category: "E-Signature",
      isRecommended: true,
      features: ["Electronic signatures", "Document templates", "Workflow automation", "Compliance tracking"],
    },
    {
      id: "adobe-sign",
      name: "Adobe Sign",
      description: "Alternative e-signature platform",
      category: "E-Signature",
      features: ["PDF integration", "Advanced security", "Bulk sending", "API access"],
    },
    {
      id: "hellosign",
      name: "HelloSign",
      description: "Simple document signing solution",
      category: "E-Signature",
      features: ["Easy setup", "Team management", "Audit trails", "Mobile signing"],
    },
    {
      id: "dotloop",
      name: "DotLoop",
      description: "Real estate specific transaction management",
      category: "Transaction Management",
      features: ["Document management", "Task tracking", "Client communication", "Commission tracking"],
    },
  ],
};

export default async function SoftwareSelectPage({
  params,
}: {
  params: Promise<{ courseId: string; stepId: string }>;
}) {
  const { courseId, stepId } = await params;
  const softwareOptions = stepSoftwareOptions[stepId];

  if (!softwareOptions) {
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

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Choose the software platform you'll be using for this step. Select the one your brokerage uses or try a recommended option.
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
                  <Link
                    href={`/courses/${courseId}/${stepId}`}
                    className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition whitespace-nowrap ${
                      software.isRecommended
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-zinc-600 hover:bg-zinc-500'
                    }`}
                  >
                    Start with {software.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Don't see your software?</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              The concepts taught in this course apply to most real estate software platforms. Choose the recommended option to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
