import { db } from "@/lib/firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { getCurrentUserContext } from "@/lib/services/user-service";
import { getCourseTemplate } from "@/lib/services/course-service";

/**
 * Enrollment and progress service.
 *
 * This module owns learner state for:
 * - enrollment creation,
 * - step progression,
 * - selected software per step,
 * - progress percentage shown in dashboard/course views.
 */

const TENANTS_COLLECTION = "tenants";
const ENROLLMENTS_COLLECTION = "enrollments";

/**
 * Uses one enrollment document per user/course pair.
 */
function getEnrollmentDocumentId(userId: string, courseId: string) {
	return `${userId}_${courseId}`;
}

/**
 * Utility for handling specific Firestore error codes in catch blocks.
 */
function isFirestoreErrorCode(error: unknown, code: string) {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code: string }).code === code
	);
}

/**
 * Calculates learner progress as a percentage.
 *
 * Model: each step counts as one unit and quiz completion counts as one unit.
 * If enrollment is explicitly marked completed, this returns 100 immediately.
 */
function calculateProgressPercent(
	template: {
		steps?: unknown[];
		quiz?: { questions?: unknown[] };
	} | null,
	enrollment: {
		status?: string;
		completedAt?: unknown;
		stepProgress?: Record<string, { completedAt?: unknown }>;
		quiz?: { lastAttemptAt?: unknown };
	} | null
) {
	const steps = (template?.steps ?? []) as { id: string }[];
	const hasQuiz = Boolean(template?.quiz?.questions?.length);
	// Quiz completion is treated as a final milestone unit alongside steps.
	const totalUnits = steps.length + (hasQuiz ? 1 : 0);

	if (totalUnits === 0) {
		return 0;
	}

	if (enrollment?.status === "completed" || enrollment?.completedAt) {
		return 100;
	}

	const completedSteps = steps.filter(
		(step) => Boolean(enrollment?.stepProgress?.[step.id]?.completedAt)
	).length;
	const completedQuiz = hasQuiz && Boolean(enrollment?.quiz?.lastAttemptAt) ? 1 : 0;
	const completedUnits = completedSteps + completedQuiz;

	return Math.min(100, Math.round((completedUnits / totalUnits) * 100));
}

/**
 * Gets enrollment for a course, optionally creating it when missing.
 */
export async function getEnrollmentForCourse(
	courseId: string,
	options: { createIfMissing?: boolean } = {}
) {
	const { createIfMissing = true } = options;
	const context = await getCurrentUserContext();
	const enrollmentId = getEnrollmentDocumentId(context.uid, courseId);
	const enrollmentRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ENROLLMENTS_COLLECTION,
		enrollmentId
	);

	let enrollmentSnapshot = await getDoc(enrollmentRef);

	if (!enrollmentSnapshot.exists() && createIfMissing) {
		await getOrCreateEnrollment(courseId);
		enrollmentSnapshot = await getDoc(enrollmentRef);
	}

	if (!enrollmentSnapshot.exists()) {
		return null;
	}

	const enrollment = { id: enrollmentSnapshot.id, ...enrollmentSnapshot.data() } as {
		id: string;
		status?: string;
		completedAt?: unknown;
		stepProgress?: Record<string, { completedAt?: unknown }>;
		quiz?: { lastAttemptAt?: unknown };
		[key: string]: unknown;
	};
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	return {
		...enrollment,
		progressPercent: calculateProgressPercent(template, enrollment),
	};
}

/**
 * Creates enrollment only once using a transaction to avoid duplicate writes.
 */
export async function getOrCreateEnrollment(courseId: string) {
	const context = await getCurrentUserContext();
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	if (!template) {
		throw new Error("Course template not found.");
	}

	const enrollmentId = getEnrollmentDocumentId(context.uid, courseId);
	const enrollmentRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ENROLLMENTS_COLLECTION,
		enrollmentId
	);

	const steps = (template.steps ?? []) as { id: string; order?: number }[];
	const firstStep = steps[0] ?? null;

	try {
		await runTransaction(db, async (transaction) => {
			const existing = await transaction.get(enrollmentRef);

			if (existing.exists()) {
				return;
			}

			transaction.set(enrollmentRef, {
				tenantId: context.tenantId,
				userId: context.uid,
				courseId,
				status: "in_progress",
				currentStepId: firstStep?.id ?? null,
				currentStepOrder: firstStep?.order ?? 1,
				// stepProgress is expanded lazily as the learner progresses through steps.
				stepProgress: {},
				quiz: {
					passed: false,
					score: null,
					lastAttemptAt: null,
				},
				startedAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				completedAt: null,
			});
		});
	} catch (error) {
		if (!isFirestoreErrorCode(error, "already-exists")) {
			throw error;
		}
	}

	const created = await getDoc(enrollmentRef);
	return { id: created.id, ...created.data() };
}

