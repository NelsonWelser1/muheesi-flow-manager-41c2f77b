
-- Create the payments_receipts table
CREATE TABLE IF NOT EXISTS "public"."payments_receipts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "payment_number" TEXT NOT NULL,
  "payment_type" TEXT NOT NULL,
  "party_name" TEXT NOT NULL,
  "payment_date" DATE NOT NULL,
  "amount" DECIMAL(15, 2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'UGX',
  "payment_method" TEXT NOT NULL,
  "reference_number" TEXT,
  "status" TEXT NOT NULL,
  "notes" TEXT,
  "user_id" UUID
);

-- Add an index for faster queries
CREATE INDEX IF NOT EXISTS "payments_receipts_payment_type_idx" ON "public"."payments_receipts" ("payment_type");
CREATE INDEX IF NOT EXISTS "payments_receipts_status_idx" ON "public"."payments_receipts" ("status");
CREATE INDEX IF NOT EXISTS "payments_receipts_payment_date_idx" ON "public"."payments_receipts" ("payment_date");

-- Enable Row Level Security
ALTER TABLE "public"."payments_receipts" ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now (since authentication is disabled)
CREATE POLICY "Enable all operations for all users" ON "public"."payments_receipts"
  FOR ALL USING (true) WITH CHECK (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION "public"."set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_payments_receipts_updated_at"
BEFORE UPDATE ON "public"."payments_receipts"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_updated_at"();

-- Add comment for documentation
COMMENT ON TABLE "public"."payments_receipts" IS 'Stores all payment and receipt records for the accounting system';
