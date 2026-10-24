-- 001_foundation.sql
-- Foundation schema for users, roles, orgs, locations, incidents, reports, tasks, inventory, finance, and audit

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  parent_org_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  parent_unit_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  province TEXT,
  city TEXT,
  district TEXT,
  village TEXT,
  address_detail TEXT,
  latitude TEXT,
  longitude TEXT,
  source TEXT,
  accuracy TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  password_hash TEXT,
  status TEXT DEFAULT 'active',
  auth_provider TEXT DEFAULT 'local',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  org_id TEXT,
  unit_id TEXT,
  incident_id TEXT,
  effective_from TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  effective_to TEXT,
  granted_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  incident_type TEXT,
  status TEXT NOT NULL DEFAULT 'MONITORING',
  org_id TEXT NOT NULL,
  region_id TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TEXT,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (region_id) REFERENCES locations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  incident_id TEXT,
  source_channel TEXT,
  event_category TEXT,
  reported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  occurred_at TEXT,
  location_id TEXT,
  reporter_name TEXT,
  reporter_contact TEXT,
  reporter_relation TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'RECEIVED',
  verification_status TEXT,
  duplicate_of_report_id TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (duplicate_of_report_id) REFERENCES reports(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS triage_cases (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  incident_id TEXT,
  urgency_level TEXT,
  risk_level TEXT,
  triage_status TEXT,
  assigned_verifier_id TEXT,
  escalated_to TEXT,
  escalation_time TEXT,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id),
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (assigned_verifier_id) REFERENCES users(id),
  FOREIGN KEY (escalated_to) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  task_type TEXT,
  assignee_id TEXT,
  coordinator_id TEXT,
  status TEXT NOT NULL DEFAULT 'ASSIGNED',
  assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deadline_at TEXT,
  location_id TEXT,
  instructions TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  FOREIGN KEY (coordinator_id) REFERENCES users(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS task_letters (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  letter_number TEXT UNIQUE NOT NULL,
  issue_date TEXT NOT NULL,
  based_on TEXT,
  assignee_name TEXT,
  assignee_role TEXT,
  incident_id TEXT NOT NULL,
  location_id TEXT,
  task_period TEXT,
  scope TEXT,
  authorized_by TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (authorized_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  task_id TEXT,
  assessor_id TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  status TEXT NOT NULL DEFAULT 'ASSIGNED',
  certainty_level TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  review_notes TEXT,
  approved_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (assessor_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assessment_versions (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  FOREIGN KEY (submitted_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  name TEXT NOT NULL,
  background TEXT,
  objective TEXT,
  location_id TEXT,
  target_group TEXT,
  schedule_start TEXT,
  schedule_end TEXT,
  coordinator_id TEXT,
  budget_total REAL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (coordinator_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS need_items (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT,
  priority TEXT,
  location_id TEXT,
  source_type TEXT,
  status TEXT DEFAULT 'DRAFT',
  remaining_quantity REAL NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  target_funding REAL,
  approved_for_publication INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS warehouses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location_id TEXT NOT NULL,
  capacity_note TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  condition TEXT,
  lot_batch TEXT,
  expiry_date TEXT,
  warehouse_id TEXT NOT NULL,
  rack_bin TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  movement_type TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT,
  from_location_id TEXT,
  to_location_id TEXT,
  reason TEXT,
  reference_doc TEXT,
  performed_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  FOREIGN KEY (performed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS dispatch_notes (
  id TEXT PRIMARY KEY,
  operation_order_id TEXT NOT NULL,
  incident_id TEXT,
  program_id TEXT,
  origin_warehouse_id TEXT NOT NULL,
  destination_location_id TEXT NOT NULL,
  dispatched_by TEXT NOT NULL,
  received_by TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  dispatch_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (origin_warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (destination_location_id) REFERENCES locations(id),
  FOREIGN KEY (dispatched_by) REFERENCES users(id),
  FOREIGN KEY (received_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS distributions (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  program_id TEXT,
  dispatch_note_id TEXT,
  destination_type TEXT,
  beneficiary_org TEXT,
  beneficiary_name TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (dispatch_note_id) REFERENCES dispatch_notes(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS distribution_items (
  id TEXT PRIMARY KEY,
  distribution_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity_sent REAL NOT NULL,
  quantity_received REAL,
  discrepancy_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (distribution_id) REFERENCES distributions(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  incident_id TEXT,
  program_id TEXT,
  category TEXT,
  transaction_type TEXT,
  date TEXT NOT NULL,
  source_of_funds TEXT,
  counterparty TEXT,
  amount REAL NOT NULL,
  payment_method TEXT,
  reference_no TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by TEXT NOT NULL,
  reviewed_by TEXT,
  approved_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transaction_attachments (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES financial_transactions(id)
);

CREATE TABLE IF NOT EXISTS volunteer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  competency TEXT,
  availability TEXT,
  emergency_contact TEXT,
  status TEXT DEFAULT 'active',
  data_consent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  volunteer_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  check_in_at TEXT,
  check_out_at TEXT,
  verification_method TEXT,
  status TEXT DEFAULT 'PRESENT',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS lpj (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  content_json TEXT,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS closure_checklists (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  checklist_json TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN',
  approved_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  reason TEXT,
  approval_ref TEXT,
  correlation_id TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS file_objects (
  id TEXT PRIMARY KEY,
  entity_name TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  checksum TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_warehouse ON inventory_items(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_financial_tx_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_name, entity_id);
