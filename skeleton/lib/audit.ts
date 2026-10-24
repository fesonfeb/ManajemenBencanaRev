// skeleton/lib/audit.ts
// Audit middleware and helper utilities for mutation tracking.

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'verify'
  | 'assign'
  | 'dispatch'
  | 'receive'
  | 'reverse'
  | 'close'
  | 'finalize';

export type AuditRecord = {
  id: string;
  actorId: string;
  entityName: string;
  entityId: string;
  actionType: AuditAction;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  approvalRef?: string;
  correlationId?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
};

const auditLogStore: AuditRecord[] = [];

export function createAuditId(): string {
  return `audit_${crypto.randomUUID()}`;
}

export function appendAuditLog(input: {
  actorId: string;
  entityName: string;
  entityId: string;
  actionType: AuditAction;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  approvalRef?: string;
  correlationId?: string;
  payload?: Record<string, unknown>;
}): AuditRecord {
  const record: AuditRecord = {
    id: createAuditId(),
    actorId: input.actorId,
    entityName: input.entityName,
    entityId: input.entityId,
    actionType: input.actionType,
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    approvalRef: input.approvalRef,
    correlationId: input.correlationId,
    payload: input.payload,
    createdAt: new Date().toISOString(),
  };

  auditLogStore.push(record);
  return record;
}

export function getAuditLogByEntity(entityName: string, entityId: string): AuditRecord[] {
  return auditLogStore.filter((item) => item.entityName === entityName && item.entityId === entityId);
}

export function getAuditLogByActor(actorId: string): AuditRecord[] {
  return auditLogStore.filter((item) => item.actorId === actorId);
}

export function getAuditLogSince(timestampIso: string): AuditRecord[] {
  const ts = new Date(timestampIso).getTime();
  return auditLogStore.filter((item) => new Date(item.createdAt).getTime() >= ts);
}

export function getRecentAuditLog(limit = 50): AuditRecord[] {
  return [...auditLogStore].slice(-limit).reverse();
}

export async function auditMiddleware(input: {
  actorId: string;
  entityName: string;
  entityId: string;
  actionType: AuditAction;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  approvalRef?: string;
  correlationId?: string;
  payload?: Record<string, unknown>;
}) {
  return appendAuditLog(input);
}

export function buildCorrelationId(): string {
  return `corr_${crypto.randomUUID()}`;
}

export function ensureAuditForMutation(input: {
  actorId: string;
  entityName: string;
  entityId: string;
  actionType: AuditAction;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  approvalRef?: string;
  correlationId?: string;
  payload?: Record<string, unknown>;
}) {
  const correlationId = input.correlationId ?? buildCorrelationId();
  return appendAuditLog({
    ...input,
    correlationId,
  });
}
