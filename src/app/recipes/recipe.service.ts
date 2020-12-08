import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';


@Injectable()
export class RecipeService {
    constructor(private shoppingListService: ShoppingListService) {}


    recipesChanged = new Subject<Recipe[]>();
    formIngredientsChanged = new Subject<FormGroup[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Vegetarian Meal',
    //         'What else you need to say?',
    //         'https://i.ytimg.com/vi/nYhf16btqck/maxresdefault.jpg',
    //         [
    //             new Ingredient('Vegetarian Meal', 2),
    //             new Ingredient('French Fries', 20)
    //         ]),
    //     new Recipe(
    //         'Cookie Tasty!!',
    //         'Fantastic enjoy!',
    //         'https://i.ytimg.com/vi/nYhf16btqck/maxresdefault.jpg',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Vegy Meal', 4)
    //         ])
    // ];

    private recipes: Recipe[] = [];

    setRecipe(recipes: Recipe[]): void {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice(); // slice in order to copy the array and not give the reference directly.
    }

    getRecipe(index: number): Recipe {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number): void {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
