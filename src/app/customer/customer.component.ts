import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl, ValidatorFn } from '@angular/forms';

function checkRange(min:number,max:number):ValidatorFn{
return (c:AbstractControl):{[key:string]:boolean} |null =>{
  //the validation is for optional fields.
  if(c.value !==null && (isNaN(c.value) || c.value < min || c.value > max)){
    return {'range':true}; //range is the name of the validation error just like required, maxlength etc
    //which you can use in the template for displaying/hiding error message
  }
  return null;
}
}

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
    phone:new FormControl(),
    notification:new FormControl("email"),
    rating:new FormControl(null,[checkRange(1,5)]) //set the default value of numeric control to null
    //rating field is not mandatory. Only if its filled, we are validating for the correct value
  });

  ngOnInit(): void {
  }

  save(){
    console.log(this.customerForm.value)
  }

  setNotification(notifyVia:string){
    //updating validators at runtime
    if(notifyVia === "text"){
      this.customerForm.get('phone')?.setValidators([Validators.required])
    }
    else{
      this.customerForm.get('phone')?.clearValidators()
    }
    this. customerForm.get('phone')?.updateValueAndValidity()
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
