
-- Fix overly permissive INSERT policy - restrict to user's own inserts
DROP POLICY IF EXISTS "Authenticated users can insert NPS" ON public.nps_responses;
CREATE POLICY "Authenticated users can insert NPS" ON public.nps_responses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
