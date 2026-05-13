-- Pro request table for admin approval workflow
CREATE TABLE IF NOT EXISTS public.pro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.pro_requests ENABLE ROW LEVEL SECURITY;

-- Users can insert their own requests
CREATE POLICY "Users can create their own pro requests"
  ON public.pro_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own requests
CREATE POLICY "Users can view their own pro requests"
  ON public.pro_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view and update all requests (admin check via profile)
CREATE POLICY "Admins can view all pro requests"
  ON public.pro_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update pro requests"
  ON public.pro_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
