import { Hono } from 'hono';

const app = new Hono();

app.get('/api/assessments', async (c) => {
  // TODO: list by assigned assessor or verifier/admin scope
  return c.json({ ok: true, data: [] });
});

app.get('/api/assessments/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ ok: true, data: { id } });
});

app.post('/api/assessments', async (c) => {
  // TODO: ensure task assignment exists and user is assigned assessor
  return c.json({ ok: true, message: 'Assessment created' });
});

app.patch('/api/assessments/:id/draft', async (c) => {
  // TODO: save draft data payload
  return c.json({ ok: true, message: 'Draft saved' });
});

app.patch('/api/assessments/:id/submit', async (c) => {
  // TODO: set status = SUBMITTED and save version snapshot
  return c.json({ ok: true, message: 'Assessment submitted' });
});

app.patch('/api/assessments/:id/revision', async (c) => {
  // TODO: require reason and create new assessment version
  return c.json({ ok: true, message: 'Revision requested' });
});

app.patch('/api/assessments/:id/approve', async (c) => {
  // TODO: allow only validator/admin/pimpinan according to policy
  return c.json({ ok: true, message: 'Assessment approved' });
});

export default app;
