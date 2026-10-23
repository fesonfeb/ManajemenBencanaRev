# State Machine and API Contract for Incident, Assessment, and LPJ

## 1. Scope
This document defines the minimum state machine and API contract for the three highest-priority operational domains in the implementation sequence:
1. Incident
2. Assessment
3. LPJ

This document is meant to be used as the implementation baseline before the application scaffold is built. It is still a design artifact and not a declaration that production functionality already exists.

## 2. Core principles
- Backend enforces all role, state, and approval rules.
- Frontend must not be the only security boundary.
- Every state transition must be logged in an audit trail.
- Every mutation must include a reason and actor context.
- Revisions must preserve historical versioning, not overwrite without trace.
- Offline sync must respect idempotency and dedupe rules.

## 3. Incident state machine

### 3.1 Allowed states
- created
- validated
- active
- monitored
- closed
- reopened
- archived

### 3.2 Allowed transitions
- created -> validated
  - actor: Verifikator
  - required: report data complete
  - reason: required
- validated -> active
  - actor: Koordinator or Pimpinan
  - required: operational owner assigned
  - reason: required
- active -> monitored
  - actor: Koordinator
  - required: operational tracking active
- active -> closed
  - actor: Pimpinan
  - required: closure evidence complete
  - reason: required
- closed -> reopened
  - actor: Admin or Pimpinan
  - required: reopen reason formalized
- active -> archived
  - actor: Admin
  - required: retention policy satisfied

### 3.3 Incident fields
- id
- code
- title
- summary
- category
- severity
- status
- source_type
- reporter_id
- location_id
- created_at
- updated_at
- closed_at

### 3.4 Incident API contract
- GET /api/incidents
- GET /api/incidents/:id
- POST /api/incidents
- PATCH /api/incidents/:id
- POST /api/incidents/:id/validate
- POST /api/incidents/:id/close
- POST /api/incidents/:id/reopen
- GET /api/incidents/:id/audit

### 3.5 Incident action validation
All actions must validate:
- authenticated user
- role authority
- target entity scope
- current state
- required fields
- actor has permission to transition
- audit log entry created

## 4. Assessment state machine

### 4.1 Allowed states
- draft
- assigned
- in_progress
- submitted
- under_review
- approved
- returned
- rejected
- archived

### 4.2 Allowed transitions
- draft -> assigned
  - actor: Koordinator or Verifikator
- assigned -> in_progress
  - actor: Asesor
- in_progress -> submitted
  - actor: Asesor
- submitted -> under_review
  - actor: Verifikator
- under_review -> approved
  - actor: Verifikator or Pimpinan
  - required: assessment accepted by authority
- under_review -> returned
  - actor: Verifikator
  - required: reason and revision instruction provided
- returned -> in_progress
  - actor: Asesor
- under_review -> rejected
  - actor: Verifikator or Pimpinan
  - required: reason recorded
- approved -> archived
  - actor: Admin

### 4.3 Assessment fields
- id
- incident_id
- assigned_to
- submitted_by
- status
- priority
- findings
- score
- evidence_ids
- created_at
- updated_at
- review_comment

### 4.4 Assessment API contract
- GET /api/assessments
- GET /api/assessments/:id
- POST /api/assessments
- PATCH /api/assessments/:id
- POST /api/assessments/:id/assign
- POST /api/assessments/:id/submit
- POST /api/assessments/:id/review
- POST /api/assessments/:id/approve
- POST /api/assessments/:id/return
- GET /api/assessments/:id/audit

### 4.5 Assessment validation rules
- Asesor cannot approve their own assessment results.
- If returned, reason must be included and captured in audit trail.
- Submission must include evidence or a defined reason why evidence is missing.
- Approval requires role and current status validation.

## 5. LPJ state machine

### 5.1 Allowed states
- draft
- in_review
- approved
- final
- revised
- rejected

### 5.2 Allowed transitions
- draft -> in_review
  - actor: Koordinator
- in_review -> approved
  - actor: Verifikator or Pimpinan
- approved -> final
  - actor: Pimpinan or authorized admin
- final -> revised
  - actor: Admin or Pimpinan
  - required: revision reason recorded
- in_review -> rejected
  - actor: Verifikator or Pimpinan
  - required: rejection reason captured

### 5.3 LPJ fields
- id
- incident_id
- version
- status
- summary
- created_by
- approved_by
- finalized_at
- created_at
- updated_at

### 5.4 LPJ API contract
- GET /api/lpj
- GET /api/lpj/:id
- POST /api/lpj
- PATCH /api/lpj/:id
- POST /api/lpj/:id/review
- POST /api/lpj/:id/approve
- POST /api/lpj/:id/finalize
- POST /api/lpj/:id/revise
- GET /api/lpj/:id/audit

### 5.5 LPJ validation rules
- LPJ final cannot be edited without approved revision workflow.
- All LPJ attachments must be traceable to incident or related records.
- Final approval requires role check and evidence completeness.

## 6. Common API validation model
Every API mutation should validate the same standard fields:
- auth token / session exists
- user role present
- target entity scope valid
- state transition valid
- user has authority for action
- required fields complete
- duplicate action prevented via idempotency or dedupe key
- audit log generated

## 7. Standard response format
Each API response should include:
- status
- data
- trace_id / request_id
- actor
- timestamp
- validation errors if any
- audit metadata

Example:
```json
{
  "status": "success",
  "data": {
    "id": "inc_123",
    "status": "active"
  },
  "trace_id": "trc_abc123",
  "actor": {
    "id": "usr_01",
    "role": "koordinator"
  },
  "timestamp": "2026-10-23T12:00:00Z",
  "audit": {
    "entity_type": "incident",
    "entity_id": "inc_123",
    "action": "validate",
    "performed_by": "usr_01"
  }
}
```

## 8. Audit log schema
- id
- entity_type
- entity_id
- action
- actor_id
- old_state
- new_state
- reason
- created_at

## 9. Role authority summary for priority domains
### 9.1 Incident
- Verifikator: validate and triage
- Koordinator: assignment and monitoring
- Pimpinan: closure and strategic approval
- Admin: configuration and retention handling

### 9.2 Assessment
- Asesor: create and submit assessment
- Verifikator: review and return
- Pimpinan: approval when required by policy

### 9.3 LPJ
- Koordinator: draft and evidence collection
- Verifikator: review and validation
- Pimpinan: approval and final sign-off
- Admin: versioning and retention governance

## 10. Offline and sync rules for the priority domains
- Pending actions are stored locally while the device is offline.
- Outbox queue contains all mutation requests with idempotency keys.
- When connectivity returns, the queue is replayed in order.
- Duplicate actions must be detected and suppressed on server validation.
- Conflict resolution is explicit, not silent.

## 11. TBD
- detailed incident subtype lifecycle for different disaster categories
- exact authority split between Verifikator and Pimpinan per organization
- detailed donor/public visibility policy beyond general role restriction
- exact Cloudflare auth product selection inside the organization
- final conflict resolution strategy for field data sync

## 12. Implementation readiness status
This state machine and API contract is ready as a design baseline for the implementation phase. It is a planning artifact and does not imply that the production application or database is already implemented.
