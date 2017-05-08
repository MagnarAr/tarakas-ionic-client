import {Component} from '@angular/core';
import {AlertController, App} from 'ionic-angular';
import {UserSession} from "../../providers/user-session";
import {LoginComponent} from "../login/login";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public _app: App, public alertCtrl: AlertController, public userSession: UserSession,
              private storage: Storage) {

  }

  insertMoney() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Lisa raha");
    alert.setMessage("Sisesta summa, kui palju soovid juurde lisada");
    alert.addInput({type: 'number', placeholder: "0.00", name: "amount"});
    alert.addButton('Katkesta');
    alert.addButton({
      text: 'Lisa',
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
