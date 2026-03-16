import { Pantry } from "./pantry";
import { Recipe } from "./recipe";
import { VegetarianRecipe } from "./vegetarianRecipe";
import { RecipeService } from "./storage";
import type { Ingredient, RecipeType } from "./models";

const service = new RecipeService();
let current: Recipe | null = null;

function getElement(id: string): HTMLElement {
    return document.getElementById(id)!;
}

function updateText(id: string, text: string): void {
    getElement(id).textContent = text;
}

function createRecipe(name: string, type: RecipeType): Recipe {
    const id = "recipe_" + Date.now();

    if (type === "vegetarian") {
        return new VegetarianRecipe(id, name);
    }

    return new Recipe(id, name, "standard");
}

function renderPantry(): void {
    const pantryBody = getElement("pantry-body");
    let html = "";

    Pantry.forEach(ingredient => {
        html += `
            <tr>
                <td>${ingredient.name}</td>
                <td><span class="badge cat-${ingredient.category}">${ingredient.category}</span></td>
                <td class="num">${ingredient.per100g.calories}</td>
                <td class="num">${ingredient.per100g.protein}</td>
                <td class="num">${ingredient.per100g.carbs}</td>
                <td class="num">${ingredient.per100g.fat}</td>
                <td><button class="btn btn-add" data-id="${ingredient.id}">Add</button></td>
            </tr>
        `;
    });

    pantryBody.innerHTML = html;

    const buttons = pantryBody.querySelectorAll<HTMLButtonElement>(".btn-add");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const ingredient = Pantry.find(item => item.id === id);

            if (ingredient) {
                addIngredientToRecipe(ingredient);
            }
        });
    });
}

function renderRecipe(): void {
    const recipeBody = getElement("recipe-body");

    if (!current || current.getItems().length === 0) {
        recipeBody.innerHTML = `<tr><td colspan="3" class="empty-cell">No ingredients yet.</td></tr>`;
        renderTotals();
        return;
    }

    let html = "";

    current.getItems().forEach(item => {
        html += `
            <tr>
                <td>${item.ingredient.name}</td>
                <td>
                    <input 
                        class="grams-input" 
                        type="number" 
                        value="${item.grams}" 
                        min="1" 
                        max="9999" 
                        data-id="${item.ingredient.id}" 
                    />
                </td>
                <td><button class="btn btn-remove" data-id="${item.ingredient.id}">✕</button></td>
            </tr>
        `;
    });

    recipeBody.innerHTML = html;

    const gramInputs = recipeBody.querySelectorAll<HTMLInputElement>(".grams-input");
    gramInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (!current) return;

            const grams = parseInt(input.value, 10);
            const id = input.dataset.id;

            if (!isNaN(grams) && grams > 0 && id) {
                current.setGrams(id, grams);
                renderTotals();
            }
        });
    });

    const removeButtons = recipeBody.querySelectorAll<HTMLButtonElement>(".btn-remove");
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (!current) return;

            const id = button.dataset.id;
            if (id) {
                current.removeIngredient(id);
                renderRecipe();
            }
        });
    });

    renderTotals();
}

function renderTotals(): void {
    if (!current) {
        updateText("total-calories", "0");
        updateText("total-protein", "0");
        updateText("total-carbs", "0");
        updateText("total-fat", "0");
        return;
    }

    const totals = current.getTotals();
    updateText("total-calories", totals.calories.toFixed(0));
    updateText("total-protein", totals.protein.toFixed(1));
    updateText("total-carbs", totals.carbs.toFixed(1));
    updateText("total-fat", totals.fat.toFixed(1));
}

function renderWarning(message?: string): void {
    const warning = getElement("warning") as HTMLElement;
    let text = message || "";

    if (!message && current instanceof VegetarianRecipe) {
        text = current.warning;
    }

    warning.textContent = text;
    warning.style.display = text ? "block" : "none";
}

function renderSaved(): void {
    const savedList = getElement("saved-list");
    const recipes = service.loadAll();

    if (recipes.length === 0) {
        savedList.innerHTML = `<p class="empty-cell">No saved recipes yet.</p>`;
        return;
    }

    let html = "";

    recipes.forEach(recipe => {
        html += `
            <div class="saved-row">
                <div class="saved-info">
                    <span class="saved-name">${recipe.name}</span>
                    <span class="badge type-${recipe.type}">${recipe.type}</span>
                </div>
                <div class="saved-actions">
                    <button class="btn btn-load" data-id="${recipe.id}">Load</button>
                    <button class="btn btn-remove" data-id="${recipe.id}">Delete</button>
                </div>
            </div>
        `;
    });

    savedList.innerHTML = html;

    const loadButtons = savedList.querySelectorAll<HTMLButtonElement>(".btn-load");
    loadButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            if (id) {
                loadRecipe(id);
            }
        });
    });

    const deleteButtons = savedList.querySelectorAll<HTMLButtonElement>(".btn-remove");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            if (id) {
                deleteRecipe(id);
            }
        });
    });
}

