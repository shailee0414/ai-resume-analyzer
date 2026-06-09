export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const msg = err.expose ? err.message : err.message || 'Internal server error';
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: msg });
}

export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.expose = true;
  return err;
}
