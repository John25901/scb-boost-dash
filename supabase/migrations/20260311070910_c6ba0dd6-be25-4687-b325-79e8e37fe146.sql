
-- Add Mobile Money, NPS, RFM, informal sector and advanced features to clients table
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS volume_momo_mensuel numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS frequence_momo_mensuel integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ratio_momo_vs_bancaire numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_nps integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS commentaire_nps text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS segment_rfm text DEFAULT 'Standard',
  ADD COLUMN IF NOT EXISTS secteur_informel boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS canal_principal text DEFAULT 'Agence',
  ADD COLUMN IF NOT EXISTS score_comportemental numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stabilite_revenus_6mois numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS duree_onboarding_minutes integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS risque_churn numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS derniere_transaction_jours integer DEFAULT 0;

-- Create NPS responses table for tracking
CREATE TABLE IF NOT EXISTS public.nps_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 10),
  commentaire text,
  sentiment text DEFAULT 'neutre',
  sentiment_score numeric DEFAULT 0,
  canal text DEFAULT 'dashboard',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

ALTER TABLE public.nps_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view NPS" ON public.nps_responses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert NPS" ON public.nps_responses
  FOR INSERT TO authenticated WITH CHECK (true);
