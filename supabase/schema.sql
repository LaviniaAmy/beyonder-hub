-- ============================================================
-- Beyonder Hub — Database Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================


-- ── Enums ────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('parent', 'provider', 'admin');
CREATE TYPE category_type AS ENUM ('therapist', 'club', 'education', 'charity', 'product');
CREATE TYPE plan_type AS ENUM ('free', 'founder', 'professional');
CREATE TYPE plan_status AS ENUM ('active', 'trial', 'expired');
CREATE TYPE availability_status AS ENUM ('accepting', 'waitlist', 'closed');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');


-- ── Tables ───────────────────────────────────────────────────

CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'parent',
  name        text,
  email       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE providers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  category_type       category_type NOT NULL,
  description         text,
  location            text,
  lat                 numeric,
  lng                 numeric,
  email               text,
  phone               text,
  website             text,
  coverage_area       text,
  age_range           text,
  delivery_format     text,
  needs_supported     text[],
  plan_type           plan_type NOT NULL DEFAULT 'free',
  plan_status         plan_status NOT NULL DEFAULT 'active',
  is_verified         boolean NOT NULL DEFAULT false,
  is_featured         boolean NOT NULL DEFAULT false,
  is_ehcp_supported   boolean NOT NULL DEFAULT false,
  availability_status availability_status NOT NULL DEFAULT 'accepting',
  is_claimed          boolean NOT NULL DEFAULT false,
  claimed_by          uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_suspended        boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  parent_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE enquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  parent_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_age   text,
  child_name  text,
  needs       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE thread_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id  uuid NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE claim_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id  uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  claimant_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status       claim_status NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);


-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- Helper: read the calling user's role without a per-row join
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;


-- profiles
CREATE POLICY "profiles: own row read"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "profiles: own row update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles: admin all"
  ON profiles FOR ALL
  USING (get_my_role() = 'admin');


-- providers
CREATE POLICY "providers: parents read all"
  ON providers FOR SELECT
  USING (get_my_role() = 'parent');

CREATE POLICY "providers: provider reads own"
  ON providers FOR SELECT
  USING (claimed_by = auth.uid());

CREATE POLICY "providers: provider updates own"
  ON providers FOR UPDATE
  USING (claimed_by = auth.uid());

CREATE POLICY "providers: admin all"
  ON providers FOR ALL
  USING (get_my_role() = 'admin');


-- reviews
CREATE POLICY "reviews: parents read all"
  ON reviews FOR SELECT
  USING (get_my_role() = 'parent');

CREATE POLICY "reviews: parents insert own"
  ON reviews FOR INSERT
  WITH CHECK (parent_id = auth.uid() AND get_my_role() = 'parent');

CREATE POLICY "reviews: providers read their reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = reviews.provider_id
        AND p.claimed_by = auth.uid()
    )
  );

CREATE POLICY "reviews: admin all"
  ON reviews FOR ALL
  USING (get_my_role() = 'admin');


-- enquiries
CREATE POLICY "enquiries: parents read own"
  ON enquiries FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "enquiries: parents insert own"
  ON enquiries FOR INSERT
  WITH CHECK (parent_id = auth.uid() AND get_my_role() = 'parent');

CREATE POLICY "enquiries: providers read their enquiries"
  ON enquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM providers p
      WHERE p.id = enquiries.provider_id
        AND p.claimed_by = auth.uid()
    )
  );

CREATE POLICY "enquiries: admin all"
  ON enquiries FOR ALL
  USING (get_my_role() = 'admin');


-- thread_messages
CREATE POLICY "thread_messages: parties read"
  ON thread_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enquiries e
      WHERE e.id = thread_messages.enquiry_id
        AND (
          e.parent_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM providers p
            WHERE p.id = e.provider_id AND p.claimed_by = auth.uid()
          )
        )
    )
  );

CREATE POLICY "thread_messages: parties insert"
  ON thread_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM enquiries e
      WHERE e.id = thread_messages.enquiry_id
        AND (
          e.parent_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM providers p
            WHERE p.id = e.provider_id AND p.claimed_by = auth.uid()
          )
        )
    )
  );

CREATE POLICY "thread_messages: admin all"
  ON thread_messages FOR ALL
  USING (get_my_role() = 'admin');


-- claim_requests
CREATE POLICY "claim_requests: claimant read own"
  ON claim_requests FOR SELECT
  USING (claimant_id = auth.uid());

CREATE POLICY "claim_requests: claimant insert"
  ON claim_requests FOR INSERT
  WITH CHECK (claimant_id = auth.uid());

CREATE POLICY "claim_requests: admin all"
  ON claim_requests FOR ALL
  USING (get_my_role() = 'admin');
