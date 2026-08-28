"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

type CourseSummary = {
  courseSlug: string;
  courseTitle: string;
  totalPurchased: number;
  totalAssigned: number;
  totalRemaining: number;
};

type EmployeeRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseSlug: string;
  licenceStatus: string;
  trainingStatus: string;
  completedAt: string | null;
  provisioningError: string | null;
};

export default function ManagerDashboardPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(withBasePath("/api/manager/dashboard"));
      const data = (await res.json()) as {
        courses?: CourseSummary[];
        employees?: EmployeeRow[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to load dashboard.");
      setCourses(data.courses ?? []);
      setEmployees(data.employees ?? []);
      if (!selectedCourse && data.courses?.length) {
        setSelectedCourse(data.courses[0].courseSlug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onAddEmployee(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(withBasePath("/api/manager/dashboard"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: form.get("courseSlug") ?? selectedCourse,
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to add employee.");
      (e.target as HTMLFormElement).reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add employee.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRetry(assignmentId: string) {
    setError(null);
    const res = await fetch(withBasePath("/api/manager/dashboard"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retry", assignmentId }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Retry failed.");
      return;
    }
    await load();
  }

  async function onLogout() {
    await fetch(withBasePath("/api/manager/login"), { method: "DELETE" });
    window.location.href = "/manager/login/";
  }

  if (loading) {
    return <div className="section-pad text-center text-vt-muted">Loading dashboard…</div>;
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="type-eyebrow text-vt-red">Manager portal</p>
            <h1 className="brand-display text-3xl text-vt-ink">Training licences</h1>
          </div>
          <Button variant="ghost" type="button" onClick={() => void onLogout()}>
            Sign out
          </Button>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-vt-red/30 bg-vt-red-soft px-3 py-2 text-sm text-vt-red">
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {courses.map((c) => (
            <div key={c.courseSlug} className="rounded-2xl bg-white p-6 ring-1 ring-vt-border">
              <h2 className="text-lg font-bold text-vt-ink">{c.courseTitle}</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-vt-muted">Purchased</dt>
                  <dd className="font-semibold">{c.totalPurchased}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-vt-muted">Assigned</dt>
                  <dd className="font-semibold">{c.totalAssigned}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-vt-muted">Remaining</dt>
                  <dd className="font-bold text-vt-red">{c.totalRemaining}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {courses.length === 0 ? (
          <p className="mt-8 text-vt-muted">No training licences found for your account yet.</p>
        ) : (
          <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-vt-border">
            <h2 className="text-lg font-bold text-vt-ink">Add employee</h2>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={onAddEmployee}>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium" htmlFor="courseSlug">
                  Course
                </label>
                <select
                  id="courseSlug"
                  name="courseSlug"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
                >
                  {courses.map((c) => (
                    <option key={c.courseSlug} value={c.courseSlug}>
                      {c.courseTitle} ({c.totalRemaining} remaining)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding…" : "Add employee"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-vt-border">
          <h2 className="text-lg font-bold text-vt-ink">Employees</h2>
          {employees.length === 0 ? (
            <p className="mt-4 text-sm text-vt-muted">No employees assigned yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-vt-border text-vt-muted">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Course</th>
                    <th className="py-2 pr-4">Licence</th>
                    <th className="py-2 pr-4">Training</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id} className="border-b border-vt-border/60">
                      <td className="py-3 pr-4">
                        {e.firstName} {e.lastName}
                      </td>
                      <td className="py-3 pr-4">{e.email}</td>
                      <td className="py-3 pr-4">{e.courseSlug}</td>
                      <td className="py-3 pr-4 capitalize">{e.licenceStatus}</td>
                      <td className="py-3 pr-4 capitalize">
                        {e.trainingStatus.replace("_", " ")}
                        {e.completedAt
                          ? ` (${new Date(e.completedAt).toLocaleDateString()})`
                          : ""}
                      </td>
                      <td className="py-3">
                        {e.licenceStatus === "failed" ? (
                          <button
                            type="button"
                            className="text-sm font-semibold text-vt-red hover:underline"
                            onClick={() => void onRetry(e.id)}
                          >
                            Retry
                          </button>
                        ) : null}
                        {e.provisioningError ? (
                          <p className="mt-1 text-xs text-vt-muted">{e.provisioningError}</p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
