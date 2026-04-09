import { auth, db } from "../_utils/firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const TENANTS_COLLECTION = "tenants";
const COURSE_TEMPLATES_COLLECTION = "courseTemplates";
const ENROLLMENTS_COLLECTION = "enrollments";
const QUIZ_ATTEMPTS_COLLECTION = "quizAttempts";
const ADMINS_COLLECTION = "admins";

const DEFAULT_PASSING_PERCENT = 80;
const DEFAULT_BOOTSTRAP_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "tenant-acme";

export const DEMO_COURSE_TEMPLATE_SEED = {
	id: "mls-listing-essentials-template",
	title: "MLS Listing Essentials",
	category: "Listings",
	level: "Beginner",
	duration: "2.5 hours",
	description:
		"Learn the complete process for creating, reviewing, and publishing a real estate listing.",
	status: "published",
	version: 1,
	tags: ["MLS", "Onboarding", "Listing Workflow"],
	skills: ["MLS Platform", "Property Marketing", "Compliance"],
	steps: [
		{
			id: "task-selection",
			order: 1,
			title: "Select task to learn",
			description:
				"Choose which real estate workflow you want to complete and understand the basic steps involved.",
			videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			instructions: [
				"Review the workflow goals for this module.",
				"Identify the systems your brokerage currently uses.",
				"Select the software path you will follow for this step.",
			],
			softwareOptions: [
				{
					id: "general-overview",
					name: "General Overview",
					description: "Start with an overview of the complete workflow",
					category: "Learning",
					isRecommended: true,
					features: [
						"Complete workflow overview",
						"Process mapping",
						"Best practices",
					],
				},
			],
			defaultSoftwareId: "general-overview",
			resources: [
				{
					label: "Workflow checklist",
					url: "https://example.com/workflow-checklist",
					type: "link",
				},
			],
		},
		{
			id: "crm-setup",
			order: 2,
			title: "Client Intake in CRM",
			description:
				"Learn how to add a client and prepare their information for follow-up and transaction management.",
			videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			instructions: [
				"Create a new lead/contact record.",
				"Enter client profile and property requirements.",
				"Set next actions and communication reminders.",
			],
			softwareOptions: [
				{
					id: "salesforce",
					name: "Salesforce CRM",
					description: "Practice client intake and communication management",
					category: "CRM Platforms",
					isRecommended: true,
					features: [
						"Client database",
						"Communication tracking",
						"Lead management",
						"Task automation",
					],
				},
				{
					id: "hubspot",
					name: "HubSpot CRM",
					description: "Alternative CRM platform for client management",
					category: "CRM Platforms",
					features: [
						"Contact management",
						"Email integration",
						"Deal tracking",
						"Marketing automation",
					],
				},
				{
					id: "zoho",
					name: "Zoho CRM",
					description: "Cloud-based CRM solution",
					category: "CRM Platforms",
					features: [
						"Multi-channel support",
						"Analytics dashboard",
						"Mobile app",
						"API integrations",
					],
				},
				{
					id: "propertybase",
					name: "Propertybase",
					description: "Real estate specific CRM platform",
					category: "Real Estate CRM",
					features: [
						"MLS integration",
						"Property tracking",
						"Commission management",
						"Transaction workflow",
					],
				},
			],
			defaultSoftwareId: "salesforce",
			resources: [
				{
					label: "CRM intake template",
					url: "https://example.com/crm-template",
					type: "link",
				},
			],
		},
		{
			id: "listing-entry",
			order: 3,
			title: "Create Property Listing",
			description:
				"Learn how to enter listing details into the MLS system, upload property photos, and verify that all required fields are completed correctly.",
			videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			instructions: [
				"Create a draft listing and fill all mandatory fields.",
				"Upload and order photos for best presentation.",
				"Run compliance checks before submission.",
			],
			softwareOptions: [
				{
					id: "mls-platform",
					name: "MLS Platform",
					description: "Learn property listing entry and management",
					category: "MLS Systems",
					isRecommended: true,
					features: [
						"Property database",
						"Listing management",
						"IDX feeds",
						"Compliance tracking",
					],
				},
				{
					id: "zillow",
					name: "Zillow Mortgages",
					description: "Alternative listing platform",
					category: "Listing Platforms",
					features: [
						"Lead generation",
						"Mortgage tools",
						"Property search",
						"Market data",
					],
				},
				{
					id: "realtor-com",
					name: "Realtor.com",
					description: "Popular real estate listing site",
					category: "Listing Platforms",
					features: [
						"Property listings",
						"Agent directory",
						"Market reports",
						"Lead capture",
					],
				},
				{
					id: "flexmls",
					name: "Flex MLS",
					description: "Advanced MLS platform with mobile tools",
					category: "MLS Systems",
					features: ["Mobile app", "Photo management", "Open house tools", "CMA reports"],
				},
			],
			defaultSoftwareId: "mls-platform",
			resources: [
				{
					label: "MLS field guide",
					url: "https://example.com/mls-fields",
					type: "link",
				},
			],
		},
		{
			id: "document-submission",
			order: 4,
			title: "Submit Required Documents",
			description:
				"Complete the workflow by finalizing documents, collecting signatures, and submitting to the correct destination.",
			videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			instructions: [
				"Package required forms for review.",
				"Collect signatures and confirm form completeness.",
				"Submit documents to brokerage compliance queue.",
			],
			softwareOptions: [
				{
					id: "docusign",
					name: "DocuSign",
					description: "Complete document workflows and signing",
					category: "E-Signature",
					isRecommended: true,
					features: [
						"Electronic signatures",
						"Document templates",
						"Workflow automation",
						"Compliance tracking",
					],
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
					features: [
						"Document management",
						"Task tracking",
						"Client communication",
						"Commission tracking",
					],
				},
			],
			defaultSoftwareId: "docusign",
			resources: [
				{
					label: "Submission checklist",
					url: "https://example.com/submission-checklist",
					type: "link",
				},
			],
		},
	],
	quiz: {
		passingPercent: 80,
		questions: [
			{
				id: "q1",
				question: "Which software is used to publish a property listing?",
				options: ["CRM Platform", "MLS Platform", "Accounting Software"],
				correctAnswerIndex: 1,
			},
			{
				id: "q2",
				question: "What should you do before submitting documents?",
				options: ["Skip the review step", "Verify signatures and required fields", "Send incomplete forms"],
				correctAnswerIndex: 1,
			},
			{
				id: "q3",
				question: "Which step comes first in the listing workflow?",
				options: ["Publish listing", "Client intake", "Document submission"],
				correctAnswerIndex: 1,
			},
			{
				id: "q4",
				question: "What is the minimum score required to pass?",
				options: ["50%", "70%", "80%"],
				correctAnswerIndex: 2,
			},
			{
				id: "q5",
				question: "Which software handles electronic signatures?",
				options: ["CRM Platform", "DocuSign", "MLS Platform"],
				correctAnswerIndex: 1,
			},
		],
	},
};

