import { ValidatorFn, AbstractControl } from "@angular/forms";


export class NumberValidators {

  //static function so that any component can use it without creating an instance of the class
  static checkRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      //the validation is for optional fields.
      if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true }; //range is the name of the validation error just like required, maxlength etc
        //which you can use in the template for displaying/hiding error message
      }
      return null;
    }
  }

  static IsNumeric(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (isNaN(c.value)) {
          return { 'number': true }
        }
      return null;
    }
  }

  static countDigits(noOfDigits: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value?.length !== noOfDigits) {
          return { 'count': true }
        }
      return null;
    }
  }

}
