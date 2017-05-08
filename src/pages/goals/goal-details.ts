import {Component} from "@angular/core";
import {Goal} from "./goal";
import {NavController, NavParams, AlertController, ToastController, Platform} from "ionic-angular";
import {UserSession} from "../../providers/user-session";
import {Helper} from "../../app/helper.component";
import {GoalService} from "../../providers/goal-service";
import {SocialSharing} from "@ionic-native/social-sharing";
import {isNumber} from "util";

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
              private _SHARE: SocialSharing, public platform: Platform) {
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

  // ionViewCanLeave(): Promise<boolean> {
  //   console.log("Modal can leave");
  //   if (this.saveData) {
  //     return this.goalService.saveNewGoal(this.details).toPromise()
  //       .then(() => true)
  //       .catch(() => true);
  //   } else {
  //     return Promise.resolve(true);
  //   }
  // }

  incrementCollectedAmount() {
    if (this.spendableAmount > 0 && this.getRemainderAmount() > 0) {
      let choices = this.EUROS.filter((bill) => bill <= this.spendableAmount && bill <= this.getRemainderAmount());
      let prompt = this.getCollectionPrompt(choices);
      prompt.setTitle("Kui palju soovid lisada?");
      prompt.addButton({
        text: 'Lisa',
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
      prompt.setTitle("Kui palju soovid eemaldada?");
      prompt.addButton({
        text: 'Eemalda',
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
    alert.addButton('Katkesta');
    return alert;
  }

  // getPackages() {
  //   let fullyCollectedPackagesAmount = Math.floor(this.details.collectedAmount / 5);
  //   let remainder = this.details.collectedAmount % 5;
  //   let packagesArray = [];
  //   for (let i = 0; i < fullyCollectedPackagesAmount; i++) {
  //     packagesArray.push({collected: 5});
  //   }
  //   if (remainder) {
  //     packagesArray.push({collected: remainder});
  //   }
  //   let totalPackagesAmount = Math.ceil(this.details.price / 5);
  //   while (packagesArray.length < totalPackagesAmount) {
  //     packagesArray.push({collected: 0});
  //   }
  //   //this.getPackagesNew();
  //   return Helper.partitionArray(packagesArray, 10);
  // }

  getTotalPackagesLeft() {
    let allPackages = this.getPackagesNew(this.getRemainderAmount());
    let coinPackages = allPackages.filter((p) => p.value < 5);
    let billPackages = allPackages.filter((p) => p.value >= 5);
    return {coins: /*Helper.partitionArray(*/coinPackages/*, 10)*/, bills: /*Helper.partitionArray(*/billPackages/*, 5)*/};
    // return Helper.partitionArray(this.getPackagesNew(this.getRemainderAmount()), 5);
  }

  getCollectedPackages() {
    let allPackages = this.getPackagesNew(this.details.collectedAmount);
    let coinPackages = allPackages.filter((p) => p.value < 5);
    let billPackages = allPackages.filter((p) => p.value >= 5);
    return {coins: /*Helper.partitionArray(*/coinPackages/*, 10)*/, bills: /*Helper.partitionArray(*/billPackages/*, 5)*/};
    // return Helper.partitionArray(this.getPackagesNew(this.details.collectedAmount), 5);
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
      title: 'Kustuta',
      message: "Kas oled kindel, et soovid seda unistust kustutada?",
      buttons: [
        {
          text: 'Ei',
          handler: data => {
            prompt.dismiss();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Jah',
          handler: data => {
            console.log('Saved clicked');
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
                  message: 'Unistuse \'' + this.details.name + '\' kustutamine õnnestus!',
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
