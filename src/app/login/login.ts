import { ToastController } from "@ionic/angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../services/auth-service";
import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { catchError, finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { EMPTY } from "rxjs";

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  formData: FormGroup;
  authType = "login";
  errorMessage = "";
  loading: boolean;

  constructor(formBuilder: FormBuilder, public authService: AuthService, public _router: Router,
              private toastCtrl: ToastController, private storage: Storage, public translateService: TranslateService) {
    this.formData = formBuilder.group({
      username: ["", Validators.required],
      password: [null, Validators.required]
    });
    this.loading = false;
  }

  submitForm(): void {
    if (this.authType == 'login') {
      this.login(this.formData.value);
    } else { // log in after registration
      this.authService.registerAccount(this.formData.value).subscribe(() => {
        this.login(this.formData.value);
      })
    }
  }

  segmentChanged(event: any): void {
    this.authType = event.detail.value;
  }

  private login(loginData) {
    this.loading = true;
    this.authService.authenticateNow(loginData)
      .pipe(
        catchError((error) => {
          if (error.status == 401) {
            this.errorMessage = this.translateService.instant("LOGIN.WRONG_USER_OR_PW");
          } else {
            this.errorMessage = this.translateService.instant("COMMON.TECHNICAL_ERROR");
          }
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe((token) => {
      this.registerToken(token)
    });
  }

  private async registerToken(token) {
    this.storage.set('token', token).then(() => {
      this._router.navigate(['/tabs/home']);
      this.toastCtrl.create({
        message: this.translateService.instant("LOGIN.SUCCESS_MESSAGE"),
        duration: 1000,
        position: 'bottom'
      });
    });
  }

}
