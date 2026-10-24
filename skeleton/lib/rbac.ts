// skeleton/lib/rbac.ts
// Minimum but practical RBAC middleware + scope validation.

import { requireAuth, UserSession, hasAnyRole } from './auth';

export type ResourceName =
  | 'reports'
  | 'incidents'
  | 'assessments'
  | 'tasks'
  | 'task_letters'
  | 'programs'
  | 'need_items'
  | 'proposals'
  | 'inventory_items'
  | 'stock_movements'
  | 'dispatch_notes'
  | 'distributions'
  | 'financial_transactions'
  | 'volunteers'
  | 'attendance'
  | 'lpj'
  | 'audit_log';

export type ActionName =
  | 'create'
  | 'read'
  | 'list'
  | 'update'
  | 'approve'
  | 'reject'
  | 'verify'
  | 'assign'
  | 'close'
  | 'dispatch'
  | 'receive'
  | 'publish'
  | 'reverse'
  | 'reconcile';

export type PermissionMap = Record<string, string[]>;

export const ROLE_PERMISSIONS: PermissionMap = {
  SUPERADMIN: [
    'reports:create', 'reports:read', 'reports:verify', 'reports:reject',
    'incidents:create', 'incidents:read', 'incidents:update', 'incidents:close',
    'assessments:create', 'assessments:read', 'assessments:approve',
    'tasks:create', 'tasks:read', 'tasks:assign', 'tasks:cancel',
    'programs:create', 'programs:read', 'programs:update', 'programs:approve',
    'financial_transactions:create', 'financial_transactions:read', 'financial_transactions:approve',
    'inventory_items:create', 'inventory_items:read', 'inventory_items:update',
    'audit_log:read'
  ],
  ADMIN: [
    'reports:create', 'reports:read', 'reports:verify', 'reports:reject',
    'incidents:create', 'incidents:read', 'incidents:update', 'incidents:close',
    'assessments:create', 'assessments:read', 'assessments:approve',
    'tasks:create', 'tasks:read', 'tasks:assign', 'tasks:cancel',
    'programs:create', 'programs:read', 'programs:update',
    'financial_transactions:create', 'financial_transactions:read', 'financial_transactions:approve',
    'inventory_items:create', 'inventory_items:read', 'inventory_items:update',
    'audit_log:read'
  ],
  PIMPINAN: [
    'reports:read', 'incidents:read', 'incidents:update', 'incidents:close',
    'assessments:read', 'assessments:approve',
    'tasks:read', 'programs:read', 'programs:update',
    'financial_transactions:read', 'financial_transactions:approve',
    'inventory_items:read', 'dispatch_notes:read', 'distributions:read'
  ],
  VERIFIKATOR: [
    'reports:read', 'reports:verify', 'reports:reject', 'reports:clarify', 'reports:duplicate',
    'incidents:read', 'incidents:update', 'triage_cases:read', 'triage_cases:priority',
    'assessments:read'
  ],
  ASESOR: [
    'assessments:create', 'assessments:read', 'assessments:update', 'assessments:submit',
    'tasks:read', 'tasks:accept', 'tasks:update'
  ],
  KOORDINATOR_LAPANGAN: [
    'tasks:read', 'tasks:create', 'tasks:assign', 'tasks:update',
    'programs:read', 'programs:update', 'need_items:create', 'need_items:update',
    'inventory_items:read', 'dispatch_notes:read', 'distributions:create', 'distributions:update'
  ],
  KEUANGAN: [
    'financial_transactions:create', 'financial_transactions:read', 'financial_transactions:update',
    'financial_transactions:approve', 'financial_transactions:reverse',
    'programs:read', 'incidents:read'
  ],
  LOGISTIK: [
    'inventory_items:create', 'inventory_items:read', 'inventory_items:update',
    'stock_movements:create', 'stock_movements:read',
    'dispatch_notes:create', 'dispatch_notes:read', 'dispatch_notes:dispatch',
    'distributions:create', 'distributions:read', 'distributions:update'
  ],
  DONATUR: [
    'programs:read', 'proposals:read', 'donor_reports:read'
  ],
  AUDITOR: [
    'reports:read', 'incidents:read', 'tasks:read', 'financial_transactions:read',
    'inventory_items:read', 'stock_movements:read', 'audit_log:read'
  ],
  VOLUNTEER: [
    'tasks:read', 'attendance:create', 'attendance:read', 'attendance:update'
  ],
  PUBLIC: [
    'reports:create', 'reports:read_own', 'status_public:read'
  ]
};

export function hasPermission(session: UserSession | null, permission: string): boolean {
  if (!session) return false;

  const allowedRoles = Object.entries(ROLE_PERMISSIONS)
    .filter(([, permissions]) => permissions.includes(permission))
    .map(([role]) => role);

  return session.roles.some((role) => allowedRoles.includes(role));
}

export async function requirePermission(
  session: UserSession | null,
  permission: string,
  opts?: { allowPublic?: boolean }
): Promise<{ ok: boolean; code?: number; message?: string; session?: UserSession }> {
  if (!session) {
    return { ok: false, code: 401, message: 'Unauthorized' };
  }

  if (hasPermission(session, permission)) {
    return { ok: true, session };
  }

  if (opts?.allowPublic && session.roles.includes('PUBLIC')) {
    return { ok: true, session };
  }

  return { ok: false, code: 403, message: `Forbidden: missing permission ${permission}` };
}

export function checkScope(
  session: UserSession | null,
  scope: {
    orgId?: string;
    unitId?: string;
    incidentId?: string;
    programId?: string;
    taskId?: string;
  }
): boolean {
  if (!session) return false;

  if (scope.orgId && !session.orgIds.includes(scope.orgId)) return false;
  if (scope.unitId && !session.unitIds.includes(scope.unitId)) return false;
  if (scope.incidentId && !session.incidentIds.includes(scope.incidentId)) return false;
  if (scope.programId && !session.programIds.includes(scope.programId)) return false;
  if (scope.taskId && !session.taskIds.includes(scope.taskId)) return false;

  return true;
}

export function hasAnyPermission(session: UserSession | null, permissions: string[]): boolean {
  if (!session) return false;
  return permissions.some((permission) => hasPermission(session, permission));
}

export async function authorizeRequest(
  req: { header: (name: string) => string | undefined; query?: (name: string) => string | undefined },
  permission: string,
  scope?: {
    orgId?: string;
    unitId?: string;
    incidentId?: string;
    programId?: string;
    taskId?: string;
  }
): Promise<{ ok: boolean; code?: number; message?: string; session?: UserSession }> {
  const auth = await requireAuth(req);
  if (!auth.ok || !auth.session) {
    return { ok: false, code: 401, message: 'Unauthorized' };
  }

  const permissionCheck = await requirePermission(auth.session, permission);
  if (!permissionCheck.ok) {
    return permissionCheck;
  }

  if (scope && !checkScope(auth.session, scope)) {
    return { ok: false, code: 403, message: 'Forbidden: scope not allowed' };
  }

  return { ok: true, session: auth.session };
}

export function isPublicAllowed(permission: string): boolean {
  return permission === 'reports:create' || permission === 'reports:read_own' || permission === 'status_public:read';
}

export const DEFAULT_ROUTE_POLICY = {
  allowPublicCreate: ['reports:create'],
  allowPublicReadOwn: ['reports:read_own'],
};
