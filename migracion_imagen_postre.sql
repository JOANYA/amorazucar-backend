-- Agrega la columna para guardar la ruta de la foto de cada postre
-- (se sube desde POST /api/postres/:id/imagen y se sirve como estática
-- en /images/postres/<archivo>, igual que los comprobantes de pago).
-- Ejecutar una sola vez sobre la base de datos gestionpasteleriadulceamor.

ALTER TABLE postre
  ADD COLUMN IF NOT EXISTS imagen VARCHAR(255) NULL DEFAULT NULL
  AFTER estado;