/**
 * Stores the software option selected for a specific course step.
 */
export async function saveSelectedSoftwareForStep(
	courseId: string,
	stepId: string,
	selectedSoftwareId: string
) {
	const context = await getCurrentUserContext();
	const enrollment = await getEnrollmentForCourse(courseId, { createIfMissing: true });

	if (!enrollment) {
		throw new Error("Enrollment not found.");
	}

	const enrollmentRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ENROLLMENTS_COLLECTION,
		enrollment.id
	);

	await updateDoc(enrollmentRef, {
		currentStepId: stepId,
		updatedAt: serverTimestamp(),
		[`stepProgress.${stepId}.selectedSoftwareId`]: selectedSoftwareId,
		[`stepProgress.${stepId}.updatedAt`]: serverTimestamp(),
	});
}

/**
 * Marks a step complete and advances the learner pointer to next step.
 */
export async function completeStepAndAdvance(courseId: string, stepId: string) {
	const context = await getCurrentUserContext();
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	if (!template) {
		throw new Error("Course template not found.");
	}

	const steps = (template.steps ?? []) as {
		id: string;
		order?: number;
		defaultSoftwareId?: string;
	}[];
	const currentStepIndex = steps.findIndex((item) => item.id === stepId);

	if (currentStepIndex === -1) {
		throw new Error("Step not found in course template.");
	}

	const nextStep = steps[currentStepIndex + 1] ?? null;
	const enrollment = await getEnrollmentForCourse(courseId, { createIfMissing: true });

	if (!enrollment) {
		throw new Error("Enrollment not found.");
	}

	const enrollmentRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ENROLLMENTS_COLLECTION,
		enrollment.id
	);

	const stepProgress = enrollment.stepProgress as Record<
		string,
		{ selectedSoftwareId?: string }
	> | undefined;

	const payload: Record<string, unknown> = {
		updatedAt: serverTimestamp(),
		status: enrollment.status === "completed" ? "completed" : "in_progress",
		currentStepId: nextStep?.id ?? stepId,
		currentStepOrder: nextStep?.order ?? steps[currentStepIndex].order,
		[`stepProgress.${stepId}.completedAt`]: serverTimestamp(),
		[`stepProgress.${stepId}.updatedAt`]: serverTimestamp(),
	};

	// If learner skipped explicit software selection, keep a deterministic default.
	if (!stepProgress?.[stepId]?.selectedSoftwareId) {
		payload[`stepProgress.${stepId}.selectedSoftwareId`] =
			steps[currentStepIndex].defaultSoftwareId ?? null;
	}

	await updateDoc(enrollmentRef, payload);

	return {
		nextStepId: nextStep?.id ?? null,
		isLastStep: !nextStep,
	};
}

/**
 * Lists all current-user enrollments and enriches them with course templates.
 */
export async function listUserEnrollmentsWithTemplates() {
	const context = await getCurrentUserContext();
	const enrollmentsRef = collection(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ENROLLMENTS_COLLECTION
	);
	const enrollmentsQuery = query(
		enrollmentsRef,
		where("userId", "==", context.uid),
		orderBy("updatedAt", "desc")
	);
	const snapshot = await getDocs(enrollmentsQuery);

	const enrollments = snapshot.docs.map((item) => ({
		id: item.id,
		...item.data(),
	})) as {
		id: string;
		courseId: string;
		status?: string;
		completedAt?: unknown;
		stepProgress?: Record<string, { completedAt?: unknown }>;
		quiz?: { lastAttemptAt?: unknown };
		[key: string]: unknown;
	}[];

	const templatesById: Record<string, Awaited<ReturnType<typeof getCourseTemplate>>> = {};

	await Promise.all(
		enrollments.map(async (enrollment) => {
			if (templatesById[enrollment.courseId]) {
				return;
			}

			const template = await getCourseTemplate(enrollment.courseId, { includeDraft: true });

			if (template) {
				templatesById[enrollment.courseId] = template;
			}
		})
	);

	return enrollments
		.map((enrollment) => {
			const template = templatesById[enrollment.courseId] ?? null;

			if (!template) {
				return null;
			}

			return {
				...enrollment,
				course: template,
				progressPercent: calculateProgressPercent(template, enrollment),
			};
		})
		.filter(Boolean);
}
