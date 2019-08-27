import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, throwError } from "rxjs";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static CORE_API_URL = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient, private storage: Storage, private jwtHelperService: JwtHelperService) {
  }

  authenticated() {
    return this.storage.get('token').then(token => {
      return this.jwtHelperService.isTokenExpired(null, token)
    });
  }

  registerAccount(usercreds) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    return this.httpClient.post(`${AuthService.CORE_API_URL}/api/auth/register`, usercreds, {headers: headers})
      .pipe(catchError(error => this.handleError(error)))
  }

  authenticateNow(usercreds): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.httpClient.post(`${AuthService.CORE_API_URL}/api/auth/login`, usercreds, {headers: headers})
      .pipe(
        map((data) => data["token"]),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    return throwError(error || 'Server error');
  }
}
