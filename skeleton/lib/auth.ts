// skeleton/lib/auth.ts
// Minimal auth middleware skeleton for Cloudflare Worker / Hono-style apps.

export type UserSession = {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  orgIds: string[];
  unitIds: string[];
  incidentIds: string[];
  programIds: string[];
  taskIds: string[];
  issuedAt: number;
  expiresAt: number;
};

const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
const sessionStore = new Map<string, UserSession>();

function normalizeToken(token: string): string {
  return token.replace(/^Bearer\s+/i, '').trim();
}

export async function issueSession(user: {
  userId: string;
  email: string;
  fullName: string;
  roles?: string[];
  orgIds?: string[];
  unitIds?: string[];
  incidentIds?: string[];
  programIds?: string[];
  taskIds?: string[];
}): Promise<string> {
  const token = `sess_${crypto.randomUUID()}`;
  const now = Date.now();

  const session: UserSession = {
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    roles: user.roles ?? [],
    orgIds: user.orgIds ?? [],
    unitIds: user.unitIds ?? [],
    incidentIds: user.incidentIds ?? [],
    programIds: user.programIds ?? [],
    taskIds: user.taskIds ?? [],
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  sessionStore.set(token, session);
  return token;
}

export async function verifySession(token: string | null | undefined): Promise<UserSession | null> {
  if (!token) return null;

  const normalized = normalizeToken(token);
  const session = sessionStore.get(normalized);

  if (!session) return null;

  const now = Date.now();
  if (session.expiresAt <= now) {
    sessionStore.delete(normalized);
    return null;
  }

  return session;
}

export async function revokeSession(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;

  const normalized = normalizeToken(token);
  if (!sessionStore.has(normalized)) return false;

  sessionStore.delete(normalized);
  return true;
}

export async function getSessionFromRequest(req: {
  header: (name: string) => string | undefined;
  query?: (name: string) => string | undefined;
}): Promise<UserSession | null> {
  const headerToken = req.header('Authorization');
  const authHeader = headerToken ?? req.header('authorization');
  const token = authHeader ?? req.query?.('token');

  return verifySession(token ?? null);
}

export async function requireAuth(req: {
  header: (name: string) => string | undefined;
  query?: (name: string) => string | undefined;
}) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return {
      ok: false,
      code: 401,
      message: 'Unauthorized: invalid or expired session',
    };
  }

  return { ok: true, session };
}

export function isRole(session: UserSession | null, role: string): boolean {
  if (!session) return false;
  return session.roles.includes(role);
}

export function hasAnyRole(session: UserSession | null, roles: string[]): boolean {
  if (!session) return false;
  return roles.some((role) => session.roles.includes(role));
}
