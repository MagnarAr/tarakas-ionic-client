import { Component, Input, OnInit } from "@angular/core";
import { Goal } from "../goal";
import { AlertController, ToastController, Platform, ModalController } from "@ionic/angular";
import { Helper } from "../../helper.component";
import { GoalService } from "../../services/goal-service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { TranslateService } from "@ngx-translate/core";
import { AlertInput } from '@ionic/core/dist/types/components/alert/alert-interface';
import { MoneyPackages } from "./money-packages.model";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MoneyPackagesService } from "./money-packages.service";

@Component({
  selector: 'goal-details',
  templateUrl: './goal-details.html',
  styleUrls: ['./goal-details.scss']
})
export class GoalDetailsPage implements OnInit {

  @Input() details: Goal;
  @Input() spendableAmount: number;

  remainderAmount: number;
  spendableAmountColor: string;
  collectedAmountColor: string;
  collectedPackages: MoneyPackages;
  packagesLeft: MoneyPackages;

  constructor(private viewCtrl: ModalController,
              private goalService: GoalService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private _SHARE: SocialSharing,
              private platform: Platform,
              private moneyPackagesService: MoneyPackagesService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.updateValues();
  }

  async incrementCollectedAmount() {
    if (this.spendableAmount > 0 && this.remainderAmount > 0) {
      let choices = this.moneyPackagesService.getBillsSmallerThan(Math.min(this.spendableAmount, this.remainderAmount));
      let prompt = await this.alertCtrl.create({
        message: this.translateService.instant("GOAL_DETAILS.PROMPT_ADD"),
        inputs: this.getRadioInputs(choices),
        buttons: [
          {text: this.translateService.instant("COMMON.CANCEL")},
          {
            text: this.translateService.instant("COMMON.ADD"),
            handler: value => {
              if (typeof value === 'number') {
                this.updateDetails(value).subscribe(() => prompt.dismiss(), () => prompt.dismiss());
                return false;
              }
              return true;
            }
          }
        ]
      });
      await prompt.present();
    }
  }

  async decrementCollectedAmount() {
    if (this.details.collectedAmount <= this.details.price) {
      let choices = this.moneyPackagesService.getBillsSmallerThan(this.details.collectedAmount);
      let prompt = await this.alertCtrl.create({
        message: this.translateService.instant("GOAL_DETAILS.PROMPT_REMOVE"),
        inputs: this.getRadioInputs(choices),
        buttons: [
          {text: this.translateService.instant("COMMON.CANCEL")},
          {
            text: this.translateService.instant("COMMON.REMOVE"),
            handler: value => {
              if (typeof value === 'number') {
                this.updateDetails(-Math.abs(value)).subscribe(() => prompt.dismiss(), () => prompt.dismiss());
                return false;
              }
              return true;
            }
          }
        ]
      });
      await prompt.present();
    }
  }

  private updateDetails(value: number): Observable<boolean> {
    this.details.collectedAmount += value;
    return this.goalService.saveNewGoal(this.details)
      .pipe(
        map(() => {
          this.spendableAmount -= value;
          this.updateValues();
          return true;
        }),
        catchError(() => {
          this.details.collectedAmount -= value;
          return of(false);
        })
      );
  }

  private updateValues(): void {
    this.updateRemainderAmount();
    this.updateSpendableAmountColor();
    this.updateCollectedAmountColor();
    this.updateCollectedPackages();
    this.updatePackagesLeft();
  }

  private getRadioInputs(radioValues: number[]): AlertInput[] {
    return radioValues.map((value) => {
      return {type: 'radio', name: String(value), label: String(value), value: value};
    });
  }

  private updateRemainderAmount() {
    this.remainderAmount = this.details.price - this.details.collectedAmount;
  }

  private updateSpendableAmountColor(): void {
    let color = Helper.testColors((this.spendableAmount / this.remainderAmount) * 100);
    this.spendableAmountColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  }

  private updateCollectedAmountColor(): void {
    let color = Helper.testColors((this.details.collectedAmount / this.details.price) * 100);
    this.collectedAmountColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  }

  private updatePackagesLeft(): void {
    this.packagesLeft = this.moneyPackagesService.calculatePackages(this.remainderAmount);
  }

  private updateCollectedPackages(): void {
    this.collectedPackages = this.moneyPackagesService.calculatePackages(this.details.collectedAmount);
  }

  async deleteGoal() {
    let prompt = await this.alertCtrl.create({
      header: this.translateService.instant("COMMON.REMOVE"),
      message: this.translateService.instant("GOAL_DETAILS.ALERT_MESSAGE"),
      buttons: [
        {
          text: this.translateService.instant("COMMON.NO"),
          handler: () => {
            prompt.dismiss();
          }
        },
        {
          text: this.translateService.instant("COMMON.YES"),
          handler: () => {
            let navTransition = prompt.dismiss();
            this.goalService.deleteGoal(this.details.id).subscribe(() => {
              navTransition.then(async () => {
                this.dismiss();
                let toast = await this.toastCtrl.create({
                  message: this.translateService.instant("GOAL_DETAILS.SUCCESS_MESSAGE", {name: this.details.name}),
                  duration: 3000,
                  position: 'top'
                });
                await toast.present();
              });
            });
            return false;
          }
        }
      ]
    });
    await prompt.present();
  }

  async askMoney() {
    this.platform.ready()
      .then(async () => {
        let prompt = await this.alertCtrl.create({
          message: this.translateService.instant("GOAL_DETAILS.HELP_TITLE"),
          inputs: [
            {type: 'radio', name: 'Sünnipäev', label: 'Sünnipäev', value: 'BDAY'},
            {type: 'radio', name: 'Projekt', label: 'Project', value: 'CWDF'}
          ],
          buttons: [
            {
              text: this.translateService.instant("COMMON.CANCEL"),
              handler: () => {
                prompt.dismiss();
              }
            },
            {
              text: this.translateService.instant("COMMON.SEND_EMAIL"),
              handler: data => {
                if (data) {
                  if (data == 'BDAY') {
                    this.sendEmail(
                      this.translateService.instant("GOAL_DETAILS.BDAY_SUBJECT"),
                      this.translateService.instant("GOAL_DETAILS.BDAY_MESSAGE", {goal: this.details.name})
                    );
                  } else {
                    this.sendEmail(
                      this.translateService.instant("GOAL_DETAILS.CWDF_SUBJECT"),
                      this.translateService.instant("GOAL_DETAILS.CWDF_MESSAGE", {goal: this.details.name})
                    );
                  }
                }
              }
            }
          ]
        });
        await prompt.present();
      });
  }

  public dismiss() {
    this.viewCtrl.dismiss().catch(() => {
    });
  }

  private sendEmail(subject: string, message: string) {
    this._SHARE.canShareViaEmail()
      .then(() => {
        this._SHARE.shareViaEmail(message, subject, [])
          .then((data) => {
            console.log('Shared via Email');
          })
          .catch((err) => {
            console.log('Not able to be shared via Email');
          });
      })
      .catch((err) => {
        console.log('Sharing via Email NOT enabled');
      });
  }
}
