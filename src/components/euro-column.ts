import {Component} from "@angular/core";

@Component({
  selector: 'euro-column',
  template: `<div style="position: relative">
    <img [src]="data.image"/>
    <!--<span>{{col.value}}</span>-->
    <span *ngIf="data.count > 1 && data.value > 2" class="bill-count">{{data.count}}</span>
    <span *ngIf="data.count > 1 && data.value <= 2" class="coin-count">{{data.count}}</span>
  </div>`,
  inputs: ['data']
})
export class EuroColumnDirective {

  constructor() {

  }

}
