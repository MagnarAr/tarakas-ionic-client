import {FormControl} from '@angular/forms';

export class PriceValidator {

  static isValid(control: FormControl): any {

    if (isNaN(control.value)) {
      return PriceValidator.notValid();
    }
    let value = Number(control.value);

    if (value < 0.01) {
      return PriceValidator.notValid();
    }

    if (value > 1000000) {
      return PriceValidator.notValid();
    }

    return value ? null : PriceValidator.notValid();
  }

  private static notValid() {
    return {valid: false};
  }

}
