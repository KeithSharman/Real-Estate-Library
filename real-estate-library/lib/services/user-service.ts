import { auth, db } from "@/lib/firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";

/**
 * User and tenant-context service.
 *
 * This module is the entry point for any operation that needs:
 * 1) an authenticated Firebase user,
 * 2) a user profile document in users/{uid}, and
 * 3) the active tenant membership for multi-tenant data access.
 */

const USERS_COLLECTION = "users";
const TENANTS_COLLECTION = "tenants";
const ADMINS_COLLECTION = "admins";

const DEFAULT_BOOTSTRAP_TENANT_ID =
	process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "tenant-acme";

/**
 * Ensures a Firebase Auth user exists in memory before data access.
 * Throws when called from a signed-out client session.
 */
function requireAuthenticatedUser() {
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("You must be signed in to access course data.");
	}

	return currentUser;
}

/**
 * Ensures users/{uid} exists and always has a tenantId.
 *
 * On first sign-in, a profile document is created with default tenant membership.
 * For older profiles missing tenantId, this backfills tenantId so downstream calls
 * can resolve tenant-scoped collections safely.
 */
export async function ensureCurrentUserProfile(options: { tenantId?: string } = {}) {
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

/**
 * Returns the canonical context used by all tenant-scoped services.
 *
 * The returned object centralizes uid + tenantId so feature services do not need
 * to repeat auth/profile lookups on every operation.
 */
export async function getCurrentUserContext(options: { tenantId?: string } = {}) {
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

/**
 * Checks whether the current user is listed as an admin for the active tenant.
 */
export async function isCurrentUserTenantAdmin(
	existingContext?: Awaited<ReturnType<typeof getCurrentUserContext>>
) {
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

/**
 * Convenience helper used during tenant bootstrap flows.
 *
 * Firestore rules still decide whether this write is permitted.
 */
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

/**
 * Grants tenant-admin access to an existing signed-in user by email.
 *
 * Users must sign in at least once so a users/{uid} document exists.
 */
export async function addTenantAdminByEmail(email: string) {
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

/**
 * Guards admin-only actions in service modules.
 * Returns tenant context for callers after authorization succeeds.
 */
export async function assertCurrentUserIsTenantAdmin(
	existingContext?: Awaited<ReturnType<typeof getCurrentUserContext>>
) {
	const context = existingContext ?? (await getCurrentUserContext());
	const isAdmin = await isCurrentUserTenantAdmin(context);

	if (!isAdmin) {
		throw new Error("Only tenant admins can manage course templates.");
	}

	return context;
}
