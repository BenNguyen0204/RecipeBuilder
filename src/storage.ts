import { Recipe } from "./recipe";
import { VegetarianRecipe } from "./vegetarianRecipe";
import type { SavedRecipe } from "./models";

const STORAGE_KEY = "recipes";

function getAllRecipes(): SavedRecipe[] {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data) as SavedRecipe[];
    } catch {
        return [];
    }
}


function makeRecipe(saved: SavedRecipe): Recipe {
    let recipe: Recipe;
    if (saved.type === "vegetarian") {
        recipe = new VegetarianRecipe(saved.id, saved.name);
    } else {
        recipe = new Recipe(saved.id, saved.name, "standard");
    }

    saved.items.forEach(item => {
        recipe.loadItem(item);
    });

    return recipe;
}

export class RecipeService {
    saveRecipe(recipe: Recipe): void {
        const recipes = getAllRecipes().filter(r => r.id !== recipe.id);
        recipes.push(recipe.saveRecipe());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }

    loadRecipe(recipeId: string): Recipe {
        const saved = getAllRecipes().find(r => r.id === recipeId);
        if (!saved) {
            throw new Error(`Recipe "${recipeId}" not found.`);
        }
        return makeRecipe(saved);
    }

    loadAll(): Recipe[] {
        return getAllRecipes().map(recipe => makeRecipe(recipe));
    }

    deleteRecipe(recipeId: string): void {
        const recipes = getAllRecipes().filter(r => r.id !== recipeId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
}