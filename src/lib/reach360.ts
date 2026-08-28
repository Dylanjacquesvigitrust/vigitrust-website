/**
 * Reach 360 REST API client (server-side only).
 * Docs: https://www.articulatesupport.com/article/Reach-360-Introduction-to-Reach-360-API
 */

const DEFAULT_BASE = "https://api.reach360.com";

export class ReachApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ReachApiError";
  }
}

function getApiKey(): string {
  const key = process.env.REACH360_API_KEY?.trim();
  if (!key) {
    throw new ReachApiError("REACH360_API_KEY is not configured.", 0);
  }
  return key;
}

function getBaseUrl(): string {
  return (process.env.REACH360_API_BASE ?? DEFAULT_BASE).replace(/\/$/, "");
}

export function isReachConfigured(): boolean {
  return Boolean(process.env.REACH360_API_KEY?.trim());
}

async function reachRequest<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  if (text) {
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      json = { raw: text };
    }
  }

  if (!res.ok) {
    const err = json.error as Record<string, unknown> | undefined;
    const message =
      (typeof err?.message === "string" && err.message) ||
      (typeof json.message === "string" && json.message) ||
      `Reach API ${res.status}`;
    const code = typeof err?.code === "string" ? err.code : undefined;
    throw new ReachApiError(message, res.status, code);
  }

  return json as T;
}

export type ReachUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type ReachGroup = {
  id: string;
  name: string;
};

export type ReachInvitation = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  groups?: string[];
};

export type ReachLearnerSession = {
  status?: string;
  completedAt?: string | null;
  progress?: number;
  userId?: string;
  email?: string;
};

export async function findUserByEmail(email: string): Promise<ReachUser | null> {
  const data = await reachRequest<{ users?: ReachUser[] }>(
    "GET",
    `/users?email=${encodeURIComponent(email.toLowerCase())}&limit=1`,
  );
  const user = data.users?.[0];
  return user ?? null;
}

export async function createGroup(name: string): Promise<ReachGroup> {
  const data = await reachRequest<{ group?: ReachGroup } & ReachGroup>("POST", "/groups", {
    group: { name },
  });
  return (data.group ?? data) as ReachGroup;
}

export async function enrollGroupInCourse(courseId: string, groupId: string): Promise<void> {
  await reachRequest("PUT", `/courses/${courseId}/groups/${groupId}`);
}

export async function enrollUserInCourse(courseId: string, userId: string): Promise<void> {
  await reachRequest("PUT", `/courses/${courseId}/users/${userId}`);
}

export async function addUserToGroup(groupId: string, userId: string): Promise<void> {
  await reachRequest("PUT", `/groups/${groupId}/users/${userId}`);
}

export async function inviteUser(params: {
  email: string;
  firstName: string;
  lastName: string;
  groups: string[];
}): Promise<ReachInvitation> {
  const data = await reachRequest<{ invitation?: ReachInvitation }>("POST", "/invitations", {
    invitation: {
      email: params.email.toLowerCase(),
      firstName: params.firstName,
      lastName: params.lastName,
      groups: params.groups,
    },
  });
  return (data.invitation ?? data) as ReachInvitation;
}

export async function getLearnerReport(userId: string): Promise<{
  courses?: Array<{
    courseId?: string;
    status?: string;
    completedAt?: string | null;
    progress?: number;
  }>;
}> {
  return reachRequest("GET", `/reports/learners/${userId}`);
}

export async function getCourseReport(courseId: string): Promise<{
  learners?: ReachLearnerSession[];
}> {
  return reachRequest("GET", `/reports/courses/${courseId}`);
}

/** Map Reach status strings to our TrainingStatus enum values. */
export function mapReachTrainingStatus(
  reachStatus: string | undefined | null,
): "not_started" | "in_progress" | "completed" {
  const s = (reachStatus ?? "").toLowerCase();
  if (s.includes("complete")) return "completed";
  if (s.includes("progress")) return "in_progress";
  return "not_started";
}
