import {NavController, ToastController} from "ionic-angular";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AuthService} from "../../providers/auth-service";
import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {

  formData: FormGroup;
  authType = "login";
  errorMessage = "";
  loading: boolean;

  constructor(private formBuilder: FormBuilder, public authService: AuthService, public navCtrl: NavController,
              private toastCtrl: ToastController, private storage: Storage, public translateService: TranslateService) {
    this.formData = this.formBuilder.group({
      username: ["", Validators.required],
      password: [null, Validators.required]
    });
    this.loading = false;
  }

  submitForm(): void {
    if (this.authType == 'login') {
      this.login(this.formData.value);
    } else { // log in after registration
      this.authService.registerAccount(this.formData.value).subscribe((data) => {
        this.login(this.formData.value);
      })
    }
  }

  private login(loginData) {
    this.loading = true;
    this.authService.authenticateNow(loginData).finally(() => {this.loading = false})
      .subscribe(
        (token) => {
          this.registerToken(token)
        },
        (error) => {
          if (error.status == 401) {
            this.errorMessage = this.translateService.instant("LOGIN.WRONG_USER_OR_PW");
          } else {
            this.errorMessage = this.translateService.instant("COMMON.TECHNICAL_ERROR");
          }
        }
      );
  }

  private registerToken(token) {
    this.storage.set('token', token).then(result => {
      this.navCtrl.setRoot(TabsPage);
      this.toastCtrl.create({
        message: this.translateService.instant("LOGIN.SUCCESS_MESSAGE"),
        duration: 1000,
        position: 'bottom'
      }).present();
    });
  }

}
