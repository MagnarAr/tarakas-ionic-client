import { Component, Input } from "@angular/core";
import { EuroColumn } from "./euro-column.model";
import { Helper } from "../../helper.component";

@Component({
  selector: 'euro-column',
  template: `
      <div style="position: relative">
          <img [src]="getImageSrc()" [alt]="'bill-of-' + data.value"/>
          <span *ngIf="data.count > 1 && data.value > 2" class="bill-count">{{data.count}}</span>
          <span *ngIf="data.count > 1 && data.value <= 2" class="coin-count">{{data.count}}</span>
      </div>`
})
export class EuroColumnDirective {

  @Input() data: EuroColumn;

  constructor() {
  }

  getImageSrc(): string {
    return Helper.getEuroBillImagePath(this.data.value);
  }
}
