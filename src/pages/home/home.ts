import {Component} from '@angular/core';
import {ModalController, App, LoadingController} from 'ionic-angular';
import {AddNewGoalComponent} from "../goals/add-new-goal.component";
import {Goal} from "../goals/goal";
import {GoalDetailsPage} from "../goals/goal-details";
import {UserSession} from "../../providers/user-session";
import {AuthService} from "../../providers/auth-service";
import {GoalService} from "../../providers/goal-service";
import {ProtectedComponent} from "../../components/protected.component";
import {Helper} from "../../app/helper.component";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends ProtectedComponent {

  goals: Goal[] = [];
  goalDetailsPage = GoalDetailsPage;
  message: any;

  constructor(public modalCtrl: ModalController, public userSession: UserSession, public loadingCtrl: LoadingController,
              public goalService: GoalService, public authService: AuthService, public _app: App,
              public translateService: TranslateService) {
    super(authService, _app);
  }

  ionViewWillEnter() {
    this.getGoals();
  }

  private getGoals() {
    let loader = this.loadingCtrl.create({
      content: this.translateService.instant("COMMON.PLEASE_WAIT"),
    });
    loader.present();
    this.userSession.synchronize();
    this.goalService.getAllGoals().subscribe(result => {
      this.goals = result;
      this.setMessage();
      loader.dismiss();
    });
  }

  getCollectedColor(goal: Goal) {
    let color = Helper.testColors((goal.collectedAmount / goal.price) * 100);
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b +')';
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

  addNewGoal() {
    let newGoalModal = this.modalCtrl.create(AddNewGoalComponent);
    newGoalModal.onDidDismiss(() => {
      this.getGoals();
    });
    newGoalModal.present();
  }

}
