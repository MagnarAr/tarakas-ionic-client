import {Component} from '@angular/core';
import {ModalController, App} from 'ionic-angular';
import {AddNewGoalComponent} from "../goals/add-new-goal.component";
import {Goal} from "../goals/goal";
import {GoalDetailsPage} from "../goals/goal-details";
import {UserSession} from "../../providers/user-session";
import {AuthService} from "../../providers/auth-service";
import {GoalService} from "../../providers/goal-service";
import {ProtectedComponent} from "../../components/protected.component";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends ProtectedComponent {

  goals: Goal[] = [];
  // goalsInRow = 2;
  goalDetailsPage = GoalDetailsPage;
  message: any;

  constructor(public modalCtrl: ModalController, public userSession: UserSession,
              public goalService: GoalService, public authService: AuthService, public _app: App) {
    super(authService, _app);
  }

  ionViewWillEnter() {
    this.getGoals();
  }

  private getGoals() {
    this.userSession.synchronize();
    this.goalService.getAllGoals().subscribe(result => {
      this.goals = result;
      this.setMessage();
    }
  );
  }

  setMessage() {
    let message = {};
    console.log("Spendable amount:", this.getSpendableAmount());
    if (this.getSpendableAmount() < 0) {
      message['text'] = "Oled raha kulutanud";
      message['class'] = "error-message";
    } else if (this.getSpendableAmount() > 0) {
      message['text'] = "Sul on vaba raha!";
      message['class'] = "success-message";
    }
    this.message = message;
  }

  getSpendableAmount() {
    return this.userSession.getTotalAmount() - this.getTotalCollected();
  }
  getTotalCollected() {
    return this.goals.reduce((prevVal, elem) => prevVal + elem.collectedAmount, 0);
  }

  addNewGoal() {
    let newGoalModal = this.modalCtrl.create(AddNewGoalComponent);
    newGoalModal.onDidDismiss(() => {
      this.getGoals();
    });
    newGoalModal.present();
  }

}
