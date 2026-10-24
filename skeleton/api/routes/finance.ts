import { Hono } from 'hono';

const app = new Hono();

app.get('/api/finance/ledger', async (c) => {
  // TODO: return ledger and reconcile results scoped by org/program/incident
  return c.json({ ok: true, data: [] });
});

app.get('/api/transactions', async (c) => {
  // TODO: apply finance access rules and filters
  return c.json({ ok: true, data: [] });
});

app.get('/api/transactions/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ ok: true, data: { id } });
});

app.post('/api/transactions', async (c) => {
  // TODO: require category, amount, source_of_funds, reference_no, evidence
  // TODO: status = DRAFT or SUBMITTED depending policy
  return c.json({ ok: true, message: 'Transaction created' });
});

app.patch('/api/transactions/:id/review', async (c) => {
  // TODO: only KEUANGAN/ADMIN can review
  return c.json({ ok: true, message: 'Transaction reviewed' });
});

app.patch('/api/transactions/:id/approve', async (c) => {
  // TODO: validate maker-checker and status transition
  return c.json({ ok: true, message: 'Transaction approved' });
});

app.patch('/api/transactions/:id/reject', async (c) => {
  // TODO: require reason, record rejection, audit log
  return c.json({ ok: true, message: 'Transaction rejected' });
});

app.patch('/api/transactions/:id/reverse', async (c) => {
  // TODO: create reversal transaction with reference to original
  return c.json({ ok: true, message: 'Transaction reversed' });
});

export default app;
