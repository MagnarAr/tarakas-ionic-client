import {Component} from '@angular/core';
import {AlertController, App} from 'ionic-angular';
import {UserSession} from "../../providers/user-session";
import {LoginComponent} from "../login/login";
import {Storage} from '@ionic/storage';
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public _app: App, public alertCtrl: AlertController, public userSession: UserSession,
              private storage: Storage, public translateService: TranslateService) {

  }

  insertMoney() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.translateService.instant("SETTINGS.ADD_MONEY"));
    alert.setMessage(this.translateService.instant("SETTINGS.INSERT_AMOUNT_TO_ADD"));
    alert.addInput({type: 'number', placeholder: "0.00", name: "amount"});
    alert.addButton(this.translateService.instant("COMMON.CANCEL"));
    alert.addButton({
      text: this.translateService.instant("COMMON.ADD"),
      handler: value => {
        return this.userSession.addMoney(value).subscribe(() => true);
      }
    });
    alert.present();
  }

  logOut() {
    this.storage.remove("token").then(() => this._app.getRootNav().setRoot(LoginComponent));
  }

}
