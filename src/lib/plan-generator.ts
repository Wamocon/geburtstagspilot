import type {
  WizardData,
  Game,
  FoodItem,
  GoodieBagItem,
  ScheduleItem,
  ShoppingCategory,
  ShoppingItem,
  FoodItemWithQuantity,
} from "@/types";

export function generateSchedule(
  wizard: WizardData,
  games: Game[],
  startTime = "14:00"
): ScheduleItem[] {
  const totalMinutes = wizard.duration * 60;
  const [startHour, startMin] = startTime.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMin;

  function formatTime(totalMins: number): string {
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  function addItem(
    type: ScheduleItem["type"],
    titleDe: string,
    titleEn: string,
    duration: number,
    gameId?: string
  ): ScheduleItem {
    const item: ScheduleItem = {
      id: crypto.randomUUID(),
      time: formatTime(currentMinutes),
      title_de: titleDe,
      title_en: titleEn,
      duration,
      type,
      gameId,
    };
    currentMinutes += duration;
    return item;
  }

  const schedule: ScheduleItem[] = [];

  // Standard phases based on duration
  const arrivalDuration = 20;
  const greetingDuration = 5;
  const cakeDuration = 25;
  const giftsDuration = 15;
  const goodbyeDuration = 15;

  const fixedTime = arrivalDuration + greetingDuration + cakeDuration + giftsDuration + goodbyeDuration;
  const gameTime = totalMinutes - fixedTime;
  const gameSlots = Math.min(3, games.length);
  const gameDuration = gameSlots > 0 ? Math.floor(gameTime / gameSlots) : 0;

  schedule.push(addItem("arrival", "Ankommen & Freispiel", "Arrival & Free Play", arrivalDuration));
  schedule.push(addItem("greeting", "Begrüßung", "Welcome", greetingDuration));

  for (let i = 0; i < gameSlots; i++) {
    const game = games[i];
    if (i === 1) {
      // After first game, insert cake/food
      schedule.push(addItem("cake", "Kuchen & Essen", "Cake & Food", cakeDuration));
    }
    schedule.push(
      addItem(
        "game",
        game.name_de,
        game.name_en,
        Math.min(gameDuration, game.duration_minutes + 5),
        game.id
      )
    );
  }

  if (gameSlots <= 1) {
    schedule.push(addItem("cake", "Kuchen & Essen", "Cake & Food", cakeDuration));
  }

  schedule.push(addItem("gifts", "Geschenke auspacken", "Unwrap Gifts", giftsDuration));
  schedule.push(addItem("goodbye", "Freispiel & Abholung", "Free Play & Pickup", goodbyeDuration));

  return schedule;
}

export function calculateFoodQuantities(
  foodItems: FoodItem[],
  guestCount: number
): FoodItemWithQuantity[] {
  const buffer = 1.1; // 10% buffer
  return foodItems.map((item) => ({
    ...item,
    totalQuantity: Math.ceil(item.quantity_per_child * guestCount * buffer),
  }));
}

export function generateShoppingList(
  foodItems: FoodItemWithQuantity[],
  games: Game[],
  goodieItems: GoodieBagItem[],
  guestCount: number,
  locale: "de" | "en"
): ShoppingCategory[] {
  const categories: ShoppingCategory[] = [];

  // Food items
  const foodCategory: ShoppingItem[] = foodItems
    .filter((item) => item.category === "savory" || item.category === "cake")
    .map((item) => ({
      name_de: item.name_de,
      name_en: item.name_en,
      quantity: `${item.totalQuantity} ${locale === "de" ? item.unit_de : item.unit_en}`,
      checked: false,
    }));

  const snackCategory: ShoppingItem[] = foodItems
    .filter((item) => item.category === "snack")
    .map((item) => ({
      name_de: item.name_de,
      name_en: item.name_en,
      quantity: `${item.totalQuantity} ${locale === "de" ? item.unit_de : item.unit_en}`,
      checked: false,
    }));

  const drinkCategory: ShoppingItem[] = foodItems
    .filter((item) => item.category === "drink")
    .map((item) => ({
      name_de: item.name_de,
      name_en: item.name_en,
      quantity: `${item.totalQuantity} ${locale === "de" ? item.unit_de : item.unit_en}`,
      checked: false,
    }));

  if (foodCategory.length > 0 || snackCategory.length > 0) {
    categories.push({
      category_de: "Lebensmittel",
      category_en: "Food",
      items: [...foodCategory, ...snackCategory],
    });
  }

  if (drinkCategory.length > 0) {
    categories.push({
      category_de: "Getränke",
      category_en: "Drinks",
      items: drinkCategory,
    });
  }

  // Game materials
  const materialSet = new Map<string, ShoppingItem>();
  for (const game of games) {
    const materials = locale === "de" ? game.materials_de : game.materials_en;
    const materialsOther = locale === "de" ? game.materials_en : game.materials_de;
    materials.forEach((mat, i) => {
      if (!materialSet.has(mat)) {
        materialSet.set(mat, {
          name_de: locale === "de" ? mat : (materialsOther[i] ?? mat),
          name_en: locale === "en" ? mat : (materialsOther[i] ?? mat),
          quantity: "1",
          checked: false,
        });
      }
    });
  }

  if (materialSet.size > 0) {
    categories.push({
      category_de: "Bastelmaterial & Spielzubehör",
      category_en: "Craft Materials & Game Supplies",
      items: Array.from(materialSet.values()),
    });
  }

  // Goodie bag items
  const goodieCategory: ShoppingItem[] = goodieItems.map((item) => ({
    name_de: item.name_de,
    name_en: item.name_en,
    quantity: `${item.quantity_per_child * guestCount}`,
    checked: false,
  }));

  if (goodieCategory.length > 0) {
    categories.push({
      category_de: "Mitgebsel-Inhalt",
      category_en: "Goodie Bag Contents",
      items: goodieCategory,
    });
  }

  return categories;
}
