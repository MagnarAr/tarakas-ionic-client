import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";

@Injectable()
export class AuthService {

  private static CORE_API_URL = "http://45.76.94.100:8080/";


  constructor(private http: Http, private plt: Platform, private storage: Storage) {
    if (!plt.is('ios')) {
      AuthService.CORE_API_URL = 'http://45.76.94.100:8080'
    }
  }

  authenticated() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token)
    }); // Returns true/false
  }

  registerAccount(usercreds) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.http
      .post(AuthService.CORE_API_URL + '/api/auth/register', usercreds, {headers: headers})
      .map((data) => data.json())
      .catch(this.handleError);
  }

  authenticateNow(usercreds) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.http
      .post(AuthService.CORE_API_URL + '/api/auth/login', usercreds, {headers: headers})
      .map((data) => data.json().token)
      .catch(this.handleError);
  }

  handleError(error) {
    return Observable.throw(error || 'Server error');
  }

}
