import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";

@Injectable()
export class UserSession {

  private static CORE_API_URL = "http://172.20.10.2:8080";

  totalAmount: number;

  constructor(private authHttp: AuthHttp, public plt: Platform) {
    console.log("[UserSession] init.");
    if (!plt.is('ios')) {
      UserSession.CORE_API_URL = 'http://127.0.0.1:8080'
    }
    this.synchronize();
  }

  synchronize() {
    console.log("Start synchornizing");
    this.getBalance().subscribe((result) => {
      this.totalAmount = result.balance;
      console.log("Result:", result);
    });
  }

  // TODO this service shouldn't do any update requests by itself
  private getBalance() {
    return this.authHttp.get(UserSession.CORE_API_URL + "/api/balance")
      .map((res) => res.json())
      .catch((error) => Observable.throw(error.json()/*.error*/ || 'Server error'));
  }

  public getTotalAmount() {
    return this.totalAmount;
  }

}
