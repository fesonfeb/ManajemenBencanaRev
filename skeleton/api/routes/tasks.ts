import { Hono } from 'hono';

const app = new Hono();

app.get('/api/tasks', async (c) => {
  // TODO: scope by assignee/coordinator/admin/jurisdiction
  return c.json({ ok: true, data: [] });
});

app.get('/api/tasks/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ ok: true, data: { id } });
});

app.post('/api/tasks', async (c) => {
  // TODO: ensure incident exists and task assignment valid
  return c.json({ ok: true, message: 'Task created' });
});

app.patch('/api/tasks/:id/accept', async (c) => {
  // TODO: only assigned assessor may accept
  return c.json({ ok: true, message: 'Task accepted' });
});

app.patch('/api/tasks/:id/reassign', async (c) => {
  // TODO: maintain state and audit log
  return c.json({ ok: true, message: 'Task reassigned' });
});

app.patch('/api/tasks/:id/cancel', async (c) => {
  // TODO: reason required, status update and audit trail
  return c.json({ ok: true, message: 'Task cancelled' });
});

export default app;
