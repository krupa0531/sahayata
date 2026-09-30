-- PostgreSQL schema for Sahayata UPI credit scoring module
-- Run: psql -U postgres -d sahayata -f schema.postgresql.sql

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(32) PRIMARY KEY,
    full_name       VARCHAR(120) NOT NULL,
    mobile          VARCHAR(15) NOT NULL UNIQUE,
    email           VARCHAR(120),
    password_hash   TEXT NOT NULL,
    password_salt   TEXT NOT NULL,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    area            VARCHAR(120),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upi_transactions (
    id              SERIAL PRIMARY KEY,
    profile_id      VARCHAR(32) NOT NULL DEFAULT 'DEMO-VENDOR',
    txn_date        TIMESTAMPTZ NOT NULL,
    amount          NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    customer_id     VARCHAR(64) NOT NULL,
    txn_type        VARCHAR(20) NOT NULL DEFAULT 'credit'
                    CHECK (txn_type IN ('credit', 'debit', 'inflow', 'outflow', 'received', 'withdrawal'))
);

CREATE INDEX IF NOT EXISTS idx_upi_profile_date ON upi_transactions (profile_id, txn_date);
CREATE INDEX IF NOT EXISTS idx_upi_customer ON upi_transactions (profile_id, customer_id);
