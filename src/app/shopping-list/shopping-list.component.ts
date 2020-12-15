import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService, private loggingService: LoggingService) { }


  ingredients: Ingredient[];
  ingredientsChangedSub: Subscription;

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSub = this.shoppingListService.ingredientsChanged
      .subscribe((ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      });

    this.loggingService.printLog('Hello from ShoppingList Component ngOnInit()!');
  }

  onEditItem(index: number): void {
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSub.unsubscribe();
  }
}
