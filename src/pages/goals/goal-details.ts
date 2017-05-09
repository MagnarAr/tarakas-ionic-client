import {Component} from "@angular/core";
import {Goal} from "./goal";
import {NavController, NavParams, AlertController, ToastController, Platform} from "ionic-angular";
import {UserSession} from "../../providers/user-session";
import {Helper} from "../../app/helper.component";
import {GoalService} from "../../providers/goal-service";
import {SocialSharing} from "@ionic-native/social-sharing";
import {isNumber} from "util";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'goal-details',
  templateUrl: 'goal-details.html'
})
export class GoalDetailsPage {

  EUROS = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01];
  details: Goal;
  saveData: boolean = true;
  spendableAmount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userSession: UserSession, public goalService: GoalService,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              private _SHARE: SocialSharing, public platform: Platform,
              public translateService: TranslateService) {
    this.details = navParams.get("goal");
    this.spendableAmount = navParams.get("spendableAmount");
  }

  getSpendableAmountColor() {
    let color = Helper.testColors((this.spendableAmount / this.getRemainderAmount()) * 100);
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b +')';
  }

  getCollectedColor() {
    let color = Helper.testColors((this.details.collectedAmount / this.details.price) * 100);
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b +')';
  }

  incrementCollectedAmount() {
    if (this.spendableAmount > 0 && this.getRemainderAmount() > 0) {
      let choices = this.EUROS.filter((bill) => bill <= this.spendableAmount && bill <= this.getRemainderAmount());
      let prompt = this.getCollectionPrompt(choices);
      prompt.setTitle(this.translateService.instant("GOAL_DETAILS.PROMPT_ADD"));
      prompt.addButton({
        text: this.translateService.instant("COMMON.ADD"),
        handler: value => {
          if (value && isNumber(value)) {
            this.details.collectedAmount += value;
            this.goalService.saveNewGoal(this.details).toPromise()
              .then(() => {
                this.spendableAmount -= value;
                prompt.dismiss();
              }).catch(() => {
                this.details.collectedAmount -= value;
                prompt.dismiss();
              });
            return false;
          }
          return true;
        }
      });
      prompt.present();
    }
  }

  decrementCollectedAmount() {
    if (this.details.collectedAmount <= this.details.price) {
      let choices = this.EUROS.filter((bill) => bill <= Number(this.details.collectedAmount.toFixed(2)));
      let prompt = this.getCollectionPrompt(choices);
      prompt.setTitle(this.translateService.instant("GOAL_DETAILS.PROMPT_REMOVE"));
      prompt.addButton({
        text: this.translateService.instant("COMMON.REMOVE"),
        handler: value => {
          if (value && isNumber(value)) {
            this.details.collectedAmount -= value;
            this.goalService.saveNewGoal(this.details).toPromise()
              .then(() => {
                this.spendableAmount += value;
                prompt.dismiss();
              }).catch(() => {
              this.details.collectedAmount += value;
              prompt.dismiss();
            });
            return false;
          }
          return true;
        }
      });
      prompt.present();
    }
  }

  getRemainderAmount() {
    return Number((this.details.price - this.details.collectedAmount).toFixed(2));
  }

  getCollectionPrompt(radioValues: any) {
    let alert = this.alertCtrl.create();
    radioValues.forEach((value) => {
      alert.addInput({type: 'radio', label: value, value: value});
    });
    alert.addButton(this.translateService.instant("COMMON.CANCEL"),);
    return alert;
  }

  getTotalPackagesLeft() {
    let allPackages = this.getPackagesNew(this.getRemainderAmount());
    let coinPackages = allPackages.filter((p) => p.value < 5);
    let billPackages = allPackages.filter((p) => p.value >= 5);
    return {coins: coinPackages, bills: billPackages};
  }

  getCollectedPackages() {
    let allPackages = this.getPackagesNew(this.details.collectedAmount);
    let coinPackages = allPackages.filter((p) => p.value < 5);
    let billPackages = allPackages.filter((p) => p.value >= 5);
    return {coins: coinPackages, bills: billPackages};
  }

  getPackagesNew(totalValue: number) {
    let packagesArray = [];

    let remainder = Helper.round(totalValue, 2);
    // add remainders to packages array (decrement)
    while (remainder > 0) {
      let _closestRemainder = Helper.findClosest(remainder, this.EUROS);

      // Find closest reminder
      while (_closestRemainder > remainder) {
        let filteredEuros = this.EUROS.filter((e) => e < _closestRemainder);
        _closestRemainder = Helper.findClosest(remainder, filteredEuros);
      }
      packagesArray.push(_closestRemainder);
      remainder = Helper.round(remainder - _closestRemainder, 2);
    }

    let finalArray = [];

    this.EUROS.forEach((bill) => {
      let billCount = packagesArray.filter((value) => value === bill).length;
      if (billCount > 0) {
        finalArray.push({value: bill, count: billCount, image: Helper.getEuroBillImagePath(bill)})
      }
    });
    return finalArray;
  }

  deleteGoal() {
    let prompt = this.alertCtrl.create({
      title: this.translateService.instant("COMMON.REMOVE"),
      message: this.translateService.instant("GOAL_DETAILS.ALERT_MESSAGE"),
      buttons: [
        {
          text: this.translateService.instant("COMMON.NO"),
          handler: data => {
            prompt.dismiss();
          }
        },
        {
          text: this.translateService.instant("COMMON.YES"),
          handler: data => {
            // user has clicked the alert button
            // begin the alert's dismiss transition
            let navTransition = prompt.dismiss();
            this.goalService.deleteGoal(this.details.id).toPromise().then(() => {
              // once the async operation has completed
              // then run the next nav transition after the
              // first transition has finished animating out

              navTransition.then(() => {
                this.saveData = false;
                this.navCtrl.pop();
                this.toastCtrl.create({
                  message: this.translateService.instant("GOAL_DETAILS.SUCCESS_MESSAGE", {name: this.details.name}),
                  duration: 3000,
                  position: 'top'
                }).present();
              });
            });
            return false;
          }
        }
      ]
    });
    prompt.present();
  }

  askMoney() {
    this.platform.ready()
      .then(() => {
        this._SHARE.canShareViaEmail()
          .then(() => {
            this._SHARE.shareViaEmail("message", "subject", [])
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
      });
  }

}
