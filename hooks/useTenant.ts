import { useState, useEffect, useCallback } from "react";
import { isFirebaseConfigured, auth, db } from "../lib/firebase";
import {
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import {
  createTenant as createTenantDoc,
  listMyTenantMemberships,
  type TenantMembership,
} from "../lib/tenancy";

export function useTenant() {
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMemberships = useCallback(async (currentUser: User) => {
    if (!db) return;
    try {
      setMemberships(await listMyTenantMemberships(db, currentUser.uid));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tenant memberships.");
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }
    const firebaseAuth = auth;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser);
      // The anonymous uid used elsewhere for phenotype donation has no
      // durable identity to invite anyone by, so it can't hold tenant
      // memberships — only look those up for a real sign-in.
      if (currentUser && !currentUser.isAnonymous) {
        await refreshMemberships(currentUser);
      } else {
        setMemberships([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [refreshMemberships]);

  // Upgrades the current session to a real, invitable identity (email),
  // linking it to the existing anonymous uid where possible so any prior
  // anonymous activity under that uid isn't orphaned.
  const signInForTenantAccess = useCallback(async (): Promise<User> => {
    if (!auth) throw new Error("Firebase is not configured.");
    const provider = new GoogleAuthProvider();
    const current = auth.currentUser;
    try {
      const credential = current?.isAnonymous
        ? await linkWithPopup(current, provider)
        : await signInWithPopup(auth, provider);
      setUser(credential.user);
      await refreshMemberships(credential.user);
      return credential.user;
    } catch (err: unknown) {
      // That Google account is already linked to a different uid elsewhere
      // (e.g. a previous session on another device) — sign into that one instead.
      const code = (err as { code?: string } | null)?.code;
      if (code === "auth/credential-already-in-use") {
        const credential = await signInWithPopup(auth, provider);
        setUser(credential.user);
        await refreshMemberships(credential.user);
        return credential.user;
      }
      throw err;
    }
  }, [refreshMemberships]);

  const createTenant = useCallback(
    async (name: string): Promise<string> => {
      if (!db || !user) throw new Error("Sign in before creating a tenant.");
      if (user.isAnonymous) throw new Error("Upgrade to a real sign-in before creating a tenant.");
      const tenantId = await createTenantDoc(db, user.uid, user.email, name);
      await refreshMemberships(user);
      return tenantId;
    },
    [user, refreshMemberships]
  );

  return { user, memberships, loading, error, signInForTenantAccess, createTenant };
}
