import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})

export class RecipeDetailComponent implements OnInit {
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }


  recipe: Recipe;
  id: number;

  ngOnInit(): void {
    // const id = this.route.snapshot.params.id; // if we don't the component actively, while being on the same component
    this.route.params // asynchronously subscribing to the observable,
                      // use it when we do change the component actively, while being on the same component
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      );
  }

  onAddToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(): void {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'], { relativeTo: this.route });
  }

  recipeHasIngredients(recipe: Recipe): boolean {
    return recipe.ingredients.length > 0;
  }
}
