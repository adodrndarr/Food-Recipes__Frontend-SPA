import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import(`./recipes/recipes.module`).then(path => path.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import(`./shopping-list/shopping-list.module`).then(path => path.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import(`./auth/auth.module`).then(path => path.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
