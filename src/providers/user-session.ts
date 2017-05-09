import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";

@Injectable()
export class UserSession {

  private static CORE_API_URL = "http://45.76.94.100:8080";

  totalAmount: number;

  constructor(private authHttp: AuthHttp, public plt: Platform) {
    if (!plt.is('ios')) {
      UserSession.CORE_API_URL = 'http://45.76.94.100:8080'
    }
    this.synchronize();
  }

  // maybe call this on each time detail and home view are loaded
  synchronize() {
    this.getBalance().subscribe((result) => {
      this.totalAmount = result.balance;
    });
  }

  // TODO this service shouldn't do any update requests by itself
  private getBalance() {
    return this.authHttp.get(UserSession.CORE_API_URL + "/api/balance")
      .map((res) => res.json())
      .catch((error) => Observable.throw(error.json()/*.error*/ || 'Server error'));
  }

  public addMoney(amount: any) {
    return this.authHttp.post(UserSession.CORE_API_URL + "/api/balance", amount)
      .map((res) => res.json())
      .catch((error) => Observable.throw(error.json()/*.error*/ || 'Server error'));
  }

  public getTotalAmount() {
    return this.totalAmount;
  }

}
