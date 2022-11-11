import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { NumberValidators } from '../shared/number.validator';

// function checkRange(min:number,max:number):ValidatorFn{
// return (c:AbstractControl):{[key:string]:boolean} |null =>{
//   //the validation is for optional fields.
//   if(c.value !==null && (isNaN(c.value) || c.value < min || c.value > max)){
//     return {'range':true}; //range is the name of the validation error just like required, maxlength etc
//     //which you can use in the template for displaying/hiding error message
//   }
//   return null;
// }
// }

function emailMatcher(c:AbstractControl):{[key:string]:boolean}|null{
  let email=c.get('email');
  let confirmEmail=c.get('confirmEmail');

  if(email?.pristine || confirmEmail?.pristine){
    //dont throw error if either of form controls not touched
    return null;
  }

  if(email?.value !== confirmEmail?.value){
    return {'emailMatch':true};
  }
  return null;
}

export class Customer{
  constructor(
    public firstName = '',
    public lastName = '',
    public email = '',
    public sendCatalog = false,
    public addressType = 'home',
    public street1?: string,
    public street2?: string,
    public city?: string,
    public state = '',
    public zip?: string) { }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor() { }
//data model
  customer:Customer=new Customer()

  //form model
  customerForm:FormGroup=new FormGroup({
    firstName:new FormControl("",[Validators.required,Validators.minLength(3)]),
    lastName:new FormControl("",[Validators.required,Validators.maxLength(50)]),
    // lastName:new FormControl({value:"",disabled:true},[Validators.required,Validators.maxLength(50)]),
    //email:new FormControl("",[Validators.required,Validators.email]),
    emailGroup:new FormGroup({
      email:new FormControl("",[Validators.required,Validators.email]),
      confirmEmail:new FormControl("",[Validators.required]),
    },[emailMatcher]),
    sendCatalog:new FormControl(true),
    phone:new FormControl(null,[Validators.required]),
    notification:new FormControl("email"),
    rating:new FormControl(null,[NumberValidators.checkRange(1,5)]), //set the default value of numeric control to null
    //rating field is not mandatory. Only if its filled, we are validating for the correct value
    addresses:new FormArray([this.createAddress()])
  });

  errors:any={
    "email":"",
    "confirmEmail":"",
    "firstName":"",
    "lastName":"",
    "rating":"",
    "emailGroup":"",
     "phone":"",
  }

  validationMessages:any={
    "email":{
      "required":"Please enter your email address.",
      "email":"Please enter a valid email address."
     },
     "confirmEmail":{
      "required":"Please confirm your email address.",
     },
     "emailGroup":{
      "emailMatch":"The confirmation does not match the email address."
     },
    "firstName":{
      "required": "Please enter your first name",
      "minlength":"The first name must be longer than 3 characters"
    },
    "lastName":{
      "required": "Please enter your last name",
      "maxlength":"The last name must be less than 50 characters"
    },
      "rating":{
        "range":"Please enter your rating from 1 to 5"
      },
      "phone":{
        "required":"Please enter your phone number"
      }
  }


  get addressList() : any {
    return (<FormArray>this.customerForm.get('addresses'))
  }


  ngOnInit(): void {
    const emailControl=this.customerForm.get('emailGroup.email');
    const confirmEmailControl=this.customerForm.get('emailGroup.confirmEmail');
    const emailGroupControl= this.customerForm.get('emailGroup');
    const firstNameControl= this.customerForm.get('firstName');
    const lastNameControl= this.customerForm.get('lastName');
    const ratingControl= this.customerForm.get('rating');
    const phoneControl= this.customerForm.get('phone');


    this.setNotification();

    emailControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(emailControl,"email");
    })

    confirmEmailControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(confirmEmailControl,"confirmEmail");
    })

    emailGroupControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(emailGroupControl,"emailGroup");
    })

    firstNameControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(firstNameControl,"firstName");
    })

    lastNameControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(lastNameControl,"lastName");
    })

    phoneControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(phoneControl,"phone");
    })

    ratingControl?.valueChanges.subscribe(x=>{
      this.setValidationMessage(ratingControl,"rating");
    })
  }

createAddress(){
return new FormGroup({
  addressType:new FormControl("home"),
  street1:new FormControl(""),
  street2:new FormControl(""),
  city:new FormControl(""),
  state:new FormControl(""),
  zip:new FormControl("")
})
}

addNewAddress(){
  this.addressList.push(this.createAddress());
}

  save(){
    console.log(this.customerForm.value)
  }


  setNotification(){
    //updating validators at runtime
    const phoneControl=this.customerForm.get('phone');
    this.customerForm.get('notification')?.valueChanges.subscribe(notifyVia=>{
    if(notifyVia === "text"){
  phoneControl?.setValidators([Validators.required])
    }
    else{
    phoneControl?.clearValidators()
    }
    phoneControl?.updateValueAndValidity()
    })

  }

  setValidationMessage(c:AbstractControl |null,controlName:string){
   this.errors[controlName]="";
   if((c?.touched || c?.dirty) && c?.errors){
   let errList=Object.keys(c?.errors); //["email","required"]
   this.errors[controlName]=errList.map((errKey:string)=>this.validationMessages[controlName][errKey]).join(' ')
   }
  }

  populateTestData(){
    //using setValue to set the value of all form controls in the form group
    this.customerForm.setValue({
      firstName:"Tom",
      lastName:"Sawyer",
      email:"abc@gmail.com",
      sendCatalog:false
    })
  }

}
