import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifySession } from '../lib/auth';
import { requirePermission } from '../lib/rbac';

const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/auth/login', async (c) => {
  // TODO: implement login using OIDC / external identity provider
  return c.json({ ok: false, message: 'Login implementation pending' }, 501);
});

app.post('/api/auth/logout', async (c) => {
  // TODO: invalidate session / token
  return c.json({ ok: true, message: 'Logged out' });
});

app.get('/api/auth/me', async (c) => {
  const token = getCookie(c, 'session') || c.req.header('Authorization');
  if (!token) {
    return c.json({ ok: false, message: 'Unauthorized' }, 401);
  }

  const user = await verifySession(token);
  if (!user) {
    return c.json({ ok: false, message: 'Invalid session' }, 401);
  }

  return c.json({ ok: true, user });
});

export default app;
