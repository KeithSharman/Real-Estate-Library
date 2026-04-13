import { db } from "@/lib/firebase";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { getCurrentUserContext } from "@/lib/services/user-service";
import { getCourseTemplate } from "@/lib/services/course-service";
import { getEnrollmentForCourse } from "@/lib/services/enrollment-service";

/**
 * Quiz service.
 *
 * Handles grading and persistence of quiz attempts, then syncs key fields
 * back into enrollment records so dashboard/course pages can read a compact
 * learner status without re-grading historical attempts.
 */

const TENANTS_COLLECTION = "tenants";
const ENROLLMENTS_COLLECTION = "enrollments";
const QUIZ_ATTEMPTS_COLLECTION = "quizAttempts";

const DEFAULT_PASSING_PERCENT = 80;

/**
 * Grades and stores a quiz attempt for the current user.
 *
 * Also updates enrollment summary fields (best score, pass flag, completion).
 */
export async function submitQuizAttempt(
	courseId: string,
	answersByQuestionId: Record<string, number>
) {
	const context = await getCurrentUserContext();
	const template = await getCourseTemplate(courseId, { includeDraft: true });
	const quiz = (template?.quiz as { passingPercent?: number; questions?: { id: string; correctAnswerIndex: number }[] } | undefined);

	if (!quiz?.questions?.length) {
		throw new Error("Quiz is not configured for this course.");
	}

	// Course-level passing threshold can override the global default.
	const passingPercent = quiz.passingPercent ?? DEFAULT_PASSING_PERCENT;
	const questions = quiz.questions;
	const correctAnswers = questions.filter(
		(question) => answersByQuestionId[question.id] === question.correctAnswerIndex
	).length;
	const score = Math.round((correctAnswers / questions.length) * 100);
	const passed = score >= passingPercent;

	const attemptsRef = collection(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		QUIZ_ATTEMPTS_COLLECTION
	);
	const createdAttempt = await addDoc(attemptsRef, {
		tenantId: context.tenantId,
		userId: context.uid,
		courseId,
		answersByQuestionId,
		score,
		passed,
		passingPercent,
		submittedAt: serverTimestamp(),
	});

	const enrollment = await getEnrollmentForCourse(courseId, { createIfMissing: true });

	if (enrollment) {
		const enrollmentQuiz = enrollment.quiz as {
			score?: number | null;
			passed?: boolean;
		} | undefined;
		const previousBestScore = enrollmentQuiz?.score ?? null;
		// Keep best historical score so learners are rewarded for improvement.
		const bestScore =
			typeof previousBestScore === "number"
				? Math.max(previousBestScore, score)
				: score;
		const hasCompletedAt = enrollment.completedAt != null;
		const enrollmentRef = doc(
			db,
			TENANTS_COLLECTION,
			context.tenantId,
			ENROLLMENTS_COLLECTION,
			enrollment.id
		);

		await updateDoc(enrollmentRef, {
			status: passed ? "completed" : enrollment.status,
			completedAt: hasCompletedAt
				? enrollment.completedAt
				: passed
					? serverTimestamp()
					: null,
			updatedAt: serverTimestamp(),
			quiz: {
				passed: passed || Boolean(enrollmentQuiz?.passed),
				score: bestScore,
				passingPercent,
				lastAttemptId: createdAttempt.id,
				lastAttemptAt: serverTimestamp(),
			},
		});
	}

	return {
		attemptId: createdAttempt.id,
		score,
		passed,
		passingPercent,
	};
}

/**
 * Returns the most recent quiz attempt for a user in a course.
 */
export async function getLatestQuizAttempt(courseId: string) {
	const context = await getCurrentUserContext();
	const attemptsRef = collection(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		QUIZ_ATTEMPTS_COLLECTION
	);
	const attemptsQuery = query(
		attemptsRef,
		where("userId", "==", context.uid),
		where("courseId", "==", courseId),
		orderBy("submittedAt", "desc"),
		limit(1)
	);
	const snapshot = await getDocs(attemptsQuery);

	if (snapshot.empty) {
		return null;
	}

	const attemptDoc = snapshot.docs[0];
	return {
		id: attemptDoc.id,
		...attemptDoc.data(),
	};
}
