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

}