function addIngredientToRecipe(ingredient: Ingredient): void {
    if (!current) {
        renderWarning("Create a recipe first.");
        return;
    }

    if (current instanceof VegetarianRecipe) {
        current.warning = "";
    }

    current.addIngredient(ingredient);
    renderWarning();
    renderRecipe();
}

function saveRecipe(): void {
    if (!current) {
        renderWarning("No active recipe to save.");
        return;
    }

    try {
        service.saveRecipe(current);
        showToast("Recipe saved!");
        renderSaved();
    } catch (error) {
        renderWarning(String(error));
    }
}

function loadRecipe(id: string): void {
    try {
        current = service.loadRecipe(id);

        (getElement("recipe-name") as HTMLInputElement).value = current.name;
        (getElement("recipe-type") as HTMLSelectElement).value = current.type;

        updateText("recipe-id", current.id);
        updateText("recipe-title", current.name);

        renderWarning();
        renderRecipe();
        showToast(`Loaded "${current.name}"`);
    } catch (error) {
        renderWarning(String(error));
    }
}

function deleteRecipe(id: string): void {
    try {
        service.deleteRecipe(id);

        if (current && current.id === id) {
            current = null;
            renderRecipe();
        }

        renderSaved();
        showToast("Deleted.");
    } catch (error) {
        renderWarning(String(error));
    }
}

function showToast(message: string): void {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2200);
}

getElement("new-recipe-btn").addEventListener("click", () => {
    const nameInput = getElement("recipe-name") as HTMLInputElement;
    const typeInput = getElement("recipe-type") as HTMLSelectElement;

    const name = nameInput.value.trim();
    const type = typeInput.value as RecipeType;

    if (!name) {
        renderWarning("Please enter a recipe name.");
        return;
    }

    current = createRecipe(name, type);

    updateText("recipe-id", current.id);
    updateText("recipe-title", current.name);

    renderWarning();
    renderRecipe();
    showToast(`"${name}" created!`);
});

getElement("save-btn").addEventListener("click", () => {
    saveRecipe();
});

getElement("clear-btn").addEventListener("click", () => {
    current = null;
    (getElement("recipe-name") as HTMLInputElement).value = "";
    updateText("recipe-id", "");
    updateText("recipe-title", "—");
    renderWarning();
    renderRecipe();
});

getElement("toggle-saved-btn").addEventListener("click", () => {
    const panel = getElement("saved-panel");
    const isHidden = panel.classList.toggle("hidden");

    if (!isHidden) {
        renderSaved();
    }
});

getElement("add-pantry-btn").addEventListener("click", () => {
    const warning = getElement("pantry-warning") as HTMLElement;
    const name = (getElement("new-name") as HTMLInputElement).value.trim();
    const category = (getElement("new-category") as HTMLSelectElement).value;
    const calories = parseFloat((getElement("new-cal") as HTMLInputElement).value);
    const protein = parseFloat((getElement("new-protein") as HTMLInputElement).value);
    const carbs = parseFloat((getElement("new-carbs") as HTMLInputElement).value);
    const fat = parseFloat((getElement("new-fat") as HTMLInputElement).value);

    if (!name) {
        warning.textContent = "Name is required.";
        warning.style.display = "inline";
        return;
    }

    if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
        warning.textContent = "Please fill in all nutrition fields.";
        warning.style.display = "inline";
        return;
    }

    if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
        warning.textContent = "Values cannot be negative.";
        warning.style.display = "inline";
        return;
    }

    warning.style.display = "none";

    const newIngredient: Ingredient = {
        id: name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now(),
        name: name,
        category: category as Ingredient["category"],
        per100g: {
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        }
    };

    Pantry.push(newIngredient);
    renderPantry();

    (getElement("new-name") as HTMLInputElement).value = "";
    (getElement("new-cal") as HTMLInputElement).value = "";
    (getElement("new-protein") as HTMLInputElement).value = "";
    (getElement("new-carbs") as HTMLInputElement).value = "";
    (getElement("new-fat") as HTMLInputElement).value = "";

    showToast(`"${name}" added to pantry!`);
});

renderPantry();
renderRecipe();