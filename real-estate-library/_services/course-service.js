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
			videoUrl: "https://www.youtube.com/watch?v=5NV6Rdv1a3I",
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
			videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
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
					videoUrl: "https://www.youtube.com/watch?v=60ItHLz5WEA",
					instructions: [
						"Log into Salesforce and navigate to the Leads tab.",
						"Click 'New' and enter the client's full name, company, and contact information.",
						"Set the lead status, industry, and next activity date for follow-up reminders.",
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
					videoUrl: "https://www.youtube.com/watch?v=CevxZvSJLk8",
					instructions: [
						"Open HubSpot and go to Contacts → Create Contact.",
						"Fill in email, phone, and property preferences.",
						"Use the 'Tasks' sidebar to schedule follow-up calls and showings.",
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
					videoUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
					instructions: [
						"Launch Zoho CRM and create a new Contact record.",
						"Populate the required fields: Name, Email, Phone, and Search Criteria.",
						"Attach any documents or notes related to the client's requirements.",
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
					videoUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
					instructions: [
						"In Propertybase, create a new Buyer profile with contact details.",
						"Link their preferred search criteria to trigger automatic MLS alerts.",
						"Set up a follow-up workflow with milestones and commission tracking.",
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
			videoUrl: "https://www.youtube.com/watch?v=YQHsXMglC9A",
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
					videoUrl: "https://www.youtube.com/watch?v=hT_nvWreIhg",
					instructions: [
						"Access your regional MLS system and select 'New Listing'.",
						"Enter property address, price, beds/baths, and detailed description.",
						"Upload and arrange photos in order of visual appeal.",
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
					videoUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
					instructions: [
						"Navigate to the Zillow for Professionals dashboard.",
						"Enter listing details and import photos from your camera or cloud storage.",
						"Publish to generate Zestimate and capture buyer inquiries.",
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
					videoUrl: "https://www.youtube.com/watch?v=09R8_2nJtjg",
					instructions: [
						"Log into Realtor.com's agent portal with your NAR credentials.",
						"Add a new property and fill in MLS-verified information.",
						"Sync your listing across multiple portals with one click.",
					],
				},
				{
					id: "flexmls",
					name: "Flex MLS",
					description: "Advanced MLS platform with mobile tools",
					category: "MLS Systems",
					features: ["Mobile app", "Photo management", "Open house tools", "CMA reports"],
					videoUrl: "https://www.youtube.com/watch?v=e-ORhEE9VVg",
					instructions: [
						"Use Flex MLS's mobile app to create a listing on-site at the property.",
						"Organize photos and add virtual tour links directly in the app.",
						"Set open house dates and receive notifications of showing requests.",
					],
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
			videoUrl: "https://www.youtube.com/watch?v=450p7goxZqg",
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
					videoUrl: "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
					instructions: [
						"In DocuSign, upload the listing agreement PDF.",
						"Place signature fields in correct locations and assign roles.",
						"Send via email and track when all parties have signed.",
					],
				},
				{
					id: "adobe-sign",
					name: "Adobe Sign",
					description: "Alternative e-signature platform",
					category: "E-Signature",
					features: ["PDF integration", "Advanced security", "Bulk sending", "API access"],
					videoUrl: "https://www.youtube.com/watch?v=RubBzkZzpUA",
					instructions: [
						"Open Adobe Sign and drag your document onto the canvas.",
						"Click signature fields to mark text form fields and signatures.",
						"Configure bulk sending for multiple signers if needed.",
					],
				},
				{
					id: "hellosign",
					name: "HelloSign",
					description: "Simple document signing solution",
					category: "E-Signature",
					features: ["Easy setup", "Team management", "Audit trails", "Mobile signing"],
					videoUrl: "https://www.youtube.com/watch?v=ktvTqknDobU",
					instructions: [
						"In HelloSign, click 'Send' and upload your document.",
						"Add signers' emails and set the signing order.",
						"Customize the signing experience and send for signatures.",
					],
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
					videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
					instructions: [
						"Create a new transaction loop in DotLoop with property details.",
						"Upload all required documents into the transaction checklist.",
						"Assign tasks to team members and track document signatures in real-time.",
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

function isFirestoreErrorCode(error, code) {
	return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

function buildTenantCollectionPath(tenantId, collectionName) {
	return collection(db, TENANTS_COLLECTION, tenantId, collectionName);
}

function calculateProgressPercent(template, enrollment) {
	const steps = template?.steps ?? [];
	const hasQuiz = Boolean(template?.quiz?.questions?.length);
	const totalUnits = steps.length + (hasQuiz ? 1 : 0);

	if (totalUnits === 0) {
		return 0;
	}

	if (enrollment?.status === "completed" || enrollment?.completedAt) {
		return 100;
	}

	const completedSteps = steps.filter((step) => Boolean(enrollment?.stepProgress?.[step.id]?.completedAt)).length;
	const completedQuiz = hasQuiz && Boolean(enrollment?.quiz?.lastAttemptAt) ? 1 : 0;
	const completedUnits = completedSteps + completedQuiz;

	return Math.min(100, Math.round((completedUnits / totalUnits) * 100));
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
		status: enrollment.status === "completed" ? "completed" : "in_progress",
		currentStepId: nextStep?.id ?? stepId,
		currentStepOrder: nextStep?.order ?? steps[currentStepIndex].order,
		[`stepProgress.${stepId}.completedAt`]: serverTimestamp(),
		[`stepProgress.${stepId}.updatedAt`]: serverTimestamp(),
	};

	if (!enrollment.stepProgress?.[stepId]?.selectedSoftwareId) {
		payload[`stepProgress.${stepId}.selectedSoftwareId`] = steps[currentStepIndex].defaultSoftwareId ?? null;
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
		const previousBestScore = enrollment.quiz?.score ?? null;
		const bestScore =
			typeof previousBestScore === "number" ? Math.max(previousBestScore, score) : score;
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
			completedAt: hasCompletedAt ? enrollment.completedAt : passed ? serverTimestamp() : null,
			updatedAt: serverTimestamp(),
			quiz: {
				passed: passed || Boolean(enrollment.quiz?.passed),
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
}

export async function addTenantAdminByEmail(email) {
	const context = await assertCurrentUserIsTenantAdmin();
	const usersRef = collection(db, USERS_COLLECTION);
	const usersQuery = query(usersRef, where("email", "==", email), limit(1));
	const snapshot = await getDocs(usersQuery);

	if (snapshot.empty) {
		throw new Error(
			"No registered user found with that email. They must sign in at least once first."
		);
	}

	const targetUid = snapshot.docs[0].id;
	const adminRef = doc(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		ADMINS_COLLECTION,
		targetUid
	);

	await setDoc(
		adminRef,
		{
			uid: targetUid,
			email,
			createdAt: serverTimestamp(),
		},
		{ merge: true }
	);

	return targetUid;
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

export const DEMO_COURSE_TEMPLATE_SEED_2 = {
	id: "buyer-representation-basics-template",
	title: "Buyer Representation Basics",
	category: "Buyer Services",
	level: "Intermediate",
	duration: "3 hours",
	description:
		"Master the complete buyer-side real estate workflow, from initial intake to a successful closing.",
	status: "published",
	version: 1,
	tags: ["Buyer Services", "Onboarding", "Transaction Workflow"],
	skills: ["Client Communication", "Offer Preparation", "Transaction Management"],
	steps: [
		{
			id: "buyer-intake",
			order: 1,
			title: "Buyer Intake & CRM Setup",
			description:
				"Capture the buyer's needs, budget, and timeline in your CRM and prepare the representation agreement.",
			videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
			instructions: [
				"Create a new buyer contact record in your CRM.",
				"Record search criteria, budget range, and preferred locations.",
				"Send the buyer representation agreement for signature.",
			],
			softwareOptions: [
				{
					id: "salesforce-buyer",
					name: "Salesforce CRM",
					description: "Track buyer profiles and communication history",
					category: "CRM Platforms",
					isRecommended: true,
					features: [
						"Contact management",
						"Task reminders",
						"Email integration",
						"Pipeline tracking",
					],
					videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
					instructions: [
						"Log into Salesforce Account and go to Accounts tab.",
						"Create a new Account for the buyer with their budget and preferences.",
						"Create multiple Opportunities for each property type they're interested in.",
					],
				},
				{
					id: "hubspot-buyer",
					name: "HubSpot CRM",
					description: "Free CRM with strong email and meeting tools",
					category: "CRM Platforms",
					features: [
						"Free tier available",
						"Meeting scheduler",
						"Email tracking",
						"Deal stages",
					],
					videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
					instructions: [
						"Open HubSpot and create a new Company for the buyer.",
						"Add contacts and link them to the company.",
						"Set up a Deal pipeline with stages: Initial Meeting, Pre-Approved, Offer, Closed.",
					],
				},
				{
					id: "propertybase-buyer",
					name: "Propertybase",
					description: "Real estate CRM with built-in buyer workflow tools",
					category: "Real Estate CRM",
					features: [
						"MLS search integration",
						"Buyer match alerts",
						"Transaction tracking",
						"Commission management",
					],
					videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
					instructions: [
						"In Propertybase, create a Buyer Profile with contact information.",
						"Link saved searches to auto-generate property alerts.",
						"Set up the buyer's commission structure and tracking parameters.",
					],
				},
			],
			defaultSoftwareId: "salesforce-buyer",
			resources: [
				{
					label: "Buyer intake checklist",
					url: "https://example.com/buyer-intake-checklist",
					type: "link",
				},
			],
		},
		{
			id: "property-search",
			order: 2,
			title: "Property Search & Showings",
			description:
				"Use MLS and listing platforms to identify matching properties, schedule showings, and gather client feedback.",
			videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
			instructions: [
				"Build an MLS search using the buyer's criteria.",
				"Set up automated listing alerts for new matches.",
				"Schedule and confirm showings, then log buyer feedback.",
			],
			softwareOptions: [
				{
					id: "mls-search",
					name: "MLS Platform",
					description: "Search and filter property listings on the MLS",
					category: "MLS Systems",
					isRecommended: true,
					features: [
						"Advanced search filters",
						"Saved searches",
						"Automated alerts",
						"Showing scheduler",
					],
					videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
					instructions: [
						"Access your regional MLS and create a new Saved Search.",
						"Set search parameters: price range, beds/baths, location, property type.",
						"Configure daily or weekly email alerts to the buyer with new listings.",
					],
				},
				{
					id: "zillow-search",
					name: "Zillow",
					description: "Consumer-facing search tool with additional market data",
					category: "Listing Platforms",
					features: [
						"Zestimate data",
						"Neighborhood info",
						"3D tours",
						"School ratings",
					],
					videoUrl: "https://www.youtube.com/watch?v=2d2UgQM5r0U",
					instructions: [
						"Use Zillow's Saved Searches to create buyer-specific results.",
						"Share links to properties and price trends with buyers.",
						"Review Zestimate data and neighborhood ratings with the buyer.",
					],
				},
				{
					id: "realtor-search",
					name: "Realtor.com",
					description: "NAR-affiliated platform with accurate listing data",
					category: "Listing Platforms",
					features: [
						"Accurate listing data",
						"Open house info",
						"Agent contact tools",
						"Market trends",
					],
					videoUrl: "https://www.youtube.com/watch?v=VZnPGnlJ9Rw",
					instructions: [
						"Create an account on Realtor.com Agent Portal.",
						"Build searches based on buyer preferences.",
						"Track Open House schedules and download property reports.",
					],
				},
			],
			defaultSoftwareId: "mls-search",
			resources: [
				{
					label: "Showing feedback form",
					url: "https://example.com/showing-feedback",
					type: "link",
				},
			],
		},
		{
			id: "offer-preparation",
			order: 3,
			title: "Offer Preparation & Submission",
			description:
				"Prepare a competitive purchase offer, collect buyer signatures, and submit to the listing agent.",
			videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
			instructions: [
				"Complete the purchase agreement with all required fields.",
				"Attach proof of funds or pre-approval letter.",
				"Obtain buyer signatures and submit to listing agent.",
			],
			softwareOptions: [
				{
					id: "docusign-offer",
					name: "DocuSign",
					description: "Collect and send electronic signatures for offer documents",
					category: "E-Signature",
					isRecommended: true,
					features: [
						"Template library",
						"Mobile signing",
						"Audit trail",
						"Deadline reminders",
					],
					videoUrl: "https://www.youtube.com/watch?v=Ks-_Mh1QhMc",
					instructions: [
						"Open DocuSign and upload the purchase agreement.",
						"Add Signature tabs, Initial tabs, and Date tabs in correct locations.",
						"Send to buyer and listing agent with role assignments and reminders.",
					],
				},
				{
					id: "dotloop-offer",
					name: "DotLoop",
					description: "Real estate transaction platform for offer management",
					category: "Transaction Management",
					features: [
						"Offer packaging",
						"In-app editing",
						"Brokerage compliance",
						"Client sharing",
					],
					videoUrl: "https://www.youtube.com/watch?v=TYzf2grPP-Q",
					instructions: [
						"In DotLoop, create a new Transaction Loop for the property.",
						"Add all offer documents to the checklist.",
						"Set signing rules and submit the complete loop to the listing agent.",
					],
				},
			],
			defaultSoftwareId: "docusign-offer",
			resources: [
				{
					label: "Offer submission checklist",
					url: "https://example.com/offer-checklist",
					type: "link",
				},
			],
		},
		{
			id: "closing-coordination",
			order: 4,
			title: "Closing Coordination",
			description:
				"Guide the buyer through inspections, contingencies, and the final closing process.",
			videoUrl: "https://www.youtube.com/watch?v=DLzxrzFCyec",
			instructions: [
				"Order inspections and review reports with the buyer.",
				"Track and clear all contingencies before closing.",
				"Coordinate with the title company and attend the final closing.",
			],
			softwareOptions: [
				{
					id: "dotloop-closing",
					name: "DotLoop",
					description: "Manage closing tasks, documents, and deadlines",
					category: "Transaction Management",
					isRecommended: true,
					features: [
						"Task checklists",
						"Deadline tracking",
						"Document storage",
						"Team collaboration",
					],
					videoUrl: "https://www.youtube.com/watch?v=xo9d_8WRH6A",
					instructions: [
						"Update the DotLoop checklist with inspection and appraisal tasks.",
						"Track contingency removal deadlines and closing date.",
						"Coordinate document uploads with the title company and lender.",
					],
				},
				{
					id: "docusign-closing",
					name: "DocuSign",
					description: "Finalize closing documents with e-signatures",
					category: "E-Signature",
					features: [
						"Bulk document sending",
						"Identity verification",
						"Real-time status",
						"Secure storage",
					],
					videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
					instructions: [
						"Prepare closing documents in DocuSign: closing disclosure, deed, title docs.",
						"Set up signing order: buyer first, then notary, then lender.",
						"Send links to buyers and monitor signature completion in real-time.",
					],
				},
				{
					id: "hellosign-closing",
					name: "HelloSign",
					description: "Simple e-signature option for closing paperwork",
					category: "E-Signature",
					features: [
						"Easy to use",
						"Audit trails",
						"Team accounts",
						"API access",
					],
					videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
					instructions: [
						"Upload final closing documents to HelloSign.",
						"Assign signature roles and set signing order.",
						"Send and wait for buyer and notary signatures; download signed PDFs.",
					],
				},
			],
			defaultSoftwareId: "dotloop-closing",
			resources: [
				{
					label: "Closing day checklist",
					url: "https://example.com/closing-checklist",
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
				question: "What is the first step in the buyer representation workflow?",
				options: ["Submit an offer", "Schedule showings", "Capture the buyer's needs in a CRM"],
				correctAnswerIndex: 2,
			},
			{
				id: "q2",
				question: "What should you set up to notify buyers about new matching listings?",
				options: ["Automated MLS alerts", "A printed newsletter", "A social media post"],
				correctAnswerIndex: 0,
			},
			{
				id: "q3",
				question: "What document must be attached when submitting an offer?",
				options: ["Tax return", "Pre-approval letter or proof of funds", "Property inspection report"],
				correctAnswerIndex: 1,
			},
			{
				id: "q4",
				question: "What must be cleared before closing can occur?",
				options: ["Social media announcements", "All contingencies", "The seller's moving schedule"],
				correctAnswerIndex: 1,
			},
			{
				id: "q5",
				question: "Which platform is recommended for managing closing tasks and deadlines?",
				options: ["Zillow", "MLS Platform", "DotLoop"],
				correctAnswerIndex: 2,
			},
		],
	},
};

export async function seedDemoCourseTemplate2() {
	return createOrUpdateCourseTemplate(DEMO_COURSE_TEMPLATE_SEED_2);
}