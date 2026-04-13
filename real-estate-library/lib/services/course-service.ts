import { db } from "@/lib/firebase";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import {
	assertCurrentUserIsTenantAdmin,
	getCurrentUserContext,
	isCurrentUserTenantAdmin,
} from "@/lib/services/user-service";
import {
	DEMO_COURSE_TEMPLATE_SEED,
	DEMO_COURSE_TEMPLATE_SEED_2,
} from "@/lib/data/course-seeds";

/**
 * Course template service.
 *
 * Responsibilities:
 * - read published templates for learners,
 * - expose admin-only draft/template management,
 * - keep template step ordering deterministic,
 * - seed demo templates for onboarding environments.
 */

const TENANTS_COLLECTION = "tenants";
const COURSE_TEMPLATES_COLLECTION = "courseTemplates";

const DEFAULT_BOOTSTRAP_TENANT_ID =
	process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "tenant-acme";

/**
 * Ensures every course step is rendered/saved in explicit order.
 */
export function normalizeSteps(steps: unknown[] = []) {
	return [...steps].sort(
		(a, b) =>
			((a as { order?: number }).order ?? 0) - ((b as { order?: number }).order ?? 0)
	);
}

/**
 * Creates stable URL-safe IDs from user-entered titles.
 */
function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

/**
 * Lists published templates for the signed-in user's tenant.
 */
export async function listPublishedCourseTemplates() {
	const { tenantId } = await getCurrentUserContext();
	const templatesRef = collection(
		db,
		TENANTS_COLLECTION,
		tenantId,
		COURSE_TEMPLATES_COLLECTION
	);
	const templatesQuery = query(templatesRef, where("status", "==", "published"));
	const snapshot = await getDocs(templatesQuery);

	return snapshot.docs
		.map((item) => ({ id: item.id, ...item.data() } as { id: string; title?: string; [key: string]: unknown }))
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

/**
 * Lists published templates without requiring auth.
 *
 * Used by public pages (home/catalog) where we still scope to one tenant.
 */
export async function listPublishedCourseTemplatesPublic(
	tenantId = DEFAULT_BOOTSTRAP_TENANT_ID
) {
	const templatesRef = collection(
		db,
		TENANTS_COLLECTION,
		tenantId,
		COURSE_TEMPLATES_COLLECTION
	);
	const templatesQuery = query(templatesRef, where("status", "==", "published"));
	const snapshot = await getDocs(templatesQuery);

	return snapshot.docs
		.map((item) => ({ id: item.id, ...item.data() } as { id: string; title?: string; [key: string]: unknown }))
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

/**
 * Admin-only listing that returns draft and published templates.
 */
export async function listAllCourseTemplatesForTenant() {
	const context = await getCurrentUserContext();
	const isAdmin = await isCurrentUserTenantAdmin(context);

	if (!isAdmin) {
		throw new Error("Only tenant admins can list all templates.");
	}

	const templatesRef = collection(
		db,
		TENANTS_COLLECTION,
		context.tenantId,
		COURSE_TEMPLATES_COLLECTION
	);
	const snapshot = await getDocs(templatesRef);
	return snapshot.docs
		.map((item) => ({ id: item.id, ...item.data() } as { id: string; title?: string; [key: string]: unknown }))
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

/**
 * Gets one template by id.
 *
 * By default, draft templates are hidden from non-admin learner flows.
 */
export async function getCourseTemplate(
	courseId: string,
	options: { includeDraft?: boolean } = {}
) {
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

	const template = { id: snapshot.id, ...snapshot.data() } as {
		id: string;
		status?: string;
		steps?: unknown[];
		[key: string]: unknown;
	};
	template.steps = normalizeSteps(template.steps as unknown[]);

	// Learner pages should only surface published content unless explicitly overridden.
	if (!includeDraft && template.status !== "published") {
		return null;
	}

	return template;
}

/**
 * Creates or updates a tenant-scoped course template.
 *
 * The same function supports both create and edit to keep admin UI simple.
 */
export async function createOrUpdateCourseTemplate(templateInput: {
	id?: string;
	title?: string;
	status?: string;
	version?: number;
	steps?: unknown[];
	[key: string]: unknown;
}) {
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
	const mergedSteps = normalizeSteps(templateInput.steps as unknown[]);

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

/**
 * Toggles draft/published state for one course template.
 */
export async function setCourseTemplatePublishState(
	courseId: string,
	isPublished: boolean
) {
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

/**
 * Permanently removes a course template from the tenant.
 */
export async function removeCourseTemplate(courseId: string) {
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

/**
 * Seeds the first built-in demo course into the current tenant.
 */
export async function seedDemoCourseTemplate() {
	return createOrUpdateCourseTemplate(DEMO_COURSE_TEMPLATE_SEED);
}

/**
 * Seeds the second built-in demo course into the current tenant.
 */
export async function seedDemoCourseTemplate2() {
	return createOrUpdateCourseTemplate(DEMO_COURSE_TEMPLATE_SEED_2);
}
