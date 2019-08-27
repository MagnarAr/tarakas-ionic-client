import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserSession {

  private static CORE_API_URL = environment.apiBaseUrl;

  totalAmount: number;

  constructor(private authHttp: HttpClient) {
    this.synchronize();
  }

  // maybe call this on each time detail and home view are loaded
  synchronize() {
    this.getBalance().subscribe((result) => {
      this.totalAmount = result['balance'];
    });
  }

  // TODO this service shouldn't do any update requests by itself
  private getBalance() {
    return this.authHttp.get(UserSession.CORE_API_URL + "/api/balance")
      .pipe(
        catchError((error) => Observable.throw(error.json()/*.error*/ || 'Server error'))
      );
  }

  public addMoney(amount: any) {
    return this.authHttp.post(UserSession.CORE_API_URL + "/api/balance", amount)
      .pipe(
        catchError((error) => Observable.throw(error.json()/*.error*/ || 'Server error'))
      );
  }

  public getTotalAmount() {
    return this.totalAmount;
  }
}
