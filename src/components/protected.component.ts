import {Component} from "@angular/core";
import {AuthService} from "../providers/auth-service";
import {App} from "ionic-angular";
import {LoginComponent} from "../pages/login/login";

@Component({
  selector: 'protected',
  template: ''

})
export class ProtectedComponent {

  constructor(public authService: AuthService, public _app: App) {

  }

  ionViewCanEnter(): Promise<boolean> {
    // checks if token exists and is valid
    return this.authService.authenticated().then((auth) => {
        if (!auth) {
          this._app.getRootNav().setRoot(LoginComponent);
          return false;
        }
        return true;
      }
    );
  }

}
