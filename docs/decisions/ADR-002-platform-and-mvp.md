# ADR-002: Platform, MVP, and Approval Decisions

## Status
Accepted

## Context
The system must support operational governance, field usage, traceability, and approval flows while remaining aligned with the approved operational flowchart and role matrix. Before implementation, several platform and governance decisions must be made to avoid rework.

## Decision
The following decisions are accepted for the next implementation phase:

### 1. Identity and access
Use a Cloudflare-based identity approach for authentication and session management. The preferred direction is Cloudflare Access and OIDC-compatible identity integration, depending on the final environment and SSO needs of the organization.

### 2. Deployment target
Use Cloudflare Pages for the frontend app shell and Cloudflare Workers for backend/API and edge logic.

### 3. MVP scope
Include the following in MVP:
- offline storage and delayed sync when the device is offline
- automatic transmission once the device comes online
- donor/public-facing access within the approved governance model

This means the system must be designed to support field operations with offline-first behavior and public/donor visibility boundaries that remain role-controlled.

### 4. Early domain priorities
Implement in this order:
1. incident core
2. assessment workflow
3. LPJ flow and reporting

This keeps the operating model aligned with the minimum viable, traceable, and reviewable business flow.

### 5. Approval authority
Approval authority is defined as follows:
- Verifikator: validates report, triage, and assessment review within its domain
- Pimpinan: approves core operational response, strategic review, and final closure decisions as stated by policy

This means approval is not centralized in a single role and should remain role-specific, with each transition validated by backend rules.

## Consequences
- The system architecture must support Cloudflare-native auth and edge deployment.
- Offline-first design must be part of the MVP foundation, not added as an afterthought.
- Donor/public views must be carefully filtered and protected by access rules.
- The lifecycle and role matrix must be enforced in backend logic rather than UI-only gating.
- The domain order keeps the implementation manageable and traceable while preserving business-critical approval points.

## Additional guardrails
- No bypass of approval flows.
- No UI-only security checks.
- No final status changes without audit trail and version tracking.
- No public or donor access to internal operational details beyond approved scope.

## TBD
- exact Cloudflare authentication product decision inside the organization
- full offline sync strategy in detail, including conflict handling and dedupe rules
- exact donor/public data boundaries per module
- exact approval versioning model for LPJ final and operational closure
