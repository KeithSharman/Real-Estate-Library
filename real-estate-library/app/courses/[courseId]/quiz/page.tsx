"use client";

import Link from "next/link";
import { useState, use } from "react";

const quizQuestions = [
  {
    id: 1,
    question: "Which software is used to publish a property listing?",
    options: ["CRM Platform", "MLS Platform", "Accounting Software"],
    correctAnswer: 1, // Index of correct answer (0-based)
  },
  {
    id: 2,
    question: "What should you do before submitting documents?",
    options: ["Skip the review step", "Verify signatures and required fields", "Send incomplete forms"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which step comes first in the listing workflow?",
    options: ["Publish listing", "Client intake", "Document submission"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What is the minimum score required to pass?",
    options: ["50%", "70%", "80%"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "Which software handles electronic signatures?",
    options: ["CRM Platform", "DocuSign", "MLS Platform"],
    correctAnswer: 1,
  },
];

export default function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    const correctAnswers = quizQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    return Math.round((correctAnswers / quizQuestions.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    const passed = score >= 80;

    // Store results in localStorage for the results page
    localStorage.setItem(`quiz_${courseId}`, JSON.stringify({
      score,
      passed,
      answers,
      timestamp: Date.now()
    }));
  };

  const handleAutoPass = () => {
    // Only allow auto-pass for demo course
    if (courseId === "mls-listing-essentials-demo") {
      const perfectAnswers: Record<number, number> = {};
      quizQuestions.forEach(q => {
        perfectAnswers[q.id] = q.correctAnswer;
      });

      localStorage.setItem(`quiz_${courseId}`, JSON.stringify({
        score: 100,
        passed: true,
        answers: perfectAnswers,
        timestamp: Date.now(),
        autoPassed: true
      }));

      // Redirect to results
      window.location.href = `/courses/${courseId}/results`;
    }
  };

  if (submitted) {
    const score = calculateScore();
    const passed = score >= 80;

    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold ${
                  passed
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {score}%
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight">
                {passed ? "Quiz Submitted!" : "Quiz Submitted"}
              </h1>

              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                {passed
                  ? "Your answers have been recorded. Click below to see your results."
                  : "Your answers have been recorded. A minimum score of 80% is required to pass."}
              </p>

              <div className="mt-10">
                <Link
                  href={`/courses/${courseId}/results`}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  View Results
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to course overview
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-4xl font-semibold tracking-tight">Final Quiz</h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            A score of 80% or higher is required to pass this course. Answer all questions below.
          </p>

          <div className="mt-8 space-y-8">
            {quizQuestions.map((question) => (
              <div key={question.id}>
                <p className="font-medium">
                  {question.id}. {question.question}
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  {question.options.map((option, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${question.id}`}
                        value={index}
                        checked={answers[question.id] === index}
                        onChange={() => handleAnswerChange(question.id, index)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>

            {courseId === "mls-listing-essentials-demo" && (
              <button
                onClick={handleAutoPass}
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Auto Pass (Demo Only)
              </button>
            )}
          </div>

          {Object.keys(answers).length !== quizQuestions.length && (
            <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
              Please answer all questions before submitting.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
