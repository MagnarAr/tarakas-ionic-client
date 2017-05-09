import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {Goal} from "../pages/goals/goal";
import {Platform} from "ionic-angular";

@Injectable()
export class GoalService {

  private static CORE_API_URL = "http://45.76.94.100:8080";

  constructor(private authHttp: AuthHttp, private plt: Platform) {
    if (!plt.is('ios')) {
      GoalService.CORE_API_URL = 'http://45.76.94.100:8080'
    }
  }

  getAllGoals() {
    return this.authHttp.get(GoalService.CORE_API_URL + "/api/goals")
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveNewGoal(goal: Goal) {
    return this.authHttp.post(GoalService.CORE_API_URL + "/api/goals", goal).map(this.extractData).catch(this.handleError);
  }

  deleteGoal(goalId: string) {
    return this.authHttp.delete(GoalService.CORE_API_URL + "/api/goals/" + goalId).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
