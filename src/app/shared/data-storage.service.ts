import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) { }


    recipesUrl = 'https://recipe-bok-44b1d-default-rtdb.firebaseio.com/recipes.json';
    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.http.put(this.recipesUrl, recipes)
            .subscribe((response) => {
                console.log(response);
            });
    }

    fetchRecipes(): Observable<any> {
        // this.authService.user.subscribe().unsubscribe(); -- instead of this
        return this.http
            .get<Recipe[]>(this.recipesUrl)
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap((recipes) => {
                    this.recipeService.setRecipe(recipes);
                })
            );
    }
}
