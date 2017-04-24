import {NavController, ToastController} from "ionic-angular";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AuthService} from "../../providers/auth-service";
import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";

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
              private toastCtrl: ToastController, private storage: Storage) {
    console.log("Login component constructor");
    this.formData = this.formBuilder.group({
      username: ["", Validators.required],
      password: [null, Validators.required]
    });
    this.loading = false;
  }

  ionViewCanEnter() {
    console.log("LoginComponent View can enter")
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
          console.log("[AuthService] authenticateNow:", token);
          this.registerToken(token)
        },
        (error) => {
          console.log(error);
          if (error.status == 401) {
            this.errorMessage = "Vale kasutajanimi või parool";
          } else {
            this.errorMessage = "Tehniline viga";
          }
        }
      );
  }

  private registerToken(token) {
    this.storage.set('token', token).then(result => {
      this.navCtrl.setRoot(TabsPage);
      this.toastCtrl.create({
        message: 'Sisselogimine õnnestus!',
        duration: 3000,
        position: 'bottom'
      }).present();
    });
  }

}
