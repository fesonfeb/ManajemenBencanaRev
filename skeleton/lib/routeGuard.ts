// skeleton/lib/routeGuard.ts
// Route guard helpers for endpoint-level authorization and scope enforcement.

import { requireAuth, UserSession } from './auth';
import { checkScope, hasPermission, requirePermission } from './rbac';

export type RouteGuardScope = {
  orgId?: string;
  unitId?: string;
  incidentId?: string;
  programId?: string;
  taskId?: string;
};

export type RouteGuardOptions = {
  permission: string;
  scope?: RouteGuardScope;
  allowPublic?: boolean;
};

export type GuardResult =
  | { ok: true; session: UserSession }
  | { ok: false; code: number; message: string };

export async function guardRoute(
  req: {
    header: (name: string) => string | undefined;
    query?: (name: string) => string | undefined;
  },
  options: RouteGuardOptions
): Promise<GuardResult> {
  const auth = await requireAuth(req);
  if (!auth.ok || !auth.session) {
    return { ok: false, code: 401, message: 'Unauthorized' };
  }

  const permissionCheck = await requirePermission(auth.session, options.permission, {
    allowPublic: options.allowPublic,
  });

  if (!permissionCheck.ok) {
    return {
      ok: false,
      code: permissionCheck.code ?? 403,
      message: permissionCheck.message ?? 'Forbidden',
    };
  }

  if (options.scope && !checkScope(auth.session, options.scope)) {
    return {
      ok: false,
      code: 403,
      message: 'Forbidden: scope not allowed for this resource',
    };
  }

  return { ok: true, session: auth.session };
}

export function routeGuardForResource(resource: string, action: string, scope?: RouteGuardScope) {
  return async (req: {
    header: (name: string) => string | undefined;
    query?: (name: string) => string | undefined;
  }) => {
    return guardRoute(req, {
      permission: `${resource}:${action}`,
      scope,
    });
  };
}

// Example resource-specific guards.
export const guardReportsRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('reports', 'read', scope);

export const guardReportsCreate = () =>
  routeGuardForResource('reports', 'create');

export const guardReportsVerify = (scope?: RouteGuardScope) =>
  routeGuardForResource('reports', 'verify', scope);

export const guardIncidentsRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('incidents', 'read', scope);

export const guardIncidentsUpdate = (scope?: RouteGuardScope) =>
  routeGuardForResource('incidents', 'update', scope);

export const guardAssessmentsRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('assessments', 'read', scope);

export const guardAssessmentsCreate = (scope?: RouteGuardScope) =>
  routeGuardForResource('assessments', 'create', scope);

export const guardTasksRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('tasks', 'read', scope);

export const guardTasksAssign = (scope?: RouteGuardScope) =>
  routeGuardForResource('tasks', 'assign', scope);

export const guardInventoryRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('inventory_items', 'read', scope);

export const guardInventoryCreate = (scope?: RouteGuardScope) =>
  routeGuardForResource('inventory_items', 'create', scope);

export const guardFinanceRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('financial_transactions', 'read', scope);

export const guardFinanceApprove = (scope?: RouteGuardScope) =>
  routeGuardForResource('financial_transactions', 'approve', scope);

export const guardFinanceCreate = (scope?: RouteGuardScope) =>
  routeGuardForResource('financial_transactions', 'create', scope);

export const guardAuditRead = (scope?: RouteGuardScope) =>
  routeGuardForResource('audit_log', 'read', scope);

// Example usage in route handlers.
export async function exampleProtectedRoute(req: {
  header: (name: string) => string | undefined;
  query?: (name: string) => string | undefined;
}) {
  const guard = await guardRoute(req, {
    permission: 'reports:read',
    scope: { incidentId: 'incident-001' },
  });

  if (!guard.ok) {
    return {
      status: guard.code,
      json: { ok: false, message: guard.message },
    };
  }

  return {
    status: 200,
    json: { ok: true, session: guard.session },
  };
}

export function canUserAccessOrg(session: UserSession | null, orgId: string): boolean {
  if (!session) return false;
  return session.orgIds.includes(orgId) || session.roles.includes('SUPERADMIN');
}

export function canUserAccessIncident(session: UserSession | null, incidentId: string): boolean {
  if (!session) return false;
  return session.incidentIds.includes(incidentId) || session.roles.includes('SUPERADMIN');
}

export function canUserAccessTask(session: UserSession | null, taskId: string): boolean {
  if (!session) return false;
  return session.taskIds.includes(taskId) || session.roles.includes('SUPERADMIN');
}

export function canUserAccessFinance(session: UserSession | null, incidentId?: string, programId?: string): boolean {
  if (!session) return false;

  if (session.roles.includes('SUPERADMIN') || session.roles.includes('ADMIN') || session.roles.includes('KEUANGAN')) {
    return true;
  }

  if (incidentId && session.incidentIds.includes(incidentId)) return true;
  if (programId && session.programIds.includes(programId)) return true;

  return false;
}
