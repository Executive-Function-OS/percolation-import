"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, LogIn, Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useTenant } from "@/hooks/useTenant";
import type { TenantRole } from "@/lib/tenancy";

export default function WorkspacePage() {
  const {
    user,
    memberships,
    tenantDetails,
    loading,
    error,
    signInForTenantAccess,
    createTenant,
    addMember,
    removeMember,
  } = useTenant();

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newTenantName, setNewTenantName] = useState("");
  const [memberForms, setMemberForms] = useState<Record<string, { uid: string; role: TenantRole }>>({});

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <p className="text-slate-600 text-sm max-w-sm text-center">
          Firebase isn&apos;t configured in this environment (missing
          NEXT_PUBLIC_FIREBASE_* variables), so the tenant scaffold has
          nothing to talk to here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-brand-blue" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Workspace (debug)</h1>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 mt-10 space-y-8">
        <p className="text-sm text-slate-500">
          Internal panel for exercising the multi-tenant scaffold end to end — not linked from
          navigation, not indexed. Sign in, create a workspace, and confirm it shows up below.
        </p>

        {loading && <p className="text-sm text-slate-500">Loading…</p>}

        {!loading && (!user || user.isAnonymous) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sign in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                Workspace membership needs a real, invitable identity — the anonymous session used
                elsewhere on the site can&apos;t be invited to anything.
              </p>
              <Button
                disabled={busy}
                onClick={() => runAction(async () => { await signInForTenantAccess(); })}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign in with Google
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && user && !user.isAnonymous && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signed in</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                <p>{user.email}</p>
                <p className="text-xs text-slate-400 font-mono">{user.uid}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create a workspace</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTenantName.trim()) return;
                    runAction(async () => {
                      await createTenant(newTenantName.trim());
                      setNewTenantName("");
                    });
                  }}
                >
                  <Input
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="Workspace name"
                    disabled={busy}
                  />
                  <Button type="submit" disabled={busy || !newTenantName.trim()} className="flex items-center gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Create
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Your workspaces ({memberships.length})
              </h2>

              {memberships.length === 0 && (
                <p className="text-sm text-slate-400">None yet — create one above to test the round trip.</p>
              )}

              {memberships.map((m) => {
                const tenant = tenantDetails[m.tenantId];
                const form = memberForms[m.tenantId] ?? { uid: "", role: "member" as TenantRole };
                return (
                  <Card key={m.tenantId}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{tenant?.name ?? m.tenantId}</span>
                        <span className="text-xs font-normal uppercase tracking-wide text-slate-400">{m.role}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-slate-400 font-mono">{m.tenantId}</p>

                      {m.role === "owner" && (
                        <form
                          className="flex flex-wrap gap-2 items-center"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!form.uid.trim()) return;
                            runAction(async () => {
                              await addMember(m.tenantId, form.uid.trim(), null, form.role);
                              setMemberForms((prev) => ({ ...prev, [m.tenantId]: { uid: "", role: "member" } }));
                            });
                          }}
                        >
                          <Input
                            value={form.uid}
                            onChange={(e) =>
                              setMemberForms((prev) => ({ ...prev, [m.tenantId]: { ...form, uid: e.target.value } }))
                            }
                            placeholder="Member's Firebase UID"
                            disabled={busy}
                            className="max-w-xs"
                          />
                          <select
                            value={form.role}
                            onChange={(e) =>
                              setMemberForms((prev) => ({
                                ...prev,
                                [m.tenantId]: { ...form, role: e.target.value as TenantRole },
                              }))
                            }
                            disabled={busy}
                            className="border border-slate-200 rounded-md px-2 py-1.5 text-sm"
                          >
                            <option value="member">member</option>
                            <option value="owner">owner</option>
                          </select>
                          <Button type="submit" disabled={busy || !form.uid.trim()} variant="outline" className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Add
                          </Button>
                          {m.memberUid !== user.uid && (
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={busy}
                              onClick={() => runAction(async () => { await removeMember(m.tenantId, m.memberUid); })}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" /> Leave
                            </Button>
                          )}
                        </form>
                      )}

                      <p className="text-xs text-slate-400">
                        Note: inviting by UID only — there&apos;s no lookup-by-email backend yet, so
                        you&apos;d need the other person&apos;s Firebase UID to add them today.
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {(error || actionError) && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error ?? actionError}
          </p>
        )}
      </main>
    </div>
  );
}
