import { Hono } from 'hono';
import { requirePermission } from '../lib/rbac';

const app = new Hono();

app.get('/api/reports', async (c) => {
  // TODO: validate session and role permissions
  // check permission: reports:read
  // scope by org/unit/incident
  return c.json({ ok: true, data: [] });
});

app.get('/api/reports/:id', async (c) => {
  const id = c.req.param('id');
  // TODO: fetch report by id and apply access control
  return c.json({ ok: true, data: { id } });
});

app.post('/api/reports', async (c) => {
  // TODO: validate input, file attachments, and public/internal rules
  // TODO: create report status = RECEIVED
  return c.json({ ok: true, message: 'Report created' });
});

app.patch('/api/reports/:id/verify', async (c) => {
  // TODO: verify role = VERIFIKATOR|ADMIN
  // TODO: validate state transition
  return c.json({ ok: true, message: 'Report verified' });
});

app.patch('/api/reports/:id/reject', async (c) => {
  // TODO: require reason and audit log
  return c.json({ ok: true, message: 'Report rejected' });
});

app.patch('/api/reports/:id/duplicate', async (c) => {
  // TODO: require duplicate_of_report_id
  return c.json({ ok: true, message: 'Report marked as duplicate' });
});

app.patch('/api/reports/:id/clarify', async (c) => {
  // TODO: save clarification request
  return c.json({ ok: true, message: 'Clarification requested' });
});

export default app;
