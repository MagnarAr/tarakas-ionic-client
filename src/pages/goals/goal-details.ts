import {Component} from "@angular/core";
import {Goal} from "./goal";
import {NavController, NavParams, AlertController, ToastController} from "ionic-angular";
import {UserSession} from "../../providers/user-session";
import {Helper} from "../../app/helper.component";
import {GoalService} from "../../providers/goal-service";

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
              public alertCtrl: AlertController, public toastCtrl: ToastController) {
    this.details = navParams.get("goal");
    this.spendableAmount = navParams.get("spendableAmount");
    console.log("Details: ", this.details);
    console.log("Spendableamount: ", this.spendableAmount);
  }

  ionViewCanLeave(): Promise<boolean> {
    console.log("Modal can leave");
    if (this.saveData) {
      return this.goalService.saveNewGoal(this.details).toPromise()
        .then(() => true)
        .catch(() => true);
    } else {
      return Promise.resolve(true);
    }
  }

  incrementCollectedAmount() {
    if (this.spendableAmount > 0) {
      let choices = this.EUROS.filter((bill) => bill <= this.spendableAmount);
      let prompt = this.getCollectionPrompt(choices);
      prompt.setTitle("Kui palju soovid lisada?");
      prompt.addButton({
        text: 'Lisa',
        handler: value => {
          this.details.collectedAmount += value;
          this.spendableAmount -= value;
        }
      });
      prompt.present();
    }
  }

  decrementCollectedAmount() {
    if (this.details.collectedAmount <= this.details.price) {
      let choices = this.EUROS.filter((bill) => bill <= this.details.collectedAmount);
      let prompt = this.getCollectionPrompt(choices);
      prompt.setTitle("Kui palju soovid eemaldada?");
      prompt.addButton({
        text: 'Eemalda',
        handler: value => {
          this.details.collectedAmount -= value;
          this.spendableAmount += value;
        }
      });
      prompt.present();
    }
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
    return Helper.partitionArray(this.getPackagesNew(this.details.price - this.details.collectedAmount), 5);
  }

  getCollectedPackages() {
    return Helper.partitionArray(this.getPackagesNew(this.details.collectedAmount), 5);
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
        console.log("Closestremainder:", remainder, _closestRemainder, filteredEuros);
        _closestRemainder = Helper.findClosest(remainder, filteredEuros);
      }
      packagesArray.push(_closestRemainder);
      remainder = Helper.round(remainder - _closestRemainder, 2);
    }

    let finalArray = [];

    this.EUROS.forEach((bill) => {
      let billCount = packagesArray.filter((value) => value === bill).length;
      if (billCount > 0) {
        finalArray.push({value: bill, count: billCount, image: "assets/images/" + bill + "-euro.svg"})
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

}
