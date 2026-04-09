"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/_utils/firebase";

const AUTH_COOKIE_NAME = "firebaseAuth";

function setAuthCookie(value: string, maxAgeSeconds: number) {
  document.cookie = `${AUTH_COOKIE_NAME}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export default function AuthSessionSync() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        clearAuthCookie();
        return;
      }

      try {
        const token = await user.getIdToken();
        // Middleware only checks existence for redirect UX; Firestore rules enforce data access.
        setAuthCookie(encodeURIComponent(token), 60 * 60);
      } catch {
        clearAuthCookie();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}