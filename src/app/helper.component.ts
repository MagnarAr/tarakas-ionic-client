import {Injectable} from '@angular/core';

@Injectable()
export class Helper {

  public static partitionArray = function(array, size) {
    return array.map(
              (e,i) => (i % size === 0) ? array.slice(i, i + size) : null
            ).filter( (e) => e )
  };

  // http://stackoverflow.com/questions/8584902/get-closest-number-out-of-array
  // By: Dan M. 10 Oct 2016
  public static findClosest = function(x, arr) {
    return arr.reduce(function (prev, curr) {
      return (Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
    });
  };

  // http://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
  // By: Billy Moon 14 May 2016
  public static round = function(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  public static getEuroBillImagePath(bill: number) {
    let _bill = "" + bill;
    if (bill < 1) {
      _bill = bill.toFixed(2);
      _bill = _bill.replace(".", "-");
    }
    return "assets/images/" + _bill + "-euro.svg";
  }

  // http://stackoverflow.com/questions/11849308/generate-colors-between-red-and-green-for-an-input-range
  // By: Neal. 7 Aug 2012
  // Converted JavaScript to TypeScript
  private static interpolate(start, end, steps, count) {
    let s = start, e = end, final = s + (((e - s) / steps) * count);
    return Math.floor(final);
  }

  public static testColors(value: number) {
    let val = value;
    if (!isFinite(value)) {
      val = 100;
    }

    let red = new Color(239,62,94);
    let yellow = new Color(239,212,70);
    let green = new Color(150,240,140);
    let start = red;
    let end = yellow;

    if (val > 50) {
      start = yellow;
      end = green;
      val = val % 51;
    }

    let startColors = start.getColors();
    let endColors = end.getColors();
    let r = Helper.interpolate(startColors.r, endColors.r, 50, val);
    let g = Helper.interpolate(startColors.g, endColors.g, 50, val);
    let b = Helper.interpolate(startColors.b, endColors.b, 50, val);
    return {r: r, g: g, b: b};
  }

}

class Color {
  r: any;
  g: any;
  b: any;

  public constructor(_r, _g, _b) {
    this.r = _r;
    this.g = _g;
    this.b = _b;
  }

  public getColors() {
      return {
        r: this.r,
        g: this.g,
        b: this.b
      };
  }

}
