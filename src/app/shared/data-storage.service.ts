import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService,
        private authService: AuthService) {

    }


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
        return this.authService.user
            .pipe(
                take(1), // takes 1 value of the Observable and unsubscribes.
                exhaustMap( // replace the user Observable with the next one
                    user => {
                        return this.http.get<Recipe[]>(
                            this.recipesUrl,
                            {
                                params: new HttpParams().set('auth', user.token)
                            }
                        );
                    }
                ),
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
