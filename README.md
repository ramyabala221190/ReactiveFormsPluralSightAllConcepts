General Form(Template/Reactive) State:
https://github.com/DeborahK/Angular-ReactiveForms

Angular form state:

1. Based on change in value
pristine --value unchanged
dirty--value changed.

If all form elements have pristine state then the form itself is pristine else it is dirty.

2. Based on validity.
Valid --if the form control has passed all validations
erros -- if the form control has not passed all validations.

If all form elements are valid then the form is valid else it is in error state

3. If a control has been visited or not
touched --form control has been focussed
untouched --form control has not been focussed

=>Form building blocks for Template and Reactive Forms:
FormControl
FormBlock

-------------------------------------------------------------------------------
Template Driven Forms:

Template Driven Forms Directives:
Import FormsModule

ngModel
ngForm
ngModelGroup

<form novalidate (ngSubmit)="save(signUpForm)" #signUpForm="ngForm">

<input id="firstNameId" type="text" [(ngModel]="customer.firstName" name="firstName" #firstNameVar="ngModel">

</form>

novalidate indicates that browser not do any validations.

We have exported the ngForm directive to a template reference variable signUpForm to access the FormGroup's state.

When we add an ngModel to an element, angular automatically creates a FormControl with the element's name as the key.
This is the reason the name attribute is required.
We can access the FormControl's state be exporting the ngModel directive to a template reference variable firstNameVar.
[(ngModel]="customer.firstName" will bind the class property to element value. 2 way data binding is enabled here. When customer data changes, the form control value also changes.

The main purpose of the template reference variables to access the form and the form control state in the template
to perform validations.

Angular creates the form model automatically for us. Form model is an object containing the form and the form control's state, validity,value etc.
Validations are defined in the HTML and not in the class.

Template driven forms can become unamanagable and complex if the forms are huge. They are unsuitable for:
1. dynamically adding input elements
2. Watch what the user types and react
3. Wait validation untill user stops typing
4. Different validations for different situations

---------------------------------------------------------------
Reactive Forms:

Reactive Forms Directives:
Import the ReactiveFormsModule.

formGroup   -------------this is used for the root form group
formGroupName ----------- this is used for the nested form group
formControl
formControlName
formArrayName

=>In Reactive, we need to construct the form model. Angular wont do it for us.
=>Form validations are defined in the class and not in the html
=>No 2 way data binding. This means that updating the customer data in the class will not update the form control.

Every form model requires atleast 1 form group, which is called the Root Form Group

[formGroup]="customerForm" indicates that the form must not build its own form model.
The form model will defined in the class.
Square brackets indicate we are binding to a property in the class.

formControlName="firstName" indicates that we are binding to a string
---------------------------------------------------------------------------------
Ways of Accessing form model properties:

1. customerForm.controls.firstName.valid
2. customerForm.get('firstName').valid

3. Create a form control like this:
firstName=new FormControl()

customerForm=new FormGroup({
  firstName:this.firstName
})

Now you can access the property firstName directly in the template to access its state
firstName.valid

----------------------------------------------------------------------------------
We use setValue() when we want to set the value of all form controls in the form group
We use patchValue() when we want to set the value of only a subset of all controls in the form group ie
only a few and not all form controls
----------------------------------------------------------------------------------
Form Builder

Creates a form model from a config
Reduces the boiler plate code required to create the root form group
----------------------------------------------------------------------------------
Disabling a form control

lastName:new FormControl({value:"",disabled:true},[Validators.required,Validators.maxLength(50)])
When you disable the form control, the control doesnt appear in the form's value.

---------------------------------------------------------------------
Adjusting validation rules are runtime

myControl.setValidators([rule1,rule2...rulen])  ----add an array of validators to a control
myControl.clearValidators() ----remove all validators from the control

For the validator to take effect, you need to call:
myControl.updateValueAndValidity()

----------------------------------------------------------------------
Custom Validators

function checkRange(c:AbstractControl):{[key:string]:boolean} |null {
  if(c.value !==null && (isNaN(c.value) || c.value < 1 || c.value > 5)){
    return {'range':true}; 
    
    //range is the name of the validation error just like required, maxlength etc
    //which you can use in the template for displaying/hiding error message
  }
  return null;
}

Its a function that can either return an object or null. If it returns an object, it indicates an error.
Returning null indicates validation passed.
The key value of the object is the name of the validation error like required,minlength,maxlength etc.
This name can be used in the template for hiding/displying error messages like below.

 <ng-container *ngIf="customerForm.get('rating')?.errors as errorObj">
                <span *ngIf="errorObj['range']">
                  Please enter your rating from 1 to 5.
                </span>
              </ng-container>

The above validator function hardcodes the range values of 1 and 5. What if you want to reuse this
function at many other places with different range values.

We define a factory function which takes any number of params and returns the Validator function.

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

-----------------------------------------------------------------------------------
Cross Field Validation

This is a scenario where te validation of 1 field is based on another field.
For eg: If I add another "Confirm Email" field and I need to validate that the "Email" and the
"Confirm Email" field have the same values.

I define both these fields as form control under a new nested form group.

 emailGroup:new FormGroup({
      email:new FormControl("",[Validators.required,Validators.email]),
      confirmEmail:new FormControl("",[Validators.required]),
    })

Also in the html, I nest both the form controls inside a <div formGroupName="emailGroup"></div>

The advantage of adding the controls inside a nested form group is that we can create a custom validator and
apply it to the nested form group. Thus we can access the form controls inside the nest form group too inside the
validator to compare the values. As you can see below we have added the emailMatched validator to the nested formgroup
and not individual form controls

 emailGroup:new FormGroup({
      email:new FormControl("",[Validators.required,Validators.email]),
      confirmEmail:new FormControl("",[Validators.required]),
    },[emailMatcher]),

