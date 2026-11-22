-- Tabla de contratos (necesita las tablas properties y tenants)
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties (id),
  tenant_id INTEGER NOT NULL REFERENCES tenants (id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_amount NUMERIC(10, 2) NOT NULL CHECK (monthly_amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'finalizado', 'cancelado')),
  CHECK (end_date > start_date)
);
