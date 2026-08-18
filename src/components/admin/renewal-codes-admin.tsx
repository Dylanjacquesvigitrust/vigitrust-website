"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type RenewalCodeRecord = {
  id: string;
  code: string;
  codeFormatted: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string;
  status: "unused" | "used" | "expired";
  externalReferenceId: string | null;
  productType: string | null;
  createdAt: string;
};

const STATUS_OPTIONS: RenewalCodeRecord["status"][] = ["unused", "used", "expired"];

export function RenewalCodesAdmin() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [codes, setCodes] = useState<RenewalCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newExternalId, setNewExternalId] = useState("");
  const [newCode, setNewCode] = useState("");
  const [drafts, setDrafts] = useState<
    Record<string, { externalReferenceId: string; status: RenewalCodeRecord["status"] }>
  >({});

  const loadCodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (statusFilter) params.set("status", statusFilter);

    try {
      const response = await fetch(`/api/admin/renewal-codes?${params.toString()}`);
      const data = (await response.json()) as {
        codes?: RenewalCodeRecord[];
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not load renewal codes.");
        setCodes([]);
        return;
      }

      const nextCodes = data.codes ?? [];
      setCodes(nextCodes);
      setDrafts(
        Object.fromEntries(
          nextCodes.map((code) => [
            code.id,
            {
              externalReferenceId: code.externalReferenceId ?? "",
              status: code.status,
            },
          ]),
        ),
      );
    } catch {
      setError("Could not load renewal codes.");
      setCodes([]);
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    void loadCodes();
  }, [loadCodes]);

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadCodes();
  }

  async function saveCode(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/renewal-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalReferenceId: draft.externalReferenceId.trim() || null,
          status: draft.status,
        }),
      });

      const data = (await response.json()) as {
        code?: RenewalCodeRecord;
        error?: string;
      };

      if (!response.ok || !data.code) {
        setError(data.error ?? "Could not save changes.");
        return;
      }

      setCodes((current) => current.map((item) => (item.id === id ? data.code! : item)));
      setDrafts((current) => ({
        ...current,
        [id]: {
          externalReferenceId: data.code!.externalReferenceId ?? "",
          status: data.code!.status,
        },
      }));
    } catch {
      setError("Could not save changes.");
    } finally {
      setSavingId(null);
    }
  }

  async function createCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/renewal-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: newEmail.trim(),
          externalReferenceId: newExternalId.trim() || null,
          code: newCode.trim() || null,
        }),
      });

      const data = (await response.json()) as {
        code?: RenewalCodeRecord;
        error?: string;
      };

      if (!response.ok || !data.code) {
        setCreateError(data.error ?? "Could not create renewal code.");
        return;
      }

      setNewEmail("");
      setNewExternalId("");
      setNewCode("");
      await loadCodes();
    } catch {
      setCreateError("Could not create renewal code.");
    } finally {
      setCreating(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createCode}
        className="grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-vt-border sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="text-sm font-semibold text-vt-ink">Add a code manually</p>
          <p className="mt-1 text-xs text-vt-muted">
            Leave the code blank to auto-generate a 16-character code. Stripe payments still
            create codes automatically.
          </p>
        </div>
        <label className="text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
            Customer email
          </span>
          <input
            type="email"
            required
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="customer@email.com"
            className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          />
        </label>
        <label className="text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
            External reference ID
          </span>
          <input
            value={newExternalId}
            onChange={(event) => setNewExternalId(event.target.value)}
            placeholder="Optional"
            className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          />
        </label>
        <label className="text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
            Renewal code
          </span>
          <input
            value={newCode}
            onChange={(event) => setNewCode(event.target.value)}
            placeholder="Blank = auto"
            className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          />
        </label>
        <div className="flex items-end">
          <Button type="submit" disabled={creating} className="w-full">
            {creating ? "Adding…" : "Add code"}
          </Button>
        </div>
        {createError ? (
          <p className="sm:col-span-2 lg:col-span-4 text-sm text-vt-red">{createError}</p>
        ) : null}
      </form>

      <form
        onSubmit={onSearch}
        className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-vt-border sm:flex-row sm:items-end"
      >
        <label className="flex-1 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
            Search
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Code, email, Stripe ID, external reference…"
            className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          />
        </label>
        <label className="sm:w-44 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        <Button type="button" variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </form>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-vt-red ring-1 ring-red-100">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-vt-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-vt-border bg-vt-mist/70 text-xs uppercase tracking-wider text-vt-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Stripe session</th>
              <th className="px-4 py-3">Payment intent</th>
              <th className="px-4 py-3">External ref</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-vt-muted">
                  Loading…
                </td>
              </tr>
            ) : codes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-vt-muted">
                  No renewal codes found.
                </td>
              </tr>
            ) : (
              codes.map((code) => {
                const draft = drafts[code.id];
                return (
                  <tr key={code.id} className="border-b border-vt-border align-top">
                    <td className="px-4 py-4">
                      <p className="font-mono font-semibold text-vt-navy">{code.codeFormatted}</p>
                      <p className="mt-1 text-xs text-vt-muted">{code.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{code.customerEmail}</p>
                      {code.productType ? (
                        <p className="mt-1 text-xs text-vt-muted">{code.productType}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {code.stripeCheckoutSessionId.startsWith("manual_")
                        ? "Manual"
                        : code.stripeCheckoutSessionId}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {code.stripePaymentIntentId ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <input
                        value={draft?.externalReferenceId ?? ""}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [code.id]: {
                              externalReferenceId: event.target.value,
                              status: draft?.status ?? code.status,
                            },
                          }))
                        }
                        placeholder="External renewal ID"
                        className="w-full min-w-[12rem] rounded-lg border border-vt-border px-2 py-1.5 text-xs outline-none ring-vt-navy/20 focus:ring-2"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={draft?.status ?? code.status}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [code.id]: {
                              externalReferenceId:
                                draft?.externalReferenceId ?? code.externalReferenceId ?? "",
                              status: event.target.value as RenewalCodeRecord["status"],
                            },
                          }))
                        }
                        className="rounded-lg border border-vt-border px-2 py-1.5 text-xs outline-none ring-vt-navy/20 focus:ring-2"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-xs text-vt-muted">
                      {new Date(code.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="soft"
                        disabled={savingId === code.id}
                        onClick={() => void saveCode(code.id)}
                      >
                        {savingId === code.id ? "Saving…" : "Save"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
