import { Injectable } from '@angular/core';


import { RecipeService } from '../recipes/recipe.service';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators'
@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put('https://ng-course-33fa9.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response)
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-course-33fa9.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipes => {
            return { ...recipes, ingredients: recipes.ingredients ? recipes.ingredients : [] };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      )
  }
}
