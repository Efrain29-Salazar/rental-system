-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  address VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('casa', 'departamento', 'local', 'oficina')),
  monthly_price NUMERIC(10, 2) NOT NULL CHECK (monthly_price > 0),
  owner VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'arrendada', 'mantencion'))
);
