import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserSession } from "../services/user-session";
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public _router: Router, public alertCtrl: AlertController, public userSession: UserSession,
              private storage: Storage, public translateService: TranslateService) {

  }

  async insertMoney() {
    let alert = await this.alertCtrl.create({
      header: this.translateService.instant("SETTINGS.ADD_MONEY"),
      message: this.translateService.instant("SETTINGS.INSERT_AMOUNT_TO_ADD"),
      inputs: [{type: 'number', placeholder: "0.00", name: "amount"}],
      buttons: [
        {
          text: this.translateService.instant("COMMON.CANCEL")
        },
        {
          text: this.translateService.instant("COMMON.ADD"),
          handler: value => {
            return this.userSession.addMoney(value).subscribe(() => true);
          }
        }
      ]
    });
    await alert.present();
  }

  logOut() {
    this.storage.remove("token").then(() => this._router.navigate(["/login"]));
  }

}
