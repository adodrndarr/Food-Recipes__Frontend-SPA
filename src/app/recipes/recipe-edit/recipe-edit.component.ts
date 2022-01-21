import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) { }


  id: number;
  editMode = false;
  recipeForm: FormGroup = this.createForm({} as Recipe, new FormArray([]));
  recipeFormGroups: FormGroup[] = [];
  formIngredientsSub: Subscription;

  ngOnInit(): void {
    this.selectIdFromRoute();
    this.initRecipe();

    this.formIngredientsSub = this.recipeService.formIngredientsChanged
      .subscribe(formGroups => this.recipeFormGroups = formGroups);
  }

  private selectIdFromRoute() {
    this.route.params.subscribe((params: Params) => {

      this.id = +params.id;
      this.editMode = params.id != null;
    });
  }

  private initRecipe(): void {
    const recipeFound = this.recipeService.getRecipe(this.id);

    if (recipeFound)
      this.initForm();
    else
      this.dataStorageService.fetchRecipes().subscribe(_ => this.initForm());
  }

  private initForm(): void {
    let recipe = null;
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipeFound = this.recipeService.getRecipe(this.id);
      recipe = { ...recipeFound } as Recipe;

      if (recipeFound?.ingredients) {

        for (const ingredient of recipeFound?.ingredients) {
          const controls = this.createControls(['name', 'amount'], [ingredient.name, ingredient.amount]);
          recipeIngredients.push(new FormGroup(controls));
        }

        this.recipeFormGroups = recipeIngredients.value;
      }
    }

    this.recipeForm = this.createForm(recipe, recipeIngredients);
  }

  private createForm(recipe: Recipe, recipeIngredients: FormArray) {
    return new FormGroup({
      'name': new FormControl(recipe?.name ?? '', Validators.required),
      'imagePath': new FormControl(recipe?.imagePath ?? '', Validators.required),
      'description': new FormControl(recipe?.description ?? '', Validators.required),
      'ingredients': recipeIngredients
    });
  }

  private createControls(propertyNames: string[], values: any[]): {} {
    const objWithControls = {};
    for (let i = 0; i < propertyNames.length; i++) {
      const propName = propertyNames[i];

      if (isNaN(+propName)) {
        objWithControls[propName] = new FormControl(values[i], Validators.required);
      }

      if (isNaN(+propName) === false) { // if it's a number
        objWithControls[propName] = new FormControl(values[i], [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]);
      }
    }

    return objWithControls;
  }

  onSubmit(): void {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else this.recipeService.addRecipe(this.recipeForm.value);

    this.dataStorageService.storeRecipes();
    this.onCancel();
  }

  onAddIngredient(): void {
    const formIngredientsArray = this.recipeForm.get('ingredients') as FormArray;
    const newIngredientFormGroup = new FormGroup(this.createControls(['name', 'amount'], [null, null]));

    formIngredientsArray.push(newIngredientFormGroup);
    this.recipeService.formIngredientsChanged.next(formIngredientsArray.value);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number): void {
    const formIngredientsArray = this.recipeForm.get('ingredients') as FormArray;
    formIngredientsArray.removeAt(index);

    this.recipeService.formIngredientsChanged.next(formIngredientsArray.value);
  }

  ngOnDestroy(): void {
    this.formIngredientsSub.unsubscribe();
  }
}
