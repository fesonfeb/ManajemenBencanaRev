import { Hono } from 'hono';

const app = new Hono();

app.get('/api/incidents', async (c) => {
  // TODO: role-filtered list by org/unit/incident access
  return c.json({ ok: true, data: [] });
});

app.get('/api/incidents/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ ok: true, data: { id } });
});

app.post('/api/incidents', async (c) => {
  // TODO: require report is valid and triage passed
  return c.json({ ok: true, message: 'Incident created' });
});

app.patch('/api/incidents/:id/status', async (c) => {
  // TODO: validate allowed transitions and actor authority
  return c.json({ ok: true, message: 'Incident status updated' });
});

app.patch('/api/incidents/:id/close', async (c) => {
  // TODO: verify closure checklist before close
  return c.json({ ok: true, message: 'Incident closed' });
});

export default app;
