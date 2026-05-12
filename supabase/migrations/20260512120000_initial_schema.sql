-- KinderPartyPlaner V1 - Initial Schema
-- Tables: themes, games, recipes, food_items, goodie_bag_items, invitation_templates

-- ============================================================
-- THEMES (Mottos)
-- ============================================================
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#7C3AED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "themes_read" ON public.themes FOR SELECT USING (true);

-- ============================================================
-- GAMES
-- ============================================================
CREATE TYPE public.location_type AS ENUM ('indoor', 'outdoor', 'both');
CREATE TYPE public.activity_level AS ENUM ('calm', 'active', 'wild');

CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  instructions_de TEXT NOT NULL,
  instructions_en TEXT NOT NULL,
  min_age INT NOT NULL CHECK (min_age >= 3),
  max_age INT NOT NULL CHECK (max_age <= 12),
  location public.location_type NOT NULL DEFAULT 'both',
  activity public.activity_level NOT NULL DEFAULT 'active',
  duration_minutes INT NOT NULL DEFAULT 15,
  min_players INT NOT NULL DEFAULT 3,
  materials_de TEXT[] NOT NULL DEFAULT '{}',
  materials_en TEXT[] NOT NULL DEFAULT '{}',
  theme_slugs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games_read" ON public.games FOR SELECT USING (true);

CREATE INDEX idx_games_age ON public.games (min_age, max_age);
CREATE INDEX idx_games_location ON public.games (location);
CREATE INDEX idx_games_activity ON public.games (activity);

-- ============================================================
-- RECIPES (Kuchen)
-- ============================================================
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_slug TEXT REFERENCES public.themes(slug),
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  instructions_de TEXT NOT NULL,
  instructions_en TEXT NOT NULL,
  servings INT NOT NULL DEFAULT 12,
  prep_time_minutes INT NOT NULL DEFAULT 60,
  ingredients_de JSONB NOT NULL DEFAULT '[]',
  ingredients_en JSONB NOT NULL DEFAULT '[]',
  is_gluten_free BOOLEAN NOT NULL DEFAULT false,
  is_lactose_free BOOLEAN NOT NULL DEFAULT false,
  is_nut_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipes_read" ON public.recipes FOR SELECT USING (true);

-- ============================================================
-- FOOD ITEMS (Essen & Getraenke)
-- ============================================================
CREATE TYPE public.food_category AS ENUM ('savory', 'snack', 'drink', 'cake');

CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category public.food_category NOT NULL,
  quantity_per_child NUMERIC(5,2) NOT NULL DEFAULT 1,
  unit_de TEXT NOT NULL DEFAULT 'Stueck',
  unit_en TEXT NOT NULL DEFAULT 'piece',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "food_items_read" ON public.food_items FOR SELECT USING (true);

-- ============================================================
-- GOODIE BAG ITEMS
-- ============================================================
CREATE TYPE public.budget_tier AS ENUM ('low', 'medium', 'high');

CREATE TABLE public.goodie_bag_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  theme_slug TEXT,
  budget public.budget_tier NOT NULL DEFAULT 'medium',
  price_estimate NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  quantity_per_child INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.goodie_bag_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goodie_bag_items_read" ON public.goodie_bag_items FOR SELECT USING (true);

-- ============================================================
-- INVITATION TEMPLATES
-- ============================================================
CREATE TABLE public.invitation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_slug TEXT REFERENCES public.themes(slug),
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  template_text_de TEXT NOT NULL,
  template_text_en TEXT NOT NULL,
  bg_color TEXT NOT NULL DEFAULT '#FFFDF7',
  accent_color TEXT NOT NULL DEFAULT '#7C3AED',
  emoji TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitation_templates_read" ON public.invitation_templates FOR SELECT USING (true);
