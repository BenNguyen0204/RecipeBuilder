export type FoodCategory = "meat" | "protein" | "vegetable" | "grain" | "dairy" | "fat" | "fruit" | "other";
export type RecipeType = "standard" | "vegetarian"

// Describes the nutritional values
export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

// Represents a single food ingredient. Ex: chicken breast
export interface Ingredient {
    id: string;
    name: string;
    category: FoodCategory;
    per100g: Nutrition;
}

// Represents one ingredient inside a recipe. Ex: fried chicken using 100g of chicken breast
export interface RecipeItem {
    ingredient: Ingredient;
    grams: number;
}

// Represents a full recipe that can be saved or loaded.
export interface SavedRecipe {
    id: string;
    name: string;
    type: RecipeType;
    items: RecipeItem[];
}