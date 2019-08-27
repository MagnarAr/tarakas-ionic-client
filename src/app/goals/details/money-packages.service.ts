import {Injectable} from "@angular/core";
import {MoneyPackages} from "./money-packages.model";
import {EuroColumn} from "./euro-column.model";
import {Helper} from "../../helper.component";

@Injectable({
    providedIn: 'root'
})
export class MoneyPackagesService {

    private readonly EUROS = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01];

    public calculatePackages(value: number): MoneyPackages {
        let allPackages = this.getPackagesNew(value);
        let coinPackages = allPackages.filter((p) => p.value < 5);
        let billPackages = allPackages.filter((p) => p.value >= 5);
        return {coins: coinPackages, bills: billPackages};
    }

    public getBillsSmallerThan(value: number): number[] {
        return this.EUROS.filter((bill) => bill <= value);
    }

    private getPackagesNew(totalValue: number): EuroColumn[] {
        let packagesArray = [];

        let remainder = Helper.round(totalValue, 2);
        // add remainders to packages array (decrement)
        while (remainder > 0) {
            let _closestRemainder = Helper.findClosest(remainder, this.EUROS);

            // Find closest reminder
            while (_closestRemainder > remainder) {
                let filteredEuros = this.EUROS.filter((e) => e < _closestRemainder);
                _closestRemainder = Helper.findClosest(remainder, filteredEuros);
            }
            packagesArray.push(_closestRemainder);
            remainder = Helper.round(remainder - _closestRemainder, 2);
        }

        let finalArray: EuroColumn[] = [];

        this.EUROS.forEach((bill) => {
            let billCount = packagesArray.filter((value) => value === bill).length;
            if (billCount > 0) {
                finalArray.push({value: bill, count: billCount})
            }
        });
        return finalArray;
    }
}
