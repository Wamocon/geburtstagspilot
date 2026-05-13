-- KinderPartyPlaner V2 - Auth, Profiles, Saved Plans
-- Tables: profiles, saved_plans
-- Trigger: auto-create profile on auth.users insert

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  plan_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Users can update their own profile (display_name only)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (role, tier)
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SAVED PLANS
-- ============================================================
CREATE TABLE public.saved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  wizard_data JSONB NOT NULL,
  plan_data JSONB NOT NULL,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_plans ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_saved_plans_user ON public.saved_plans(user_id);
CREATE INDEX idx_saved_plans_share ON public.saved_plans(share_token) WHERE share_token IS NOT NULL;

-- Users can read their own plans
CREATE POLICY "plans_select_own" ON public.saved_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can read shared plans via share_token (handled in app logic)
CREATE POLICY "plans_select_shared" ON public.saved_plans
  FOR SELECT USING (is_shared = true AND share_token IS NOT NULL);

-- Admins can read all plans
CREATE POLICY "plans_select_admin" ON public.saved_plans
  FOR SELECT USING (public.is_admin());

-- Users can insert their own plans
CREATE POLICY "plans_insert_own" ON public.saved_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
CREATE POLICY "plans_update_own" ON public.saved_plans
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own plans
CREATE POLICY "plans_delete_own" ON public.saved_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any plan
CREATE POLICY "plans_delete_admin" ON public.saved_plans
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- UPDATE plan_count trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_plan_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET plan_count = plan_count + 1, updated_at = now()
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET plan_count = GREATEST(plan_count - 1, 0), updated_at = now()
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_plan_count_change
  AFTER INSERT OR DELETE ON public.saved_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_plan_count();

-- ============================================================
-- Updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_saved_plans_updated_at
  BEFORE UPDATE ON public.saved_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
