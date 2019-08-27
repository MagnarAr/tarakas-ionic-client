import { Component } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AddNewGoalComponent } from "../goals/add-new-goal.component";
import { Goal } from "../goals/goal";
import { GoalDetailsPage } from "../goals/details/goal-details";
import { UserSession } from "../services/user-session";
import { GoalService } from "../services/goal-service";
import { Helper } from "../helper.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  goals: Goal[] = [];
  message: any;

  constructor(public modalCtrl: ModalController, public userSession: UserSession, public loadingCtrl: LoadingController,
              public goalService: GoalService, public translateService: TranslateService) {
  }

  ionViewDidEnter() {
    this.getGoals();
  }

  private async getGoals() {
    let loader = await this.loadingCtrl.create({
      message: this.translateService.instant("COMMON.PLEASE_WAIT"),
    });
    await loader.present();

    this.userSession.synchronize();
    this.goalService.getAllGoals().subscribe((result: Goal[]) => {
      this.goals = result;
      this.setMessage();
      loader.dismiss();
    });
  }

  getCollectedColor(goal: Goal) {
    let color = Helper.testColors((goal.collectedAmount / goal.price) * 100);
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  }

  setMessage() {
    let message = {};
    if (this.getSpendableAmount() < 0) {
      message['text'] = this.translateService.instant("HOME.NEGATIVE_BALANCE");
      message['class'] = "error-message";
    } else if (this.getSpendableAmount() > 0) {
      message['text'] = this.translateService.instant("HOME.POSITIVE_BALANCE");
      message['class'] = "success-message";
    }
    this.message = message;
  }

  getSpendableAmount() {
    return Number((this.userSession.getTotalAmount() - this.getTotalCollected()).toFixed(2));
  }

  getTotalCollected() {
    return Number((this.goals.reduce((prevVal, elem) => prevVal + elem.collectedAmount, 0)).toFixed(2));
  }

  async addNewGoal() {
    let newGoalModal = await this.modalCtrl.create({
      component: AddNewGoalComponent
    });
    newGoalModal.onDidDismiss().then(() => {
      this.getGoals();
    });
    await newGoalModal.present();
  }

  async modifyGoal(goal: Goal): Promise<any> {
    let goalModificationModal = await this.modalCtrl.create({
      component: GoalDetailsPage,
      componentProps: {
        details: goal,
        spendableAmount: this.getSpendableAmount()
      }
    });
    await goalModificationModal.present();
    goalModificationModal.onDidDismiss().then(() => {
      this.getGoals();
    })
  }
}
