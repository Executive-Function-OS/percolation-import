// Foundational multi-tenant/workspace model. Establishes who belongs to which
// tenant and enforces isolation at the database level (see firestore.rules),
// ahead of any specific collaboration feature being built on top of it.
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type FieldValue,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";

export type TenantRole = "owner" | "member";

export interface TenantMembership {
  tenantId: string;
  memberUid: string;
  email: string | null;
  role: TenantRole;
  addedAt: Timestamp | FieldValue;
}

/** Creates a tenant and adds the caller as its first owner. */
export async function createTenant(
  db: Firestore,
  ownerUid: string,
  ownerEmail: string | null,
  name: string
): Promise<string> {
  const tenantRef = doc(collection(db, "tenants"));
  await setDoc(tenantRef, {
    name: name.trim(),
    createdBy: ownerUid,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, "tenants", tenantRef.id, "members", ownerUid), {
    tenantId: tenantRef.id,
    memberUid: ownerUid,
    email: ownerEmail,
    role: "owner" as TenantRole,
    addedAt: serverTimestamp(),
  });
  return tenantRef.id;
}

/** Adds or updates a member. Rejected by firestore.rules unless the caller is an owner. */
export async function setTenantMember(
  db: Firestore,
  tenantId: string,
  memberUid: string,
  email: string | null,
  role: TenantRole
): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "members", memberUid), {
    tenantId,
    memberUid,
    email,
    role,
    addedAt: serverTimestamp(),
  });
}

/** Removes a member. Rejected by firestore.rules unless the caller is an owner. */
export async function removeTenantMember(db: Firestore, tenantId: string, memberUid: string): Promise<void> {
  await deleteDoc(doc(db, "tenants", tenantId, "members", memberUid));
}

/** Lists every tenant the given uid belongs to, via a collection-group query on membership docs. */
export async function listMyTenantMemberships(db: Firestore, uid: string): Promise<TenantMembership[]> {
  const q = query(collectionGroup(db, "members"), where("memberUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as TenantMembership);
}
