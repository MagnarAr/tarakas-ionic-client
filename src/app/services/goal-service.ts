import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { Goal } from "../goals/goal";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  private static CORE_API_URL = environment.apiBaseUrl;

  constructor(private authHttp: HttpClient) {
  }

  getAllGoals() {
    return this.authHttp.get(GoalService.CORE_API_URL + "/api/goals")
      .pipe(
        catchError(this.handleError)
      );
  }

  saveNewGoal(goal: Goal) {
    return this.authHttp.post(GoalService.CORE_API_URL + "/api/goals", goal)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteGoal(goalId: string) {
    return this.authHttp.delete(GoalService.CORE_API_URL + "/api/goals/" + goalId)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }
}
