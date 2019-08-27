import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomePage } from "./home";
import { PriceLabelDirective } from "./price-label";
import { TranslateModule } from "@ngx-translate/core";
import { AddNewGoalComponent } from "../goals/add-new-goal.component";
import { GoalDetailsPage } from "../goals/details/goal-details";
import { EuroColumnDirective } from "../goals/details/euro-column.component";
import { AuthGuard } from "../guards/auth-guard.service";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild([
      {path: '', component: HomePage, canActivate: [AuthGuard]}
    ])
  ],
  declarations: [
    AddNewGoalComponent,
    GoalDetailsPage,
    PriceLabelDirective,
    EuroColumnDirective,
    HomePage
  ]
})
export class HomeModule {
}
