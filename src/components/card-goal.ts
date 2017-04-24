import {Component} from "@angular/core";

@Component({
  selector: 'card-goal',
  template: `

    <ion-card tappable [navPush]="navPush"
              [navParams]="{'goal': goal, 'spendableAmount': spendableAmount}">
      <div class="flexbox">
        <div style="width: 70%; align-self: center;">
          <ion-card-content>
            <ion-card-title>{{goal.name}}</ion-card-title>
            <p><ion-icon [name]="'pricetag'"></ion-icon>{{goal.collectedAmount}} / {{goal.price}} €</p>
          </ion-card-content>
        </div>
        <div class="align-right">
          <img *ngIf="goal.imageSource"
               src="{{goal.imageSource ? 'data:image/jpeg;base64,' + goal.imageSource : '/assets/images/no-image-icon.png'}}"/>
        </div>
      </div>
    </ion-card>`,
  inputs: ['navPush', 'goal', 'spendableAmount']
})
export class CardGoalDirective {

  constructor() {
  }

}
