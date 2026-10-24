import { Hono } from 'hono';

const app = new Hono();

app.get('/api/inventory/items', async (c) => {
  // TODO: read inventory items with warehouse and status filters
  return c.json({ ok: true, data: [] });
});

app.get('/api/inventory/items/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ ok: true, data: { id } });
});

app.post('/api/inventory/items', async (c) => {
  // TODO: validate sku, warehouse, and status
  return c.json({ ok: true, message: 'Inventory item created' });
});

app.post('/api/stock-movements', async (c) => {
  // TODO: create stock movement; prevent negative stock unless allowed
  return c.json({ ok: true, message: 'Stock movement created' });
});

app.post('/api/dispatch-notes', async (c) => {
  // TODO: require operation_order_id, origin warehouse, destination, and strong validation
  return c.json({ ok: true, message: 'Dispatch note created' });
});

app.patch('/api/dispatch-notes/:id/dispatch', async (c) => {
  // TODO: prepare dispatch state and attach proof
  return c.json({ ok: true, message: 'Dispatch note dispatched' });
});

app.patch('/api/distributions/:id/receive', async (c) => {
  // TODO: allow partial receive and discrepancy notes
  return c.json({ ok: true, message: 'Distribution received' });
});

export default app;
