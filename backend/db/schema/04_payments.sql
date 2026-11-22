CREATE TABLE IF NOT EXISTS payments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  contract_id INTEGER NOT NULL REFERENCES contracts (id),
  due_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagado')),
  paid_date DATE
);