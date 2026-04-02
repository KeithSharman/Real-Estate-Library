"use client";

import Link from "next/link";

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    description: "Perfect for small brokerages getting started with structured training.",
    features: [
      "Up to 10 team members",
      "5 core training modules",
      "Basic progress tracking",
      "Email support",
      "Mobile access",
    ],
    popular: false,
    stripePriceId: "price_starter_plan",
  },
  {
    name: "Professional",
    price: "$149",
    period: "per month",
    description: "Ideal for growing brokerages with comprehensive training needs.",
    features: [
      "Up to 50 team members",
      "All training modules",
      "Advanced analytics & reporting",
      "Priority support",
      "Custom workflows",
      "API access",
      "White-label option",
    ],
    popular: true,
    stripePriceId: "price_professional_plan",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for large brokerages and franchises.",
    features: [
      "Unlimited team members",
      "All features included",
      "Dedicated success manager",
      "Custom integrations",
      "On-premise deployment",
      "Advanced security",
      "24/7 phone support",
    ],
    popular: false,
    stripePriceId: "price_enterprise_plan",
  },
];

const faqs = [
  {
    question: "How does the billing work?",
    answer: "We bill monthly or annually. Annual plans save you 20%. You can upgrade, downgrade, or cancel at any time.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
  },
  {
    question: "What software platforms do you support?",
    answer: "We support all major real estate software including Salesforce, HubSpot, MLS platforms, DocuSign, and many more.",
  },
  {
    question: "Do you offer training on our specific tools?",
    answer: "Yes! Enterprise plans include custom workflow creation for your specific software stack.",
  },
  {
    question: "Is there a free trial?",
    answer: "We offer a 14-day free trial for all plans. No credit card required to start.",
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Back to home
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Scale your brokerage with structured training
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            Replace inconsistent shadowing with repeatable, software-specific training paths.
            Get your entire team aligned on workflows and tools.
          </p>
        </header>

        {/* Pricing Cards */}
        <section className="mb-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-8 ${
                  plan.popular
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 ring-2 ring-emerald-500'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
                }`}
              >
                {plan.popular && (
                  <div className="mb-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="mr-3 h-4 w-4 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full rounded-full py-3 text-sm font-medium transition ${
                    plan.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything you need to train at scale
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Built specifically for real estate brokerages
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Workflow Standardization</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Ensure every team member follows the same processes for listings, transactions, and client management.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Faster Onboarding</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Reduce training time from weeks to days with structured, self-paced learning modules.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Performance Analytics</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Track completion rates, quiz scores, and identify areas where additional training is needed.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Mobile Learning</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Access training materials on any device. Perfect for agents working in the field.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Compliance Ready</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Stay compliant with industry regulations and licensing requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Continuous Updates</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                New modules added regularly to keep your team current with industry changes.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl bg-emerald-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-semibold">
            Ready to transform your training?
          </h2>
          <p className="mt-4 text-emerald-100">
            Join hundreds of brokerages already using structured training to scale their operations.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => handlePlanSelection(pricingPlans[1])} // Professional plan
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Start Free Trial
            </button>
            <Link
              href="/"
              className="rounded-full border border-white px-6 py-3 text-sm font-medium hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function handlePlanSelection(plan: typeof pricingPlans[0]) {
  // Placeholder for Stripe integration
  console.log(`Selected plan: ${plan.name} (${plan.stripePriceId})`);

  // In a real implementation, this would:
  // 1. Redirect to Stripe Checkout
  // 2. Handle the payment flow
  // 3. Create the account
  // 4. Redirect to dashboard

  alert(`This would integrate with Stripe to purchase the ${plan.name} plan.\n\nStripe Price ID: ${plan.stripePriceId}\n\nIn a real implementation, this would redirect to Stripe Checkout.`);
}