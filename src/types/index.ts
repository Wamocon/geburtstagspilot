export interface Theme {
  id: string;
  slug: string;
  name_de: string;
  name_en: string;
  emoji: string;
  color: string;
}

export type LocationType = 'indoor' | 'outdoor' | 'both';
export type ActivityLevel = 'calm' | 'active' | 'wild';
export type FoodCategory = 'savory' | 'snack' | 'drink' | 'cake';
export type BudgetTier = 'low' | 'medium' | 'high';

export interface Game {
  id: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  instructions_de: string;
  instructions_en: string;
  min_age: number;
  max_age: number;
  location: LocationType;
  activity: ActivityLevel;
  duration_minutes: number;
  min_players: number;
  materials_de: string[];
  materials_en: string[];
  theme_slugs: string[];
}

export interface Recipe {
  id: string;
  theme_slug: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  instructions_de: string;
  instructions_en: string;
  servings: number;
  prep_time_minutes: number;
  ingredients_de: RecipeIngredient[];
  ingredients_en: RecipeIngredient[];
  is_gluten_free: boolean;
  is_lactose_free: boolean;
  is_nut_free: boolean;
}

export interface RecipeIngredient {
  item: string;
  amount: string;
}

export interface FoodItem {
  id: string;
  name_de: string;
  name_en: string;
  category: FoodCategory;
  quantity_per_child: number;
  unit_de: string;
  unit_en: string;
}

export interface GoodieBagItem {
  id: string;
  name_de: string;
  name_en: string;
  theme_slug: string | null;
  budget: BudgetTier;
  price_estimate: number;
  quantity_per_child: number;
}

export interface InvitationTemplate {
  id: string;
  theme_slug: string;
  name_de: string;
  name_en: string;
  template_text_de: string;
  template_text_en: string;
  bg_color: string;
  accent_color: string;
  emoji: string;
}

// Wizard Types
export interface AllergenPreferences {
  glutenFree: boolean;
  lactoseFree: boolean;
  nutFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  customNotes: string;
}

export interface WizardData {
  age: number;
  guestCount: number;
  location: LocationType;
  themeSlug: string;
  duration: number;
  budget: string;
  birthdayChildName: string;
  allergens: AllergenPreferences;
  guestNames: string[];
}

// Guest Management Types
export type RsvpStatus = 'pending' | 'accepted' | 'declined';
export type ParentRole = 'host' | 'cohost' | 'guest';

export interface GuestEntry {
  id: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  rsvpStatus: RsvpStatus;
  allergens: string;
  role: ParentRole;
  notes: string;
}

// Custom Recipe
export interface CustomRecipe {
  id: string;
  name: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  servings: number;
  ingredients: RecipeIngredient[];
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isNutFree: boolean;
}

// Invitation Styles
export type InvitationStyle = 'classic' | 'modern' | 'playful' | 'elegant';

export interface InvitationConfig {
  style: InvitationStyle;
  backgroundImage: string;
  customText: string;
  showRsvpLink: boolean;
}

export interface PartyPlan {
  wizard: WizardData;
  theme: Theme;
  schedule: ScheduleItem[];
  games: Game[];
  reserveGames: Game[];
  recipe: Recipe;
  foodItems: FoodItemWithQuantity[];
  shoppingList: ShoppingCategory[];
  invitation: InvitationTemplate;
  goodieBagItems: GoodieBagItem[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  title_de: string;
  title_en: string;
  duration: number;
  type: 'arrival' | 'greeting' | 'game' | 'food' | 'cake' | 'gifts' | 'free' | 'goodbye' | 'custom';
  gameId?: string;
  isCustom?: boolean;
}

export interface FoodItemWithQuantity extends FoodItem {
  totalQuantity: number;
}

export interface ShoppingCategory {
  category_de: string;
  category_en: string;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  name_de: string;
  name_en: string;
  quantity: string;
  checked: boolean;
}

export type Locale = 'de' | 'en';

// Auth & Profile Types
export type UserRole = 'user' | 'admin';
export type UserTier = 'free' | 'pro';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  tier: UserTier;
  plan_count: number;
  created_at: string;
  updated_at: string;
}

export interface SavedPlan {
  id: string;
  user_id: string;
  title: string;
  wizard_data: WizardData;
  plan_data: PartyPlan;
  is_shared: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export const TIER_LIMITS: Record<UserTier, { maxPlans: number; features: string[] }> = {
  free: {
    maxPlans: 3,
    features: ['basic_plan', 'guest_list', 'shopping_list'],
  },
  pro: {
    maxPlans: 50,
    features: [
      'basic_plan',
      'guest_list',
      'shopping_list',
      'collaboration',
      'rsvp_tracking',
      'ai_personalization',
      'ai_chat',
      'ai_game_generation',
      'ai_invitation_text',
      'task_manager',
      'child_profiles',
      'budget_tracker',
      'premium_themes',
      'unlimited_plans',
      'persistent_share_links',
    ],
  },
};
