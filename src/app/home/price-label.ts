import {Component, Input} from "@angular/core";

@Component({
    selector: 'price-label',
    template: `
        <div class="money">{{value | currency:'EUR'}}</div>
        <div>{{label | translate | uppercase }}</div>`
})
export class PriceLabelDirective {

    @Input() value: number;
    @Input() label: string;

    constructor() {

    }

}
