import type { Ingredient } from "./models";

export const Pantry: Ingredient[] = [
    {
        id: "chicken",
        name: "Chicken Breast",
        category: "meat",
        per100g:
        {
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6
        }
    },
    {
        id: "salmon",
        name: "Salmon",
        category: "meat",
        per100g:
        { 
            calories: 208,
            protein: 20, 
            carbs: 0, 
            fat: 13 
        }
    },
    { 
        id: "tofu",
        name: "Tofu",
        category: "protein",
        per100g:
        { 
            calories: 76,
            protein: 8,
            carbs: 1.9,
            fat: 4.8
        } 
    },
    { 
        id: "eggs",
        name: "Eggs",
        category:
        "protein",
        per100g:
        { 
            calories: 155,
            protein: 13,
            carbs: 1.1,
            fat: 11
        } 
    },
    { 
        id: "rice",
        name: "Cooked Rice",
        category: "grain",
        per100g:
        { 
            calories: 130,
            protein: 2.4,
            carbs: 28.2,
            fat: 0.3
        } 
    },
    { 
        id: "oats",
        name: "Oats",
        category: "grain",
        per100g: 
        { 
            calories: 389,
            protein: 17,
            carbs: 66,
            fat: 7 
        }
    },
    {
        id: "milk",
        name: "Milk (2%)",
        category: "dairy",
        per100g:
        {
            calories: 50,
            protein: 3.4,
            carbs: 5,
            fat: 2
        } 
    },
    {
        id: "broccoli",
        name: "Broccoli",
        category: "vegetable",
        per100g:
        {
            calories: 34,
            protein: 2.8,
            carbs: 6.6,
            fat: 0.4
        }
    },
    {
        id: "spinach",
        name: "Spinach",
        category: "vegetable",
        per100g:
        {
            calories: 23,
            protein: 2.9,
            carbs: 3.6,
            fat: 0.4
        }
    },
    {
        id: "banana",
        name: "Banana",
        category: "fruit",
        per100g:
        {
            calories: 89,
            protein: 1.1,
            carbs: 22.8, 
            fat: 0.3
        }
    },
    {
        id: "almonds",
        name: "Almonds",
        category: "fat",
        per100g:
        {
            calories: 579,
            protein: 21.2,
            carbs: 21.6,
            fat: 49.9
        }
    },
    {
        id: "oliveoil",
        name: "Olive Oil",
        category: "fat",
        per100g:
        {
            calories: 884,
            protein: 0,
            carbs: 0,
            fat: 100
        }
    },
    {
        id: "sugar",
        name: "Sugar",
        category: "other",
        per100g:
        {
            calories: 387,
            protein: 0,
            carbs: 100,
            fat: 0
        }
    },
]