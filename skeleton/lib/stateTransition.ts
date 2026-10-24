// skeleton/lib/stateTransition.ts
// Domain state transition maps and validator helpers.

export type StatusMap = Record<string, string[]>;

export const REPORT_TRANSITIONS: StatusMap = {
  RECEIVED: ['IN_REVIEW', 'REJECTED', 'DUPLICATE'],
  IN_REVIEW: ['NEEDS_CLARIFICATION', 'ACCEPTED', 'REJECTED'],
  NEEDS_CLARIFICATION: ['IN_REVIEW', 'REJECTED'],
  ACCEPTED: ['TRIAGE_PENDING', 'REJECTED', 'CLOSED'],
  TRIAGE_PENDING: ['ACCEPTED', 'REJECTED', 'CLOSED'],
  DUPLICATE: ['CLOSED'],
  REJECTED: [],
  CLOSED: [],
};

export const INCIDENT_TRANSITIONS: StatusMap = {
  MONITORING: ['RESPONSE_ACTIVATED', 'CLOSED'],
  RESPONSE_ACTIVATED: ['RESPONSE_ONGOING', 'CLOSED'],
  RESPONSE_ONGOING: ['RESPONSE_COMPLETED', 'CLOSED'],
  RESPONSE_COMPLETED: ['CLOSED'],
  CLOSED: [],
};

export const ASSESSMENT_TRANSITIONS: StatusMap = {
  ASSIGNED: ['ACKNOWLEDGED', 'CANCELLED'],
  ACKNOWLEDGED: ['IN_PROGRESS', 'REASSIGNED', 'CANCELLED'],
  IN_PROGRESS: ['SUBMITTED', 'REASSIGNED', 'CANCELLED'],
  SUBMITTED: ['NEEDS_REVISION', 'APPROVED', 'REJECTED'],
  NEEDS_REVISION: ['IN_PROGRESS', 'SUBMITTED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
  REASSIGNED: ['ACKNOWLEDGED', 'IN_PROGRESS'],
  CANCELLED: [],
};

export const TASK_TRANSITIONS: StatusMap = {
  DRAFT: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['ACCEPTED', 'REASSIGNED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  REASSIGNED: ['ASSIGNED', 'ACCEPTED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const FINANCE_TRANSITIONS: StatusMap = {
  DRAFT: ['SUBMITTED', 'REJECTED'],
  SUBMITTED: ['REVIEWED', 'REJECTED'],
  REVIEWED: ['APPROVED', 'REJECTED'],
  APPROVED: ['PAID', 'REVERSED'],
  PAID: ['RECONCILED', 'REVERSED'],
  REJECTED: [],
  REVERSED: [],
  RECONCILED: [],
};

export const DISPATCH_TRANSITIONS: StatusMap = {
  DRAFT: ['APPROVED', 'CANCELLED'],
  APPROVED: ['PICKING', 'CANCELLED'],
  PICKING: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['PARTIALLY_RECEIVED', 'RECEIVED', 'RECONCILIATION_PENDING'],
  PARTIALLY_RECEIVED: ['RECEIVED', 'RECONCILIATION_PENDING', 'CANCELLED'],
  RECEIVED: ['COMPLETED'],
  RECONCILIATION_PENDING: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const LPJ_TRANSITIONS: StatusMap = {
  DRAFT: ['IN_REVIEW'],
  IN_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['FINAL'],
  FINAL: ['ARCHIVED'],
  REJECTED: [],
  ARCHIVED: [],
};

export type TransitionError = {
  code: number;
  message: string;
};

export function canTransition(currentStatus: string, nextStatus: string, map: StatusMap): boolean {
  const allowed = map[currentStatus] ?? [];
  return allowed.includes(nextStatus);
}

export function validateTransition(
  currentStatus: string,
  nextStatus: string,
  map: StatusMap
): { ok: true } | { ok: false; error: TransitionError } {
  if (!currentStatus || !nextStatus) {
    return {
      ok: false,
      error: { code: 400, message: 'Current status and next status are required' },
    };
  }

  if (!canTransition(currentStatus, nextStatus, map)) {
    return {
      ok: false,
      error: {
        code: 422,
        message: `Invalid transition from ${currentStatus} to ${nextStatus}`,
      },
    };
  }

  return { ok: true };
}

export function requireStatusPreconditions(
  currentStatus: string,
  nextStatus: string,
  map: StatusMap,
  checks: Array<() => boolean | string>
): { ok: true } | { ok: false; error: TransitionError } {
  const transition = validateTransition(currentStatus, nextStatus, map);
  if (!transition.ok) return transition;

  for (const check of checks) {
    const result = check();
    if (result === false) {
      return {
        ok: false,
        error: { code: 400, message: 'Status update blocked by missing business precondition' },
      };
    }

    if (typeof result === 'string' && result.length > 0) {
      return {
        ok: false,
        error: { code: 400, message: result },
      };
    }
  }

  return { ok: true };
}

export const VALIDATION_RULES = {
  report: REPORT_TRANSITIONS,
  incident: INCIDENT_TRANSITIONS,
  assessment: ASSESSMENT_TRANSITIONS,
  task: TASK_TRANSITIONS,
  finance: FINANCE_TRANSITIONS,
  dispatch: DISPATCH_TRANSITIONS,
  lpj: LPJ_TRANSITIONS,
};
