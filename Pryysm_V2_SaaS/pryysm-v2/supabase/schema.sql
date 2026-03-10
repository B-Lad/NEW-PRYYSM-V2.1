-- ============================================================
-- Pryysm V2 — Supabase Database Schema
-- Extends V1 schema with spools, maintenance, notifications
-- Run in Supabase SQL Editor after schema.sql (V1)
-- ============================================================

-- ── V1 TABLES (from PrintOps) ────────────────────────────────
-- machines, jobs, materials, telemetry — keep as-is
-- Updated: topic prefix changed from 'printops/' to 'pryysm/'

-- ── SPOOLS (Filament inventory tracking) ─────────────────────
CREATE TABLE IF NOT EXISTS spools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  material_id   UUID REFERENCES materials(id) ON DELETE SET NULL,
  brand         TEXT,
  color_name    TEXT,
  weight_g      NUMERIC(8,2) NOT NULL DEFAULT 1000,
  remaining_g   NUMERIC(8,2) NOT NULL DEFAULT 1000,
  lot_number    TEXT,
  machine_id    UUID REFERENCES machines(id) ON DELETE SET NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-deduct filament when job completes (rough estimate)
CREATE OR REPLACE FUNCTION deduct_spool_on_job_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Rough: volume_cm3 * 1.24 g/cm3 (PLA density)
    UPDATE spools
    SET remaining_g = GREATEST(0, remaining_g - COALESCE(NEW.volume_cm3 * 1.24, 0))
    WHERE machine_id = NEW.machine_id
      AND remaining_g > 0
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deduct_spool
  AFTER UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION deduct_spool_on_job_complete();

-- ── MAINTENANCE LOG ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id    UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  scheduled_at  TIMESTAMPTZ,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_maintenance_updated_at
  BEFORE UPDATE ON maintenance_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('error','warning','info','success')),
  title      TEXT NOT NULL,
  body       TEXT,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-notify on machine error
CREATE OR REPLACE FUNCTION notify_on_machine_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'error' AND (OLD.status IS NULL OR OLD.status != 'error') THEN
    INSERT INTO notifications (user_id, type, title, body)
    VALUES (NEW.user_id, 'error', NEW.name || ' Error', COALESCE(NEW.error_msg, 'Machine entered error state'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_machine_error_notify
  AFTER INSERT OR UPDATE ON machines
  FOR EACH ROW EXECUTE FUNCTION notify_on_machine_error();

-- ── RLS FOR NEW TABLES ────────────────────────────────────────
ALTER TABLE spools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_spools"        ON spools           FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_maintenance"   ON maintenance_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_notifications" ON notifications    FOR ALL USING (auth.uid() = user_id);

-- ── REALTIME (add new tables) ──────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE spools, notifications;

-- ── STORAGE (for STL uploads) ─────────────────────────────────
-- Run in Supabase Dashboard: Storage → New Bucket
-- Name: stl-files, Public: false
-- Or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('stl-files', 'stl-files', false) ON CONFLICT DO NOTHING;

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_jobs_user_status   ON jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_machine        ON jobs(machine_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_machine   ON telemetry(machine_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifs_user_unread  ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_spools_machine      ON spools(machine_id);
