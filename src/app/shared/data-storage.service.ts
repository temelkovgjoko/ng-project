import { Injectable } from '@angular/core';


import { RecipeService } from '../recipes/recipe.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';
@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put('https://ng-course-33fa9.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response)
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http
          .get<Recipe[]>('https://ng-course-33fa9.firebaseio.com/recipes.json',
            {
              params: new HttpParams().set('auth', user.token)
            }
          );
      }),
      map(recipes => {
        return recipes.map(recipes => {
          return { ...recipes, ingredients: recipes.ingredients ? recipes.ingredients : [] };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes)
      })
    );
  }
}
