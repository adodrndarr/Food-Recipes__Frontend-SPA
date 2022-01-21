import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';


const INITIAL_RECIPE = 'Delicious Example Pizza';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) { }


    recipesUrl = 'https://recipe-bok-44b1d-default-rtdb.firebaseio.com/recipes.json';

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.http.put(this.recipesUrl, recipes)
            .subscribe((response) => {

                console.log(`Stored the following recipe/s: `);
                console.log(response); // ------ DEBUG

                const currentRecipes = this.recipeService.getRecipes();
                this.updateRecipes(currentRecipes);
            });
    }

    fetchRecipes(): Observable<any> {
        return this.http
            .get<Recipe[]>(this.recipesUrl)
            .pipe(
                map(recipes => {
                    if (!recipes)
                        recipes = this.initializeRecipes();

                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap((recipes) => this.recipeService.setRecipe(recipes))
            );
    }

    initializeRecipes(): Recipe[] {
        return [
            new Recipe(
                INITIAL_RECIPE,
                'Please add your own recipe this Pizza is mine :P',
                'https://th.bing.com/th/id/OIP.qmbkst9oa8eD1-eocWFMXwHaEz?w=284&h=184&c=7&o=5&pid=1.7',
                [
                    new Ingredient('Please add your own recipe to remove this example', 1)
                ])
        ];
    }

    updateRecipes(recipes: Recipe[]): void {
        const removeInitialRecipe = (recipes.length > 1) && (recipes[0]?.name === INITIAL_RECIPE);

        if (removeInitialRecipe) {
            recipes.splice(0, 1);

            this.recipeService.setRecipe(recipes);
            this.storeRecipes();
        }

        if (recipes.length === 0)
            this.fetchRecipes().subscribe();
    }
}
