import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { NumberValidators } from '../shared/number.validator';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  let email = c.get('email');
  let confirmEmail = c.get('confirmEmail');

  if (email?.value == confirmEmail?.value) {
    return null;
  }
  return { 'emailMatch': true };
}

// export class Customer{
//   constructor(
//     public firstName = '',
//     public lastName = '',
//     public email = '',
//     public sendCatalog = false,
//     public addressType = 'home',
//     public street1?: string,
//     public street2?: string,
//     public city?: string,
//     public state = '',
//     public zip?: string) { }
// }

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor(private service: DataService,private fb:FormBuilder) { }
  //data model
  // customer:Customer=new Customer()
  customer: any;

  //form model

defaultAddress={
  "addressType": "home",
  "street1": "",
  "street2": "",
  "state": "",
  "city": "",
  "zip": null
}

customerForm=this.fb.group({
  firstName: ["", [Validators.required, Validators.minLength(3)]],
  lastName: ["", [Validators.required, Validators.maxLength(50)]],
  // lastName:new FormControl({value:"",disabled:true},[Validators.required,Validators.maxLength(50)]),
  //email:new FormControl("",[Validators.required,Validators.email]),
  emailGroup: this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    confirmEmail: ["", [Validators.required]],
  }, {validators:emailMatcher}),
  sendCatalog: [true],
  phone: [null],
  notification:["email"],
  rating: [null, [NumberValidators.checkRange(1, 5)]], //set the default value of numeric control to null
  //rating field is not mandatory. Only if its filled, we are validating for the correct value
  addresses: this.fb.array([this.createAddress(this.defaultAddress)])
})

  // customerForm: FormGroup = new FormGroup({
  //   firstName: new FormControl("", [Validators.required, Validators.minLength(3)]),
  //   lastName: new FormControl("", [Validators.required, Validators.maxLength(50)]),
  //   // lastName:new FormControl({value:"",disabled:true},[Validators.required,Validators.maxLength(50)]),
  //   //email:new FormControl("",[Validators.required,Validators.email]),
  //   emailGroup: new FormGroup({
  //     email: new FormControl("", [Validators.required, Validators.email]),
  //     confirmEmail: new FormControl("", [Validators.required]),
  //   }, [emailMatcher]),
  //   sendCatalog: new FormControl(true),
  //   phone: new FormControl(null, [Validators.required]),
  //   notification: new FormControl("email"),
  //   rating: new FormControl(null, [NumberValidators.checkRange(1, 5)]), //set the default value of numeric control to null
  //   //rating field is not mandatory. Only if its filled, we are validating for the correct value
  //   addresses: new FormArray([this.createAddress(this.defaultAddress)])
  // });

  errors: any = {
    "email": "",
    "confirmEmail": "",
    "firstName": "",
    "lastName": "",
    "rating": "",
    "emailGroup": "",
    "phone": "",
  }

  validationMessages: any = {
    "email": {
      "required": "Please enter your email address.",
      "email": "Please enter a valid email address."
    },
    "confirmEmail": {
      "required": "Please confirm your email address.",
    },
    "emailGroup": {
      "emailMatch": "The confirmation does not match the email address."
    },
    "firstName": {
      "required": "Please enter your first name",
      "minlength": "The first name must be longer than 3 characters"
    },
    "lastName": {
      "required": "Please enter your last name",
      "maxlength": "The last name must be less than 50 characters"
    },
    "rating": {
      "range": "Please enter your rating from 1 to 5"
    },
    "phone": {
      "required": "Please enter your phone number",
      "number": "Phone number must contain only digits",
      "count": "Phone number must contain exactly 10 digits"
    }
  }


  get addressList(): any {
    return (<FormArray>this.customerForm.get('addresses'))
  }


  ngOnInit(): void {
    const emailControl = this.customerForm.get('emailGroup.email');
    const confirmEmailControl = this.customerForm.get('emailGroup.confirmEmail');
    const emailGroupControl = this.customerForm.get('emailGroup');
    const firstNameControl = this.customerForm.get('firstName');
    const lastNameControl = this.customerForm.get('lastName');
    const ratingControl = this.customerForm.get('rating');
    const phoneControl = this.customerForm.get('phone');


    this.setNotification();

    emailControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(emailControl, "email");
    })

    confirmEmailControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(confirmEmailControl, "confirmEmail");
    })

    emailGroupControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(emailGroupControl, "emailGroup");
    })

    firstNameControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(firstNameControl, "firstName");
    })

    lastNameControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(lastNameControl, "lastName");
    })

    phoneControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(phoneControl, "phone");
    })

    ratingControl?.valueChanges.subscribe(x => {
      this.setValidationMessage(ratingControl, "rating");
    })

    this.customer = this.service.getUser();
    this.displayCustomer();
  }

  createAddress(address:any) {
    // return new FormGroup({
    //   addressType:new FormControl(address.addressType),
    //   street1:new FormControl(address.street1),
    //   street2:new FormControl(address.street2),
    //   city:new FormControl(address.city),
    //   state:new FormControl(address.state),
    //   zip:new FormControl(address.zip)
    // })
    return this.fb.group({
      addressType: [address.addressType],
      street1: [address.street1],
      street2: [address.street2],
      city: [address.city],
      state: [address.state],
      zip: [address.zip]
    })
  }

  addNewAddress() {
    this.addressList.push(this.createAddress(this.defaultAddress));
  }

  save() {
    console.log(this.customer);
    console.log(this.customerForm.value);
    /*
There are many properties in this.customer retrieved from the DB that is missing the form value.
We need to merge both the objects, to create an object that contains all the properties with the latest values
from the form

    */

console.log({...this.customer,...this.customerForm.value}); //final object
  }


  setNotification() {
    //updating validators at runtime
    const phoneControl = this.customerForm.get('phone');
    this.customerForm.get('notification')?.valueChanges.subscribe(notifyVia => {
      if (notifyVia === "text") {
        phoneControl?.setValidators([Validators.required,NumberValidators.IsNumeric(),NumberValidators.countDigits(10)])
      }
      else {
        phoneControl?.clearValidators()
      }
      phoneControl?.updateValueAndValidity()
    })

  }

  setValidationMessage(c: AbstractControl | null, controlName: string) {
    this.errors[controlName] = "";
    if ((c?.touched || c?.dirty) && c?.errors) {
      let errList = Object.keys(c?.errors); //["email","required"]
      this.errors[controlName] = errList.map((errKey: string) => this.validationMessages[controlName][errKey]).join(' ')
    }
  }

  populateTestData() {
    //using setValue to set the value of all form controls in the form group
    //using patchValue to set the value of only a few and not all form controls
    this.customerForm.patchValue({
      firstName: "Tom",
      lastName: "Sawyer",
      email: "abc@gmail.com",
      sendCatalog: false
    })
  }

  displayCustomer() {
    if (this.customerForm) {
      this.reset(); //if the form is already in use, reset all form controls to their initial value
    }
    //we have used patchValue because we are updating only a subset of the form controls
    this.customerForm.patchValue({
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      phone: this.customer.phone,
      notification: this.customer.notification,
      rating: this.customer.rating,
      sendCatalog: this.customer.sendCatalog
    })

    this.customerForm.get('emailGroup.email')?.setValue(this.customer.emailGroup.email);
    this.customerForm.get('emailGroup.confirmEmail')?.setValue(this.customer.emailGroup.confirmEmail);
    let addressList=this.customer.addresses.map((addr:any)=>this.createAddress(addr));
    this.customerForm.setControl('addresses',this.fb.array(addressList));
    this.customerForm.updateValueAndValidity();
  }

  reset() {
    this.customerForm.reset();
    //resetting the form will turn it back to its initial state and it will be a pristine/not dirty form.
    //This is also useful with deactivate guards, in case you want to navigate to another page after submitting the form
    //Because the guard wont allow to leave the page if the form is dirty.
  }

  deleteAddr(groupIndex:number){
    this.addressList.removeAt(groupIndex);
  }

  deleteAllAddr(){
    this.addressList.clear();
  }

}
