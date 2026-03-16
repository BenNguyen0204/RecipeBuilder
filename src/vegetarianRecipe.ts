import type { Ingredient } from "./models";
import { Recipe } from "./recipe";

export class VegetarianRecipe extends Recipe {
    public warning: string;

    constructor(id: string, name: string) {
        super(id, name, "vegetarian");
        this.warning = "";
    }

    override addIngredient(ingredient: Ingredient): void {
        if (ingredient.category === "meat") {
            this.warning = "Vegetarian recipe cannot add meat.";
            return;
        }
        this.warning = "";
        super.addIngredient(ingredient);  
    }
}