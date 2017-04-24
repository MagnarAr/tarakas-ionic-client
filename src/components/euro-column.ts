import {Component} from "@angular/core";

@Component({
  selector: 'euro-column',
  template: `<div *ngIf="data.value >= 5" style="position: relative">
    <img [src]="data.image"/>
    <!--<span>{{col.value}}</span>-->
    <span *ngIf="data.count > 1" class="money-count">{{data.count}}</span>
  </div>`,
  inputs: ['data']
})
export class EuroColumnDirective {

  constructor() {

  }

}
