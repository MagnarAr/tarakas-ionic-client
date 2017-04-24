import {Component} from "@angular/core";

@Component({
  selector: 'price-label',
  template: `<div class="money">{{value | currency:'EUR':true}}</div>
    <div>{{label | uppercase }}</div>`,
  inputs: ['value', 'label']
})
export class PriceLabelDirective {

  constructor() {

  }

}