function requireAuthenticatedUser() {
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("You must be signed in to access course data.");
	}

	return currentUser;
}

function getEnrollmentDocumentId(userId, courseId) {
	return `${userId}_${courseId}`;
}

function buildTenantCollectionPath(tenantId, collectionName) {
	return collection(db, TENANTS_COLLECTION, tenantId, collectionName);
}

function calculateProgressPercent(template, enrollment) {
	const steps = template?.steps ?? [];

	if (steps.length === 0) {
		return 0;
	}

	const completed = steps.filter((step) => Boolean(enrollment?.stepProgress?.[step.id]?.completedAt)).length;
	return Math.round((completed / steps.length) * 100);
}

function normalizeSteps(steps = []) {
	return [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function ensureCurrentUserProfile(options = {}) {
	const currentUser = requireAuthenticatedUser();
	const { tenantId = DEFAULT_BOOTSTRAP_TENANT_ID } = options;
	const userRef = doc(db, USERS_COLLECTION, currentUser.uid);
	let userSnapshot = await getDoc(userRef);

	if (!userSnapshot.exists()) {
		await setDoc(userRef, {
			tenantId,
			displayName: currentUser.displayName ?? null,
			email: currentUser.email ?? null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		userSnapshot = await getDoc(userRef);

		return {
			created: true,
			uid: currentUser.uid,
			profile: userSnapshot.exists() ? userSnapshot.data() : null,
		};
	}

	const userData = userSnapshot.data();

	if (!userData.tenantId && tenantId) {
		await updateDoc(userRef, {
			tenantId,
			updatedAt: serverTimestamp(),
		});

		userSnapshot = await getDoc(userRef);
	}

	return {
		created: false,
		uid: currentUser.uid,
		profile: userSnapshot.data(),
	};
}

export async function getCurrentUserContext(options = {}) {
	const currentUser = requireAuthenticatedUser();
	const { tenantId: preferredTenantId = DEFAULT_BOOTSTRAP_TENANT_ID } = options;
	const ensuredProfile = await ensureCurrentUserProfile({ tenantId: preferredTenantId });
	const userData = ensuredProfile.profile;

	if (!userData) {
		throw new Error(
			`User profile not found for uid ${currentUser.uid}. Create users/{uid} with tenantId before accessing courses.`
		);
	}

	const tenantId = userData.tenantId;

	if (!tenantId) {
		throw new Error("User profile is missing tenantId.");
	}

	return {
		uid: currentUser.uid,
		email: currentUser.email,
		displayName: currentUser.displayName,
		tenantId,
		profile: userData,
	};
}

export async function listPublishedCourseTemplates() {
	const { tenantId } = await getCurrentUserContext();
	const templatesRef = buildTenantCollectionPath(tenantId, COURSE_TEMPLATES_COLLECTION);
	const templatesQuery = query(templatesRef, where("status", "==", "published"));
	const snapshot = await getDocs(templatesQuery);

	return snapshot.docs
		.map((item) => ({ id: item.id, ...item.data() }))
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

export async function listAllCourseTemplatesForTenant() {
	const context = await getCurrentUserContext();
	const isAdmin = await isCurrentUserTenantAdmin(context);

	if (!isAdmin) {
		throw new Error("Only tenant admins can list all templates.");
	}

	const templatesRef = buildTenantCollectionPath(context.tenantId, COURSE_TEMPLATES_COLLECTION);
	const snapshot = await getDocs(templatesRef);
	return snapshot.docs
		.map((item) => ({ id: item.id, ...item.data() }))
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

export async function getCourseTemplate(courseId, options = {}) {
	const { includeDraft = false } = options;
	const { tenantId } = await getCurrentUserContext();
	const templateRef = doc(
		db,
		TENANTS_COLLECTION,
		tenantId,
		COURSE_TEMPLATES_COLLECTION,
		courseId
	);
	const snapshot = await getDoc(templateRef);

	if (!snapshot.exists()) {
		return null;
	}

	const template = { id: snapshot.id, ...snapshot.data() };
	template.steps = normalizeSteps(template.steps);

	if (!includeDraft && template.status !== "published") {
		return null;
	}

	return template;
}

export async function getEnrollmentForCourse(courseId, options = {}) {
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

	const enrollment = { id: enrollmentSnapshot.id, ...enrollmentSnapshot.data() };
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	return {
		...enrollment,
		progressPercent: calculateProgressPercent(template, enrollment),
	};
}

export async function getOrCreateEnrollment(courseId) {
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

	const firstStep = template.steps?.[0] ?? null;

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

	const created = await getDoc(enrollmentRef);
	return { id: created.id, ...created.data() };
}

export async function saveSelectedSoftwareForStep(courseId, stepId, selectedSoftwareId) {
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

export async function completeStepAndAdvance(courseId, stepId) {
	const context = await getCurrentUserContext();
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	if (!template) {
		throw new Error("Course template not found.");
	}

	const steps = template.steps ?? [];
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

	const payload = {
		updatedAt: serverTimestamp(),
		status: nextStep ? "in_progress" : "completed",
		currentStepId: nextStep?.id ?? stepId,
		currentStepOrder: nextStep?.order ?? steps[currentStepIndex].order,
		[`stepProgress.${stepId}.completedAt`]: serverTimestamp(),
		[`stepProgress.${stepId}.updatedAt`]: serverTimestamp(),
	};

	if (!enrollment.stepProgress?.[stepId]?.selectedSoftwareId) {
		payload[`stepProgress.${stepId}.selectedSoftwareId`] = steps[currentStepIndex].defaultSoftwareId ?? null;
	}

	if (!nextStep) {
		payload.completedAt = serverTimestamp();
	}

	await updateDoc(enrollmentRef, payload);

	return {
		nextStepId: nextStep?.id ?? null,
		isLastStep: !nextStep,
	};
}

export async function listUserEnrollmentsWithTemplates() {
	const context = await getCurrentUserContext();
	const enrollmentsRef = buildTenantCollectionPath(context.tenantId, ENROLLMENTS_COLLECTION);
	const enrollmentsQuery = query(
		enrollmentsRef,
		where("userId", "==", context.uid),
		orderBy("updatedAt", "desc")
	);
	const snapshot = await getDocs(enrollmentsQuery);

	const enrollments = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
	const templatesById = {};

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

export async function submitQuizAttempt(courseId, answersByQuestionId) {
	const context = await getCurrentUserContext();
	const template = await getCourseTemplate(courseId, { includeDraft: true });

	if (!template?.quiz?.questions?.length) {
		throw new Error("Quiz is not configured for this course.");
	}

	const passingPercent = template.quiz.passingPercent ?? DEFAULT_PASSING_PERCENT;
	const questions = template.quiz.questions;
	const correctAnswers = questions.filter(
		(question) => answersByQuestionId[question.id] === question.correctAnswerIndex
	).length;
	const score = Math.round((correctAnswers / questions.length) * 100);
	const passed = score >= passingPercent;

	const attemptsRef = buildTenantCollectionPath(context.tenantId, QUIZ_ATTEMPTS_COLLECTION);
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
		const enrollmentRef = doc(
			db,
			TENANTS_COLLECTION,
			context.tenantId,
			ENROLLMENTS_COLLECTION,
			enrollment.id
		);

		await updateDoc(enrollmentRef, {
			status: passed ? "completed" : enrollment.status,
			completedAt: passed ? serverTimestamp() : enrollment.completedAt ?? null,
			updatedAt: serverTimestamp(),
			quiz: {
				passed,
				score,
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

export async function getLatestQuizAttempt(courseId) {
	const context = await getCurrentUserContext();
	const attemptsRef = buildTenantCollectionPath(context.tenantId, QUIZ_ATTEMPTS_COLLECTION);
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

export async function isCurrentUserTenantAdmin(existingContext) {
	const context = existingContext ?? (await getCurrentUserContext());
	const adminRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ADMINS_COLLECTION,
		context.uid
	);
	const adminSnapshot = await getDoc(adminRef);
	return adminSnapshot.exists();
}

export async function selfAssignCurrentUserAsTenantAdmin() {
	const context = await getCurrentUserContext();
	const adminRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ADMINS_COLLECTION,
		context.uid
	);

	await setDoc(
		adminRef,
		{
			uid: context.uid,
			email: context.email ?? null,
			createdAt: serverTimestamp(),
		},
		{ merge: true }
	);

	return {
		uuid: context.uid,
		tenantId: context.tenantId,
	};
}

async function assertCurrentUserIsTenantAdmin(existingContext) {
	const context = existingContext ?? (await getCurrentUserContext());
	const isAdmin = await isCurrentUserTenantAdmin(context);

	if (!isAdmin) {
		throw new Error("Only tenant admins can manage course templates.");
	}

	return context;
}

function slugify(value) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export async function createOrUpdateCourseTemplate(templateInput) {
	const context = await assertCurrentUserIsTenantAdmin();
	const courseId = templateInput.id || slugify(templateInput.title || "untitled-course");
	const templateRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		COURSE_TEMPLATES_COLLECTION,
		courseId
	);
	const existing = await getDoc(templateRef);
	const mergedSteps = normalizeSteps(templateInput.steps);

	await setDoc(
		templateRef,
		{
			...templateInput,
			id: courseId,
			tenantId: context.tenantId,
			version: templateInput.version ?? 1,
			status: templateInput.status ?? "draft",
			steps: mergedSteps,
			updatedAt: serverTimestamp(),
			createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
		},
		{ merge: true }
	);

	return courseId;
}

export async function setCourseTemplatePublishState(courseId, isPublished) {
	const context = await assertCurrentUserIsTenantAdmin();
	const templateRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		COURSE_TEMPLATES_COLLECTION,
		courseId
	);

	await updateDoc(templateRef, {
		status: isPublished ? "published" : "draft",
		updatedAt: serverTimestamp(),
	});
}

export async function removeCourseTemplate(courseId) {
	const context = await assertCurrentUserIsTenantAdmin();
	const templateRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		COURSE_TEMPLATES_COLLECTION,
		courseId
	);
	await deleteDoc(templateRef);
}

export async function seedDemoCourseTemplate() {
	return createOrUpdateCourseTemplate(DEMO_COURSE_TEMPLATE_SEED);
}