import type { Ingredient, RecipeItem, RecipeType, Nutrition, SavedRecipe } from "./models";

export class Recipe {
    public id: string;
    public name: string;
    public type: RecipeType;
    protected items: RecipeItem[] = [];

    constructor(id: string, name: string, type: RecipeType = "standard") {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    addIngredient(ingredient: Ingredient): void {
        const found = this.items.find(item => item.ingredient.id === ingredient.id);
        if (found) {
            found.grams += 100;
        } else {
            this.items.push(
                {
                    ingredient,
                    grams: 100
                }
            )
        }
    }

    removeIngredient(id: string): void {
        this.items = this.items.filter(item => item.ingredient.id !== id);
    }

    setGrams(id: string, grams: number): void {
        const item = this.items.find(item => item.ingredient.id == id);
        if (item) {
            item.grams = grams;
        }
    }

    loadItem(item: RecipeItem): void {
        this.items.push(item);
    }

    getItems(): RecipeItem[] {
        return this.items;
    }

    getTotals(): Nutrition {
        const totals: Nutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        for (const item of this.items) {
            const factor = item.grams / 100;
            totals.calories += item.ingredient.per100g.calories * factor;
            totals.protein += item.ingredient.per100g.protein * factor;
            totals.carbs += item.ingredient.per100g.carbs * factor;
            totals.fat += item.ingredient.per100g.fat * factor;
        }
        return totals;
    }

    saveRecipe(): SavedRecipe {
        return { 
            id: this.id,
            name: this.name,
            type: this.type,
            items: this.getItems()
        };
    }
}