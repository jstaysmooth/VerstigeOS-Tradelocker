
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database import engine
from sqlalchemy import text

SQL = """
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS signals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol        TEXT NOT NULL,
  direction     TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  entry         NUMERIC NOT NULL,
  stop_loss     NUMERIC NOT NULL,
  take_profit   NUMERIC NOT NULL,
  risk_percent  NUMERIC DEFAULT 1.0,
  rr_ratio      NUMERIC,
  timeframe     TEXT,
  notes         TEXT,
  source        TEXT DEFAULT 'api',
  status        TEXT DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected','executed')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Trade Executions Table
CREATE TABLE IF NOT EXISTS trade_executions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id),
  signal_id         UUID REFERENCES signals(id),
  broker            TEXT DEFAULT 'tradelocker',
  account_id        TEXT,
  symbol            TEXT NOT NULL,
  direction         TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  lot_size          NUMERIC NOT NULL,
  entry             NUMERIC,
  stop_loss         NUMERIC,
  take_profit       NUMERIC,
  broker_order_id   TEXT,
  status            TEXT DEFAULT 'executed',
  executed_at       TIMESTAMPTZ DEFAULT now(),
  raw_response      JSONB
);

-- Create index if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_executions_user') THEN
        CREATE INDEX idx_executions_user ON trade_executions(user_id, executed_at DESC);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_executions_signal') THEN
        CREATE INDEX idx_executions_signal ON trade_executions(signal_id);
    END IF;
END
$$;
"""

def init_schema():
    try:
        with engine.connect() as connection:
            # Execute the SQL
            # Splitting by semicolon as a simple way to execute multiple statements if needed, 
            # though sqlalchemy can usually handle it or we use text()
            connection.execute(text(SQL))
            connection.commit()
            print("Successfully initialized Signal Engine schema!")
    except Exception as e:
        print(f"Failed to initialize schema: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_schema()
