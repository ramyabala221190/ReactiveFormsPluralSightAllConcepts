import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})

export class DataService{
  constructor(private http:HttpClient){}

  public user:any=  {
    "id": 1,
    "firstName": "Leanne",
    "lastName":"Graham",
    "username": "Bret",
    "emailGroup":{
    "email": "Sincere@april.biz",
    "confirmEmail":""},
    "addresses": [
      {
      "addressType":"home",
      "street1": "Kulas",
      "street2": "Light",
      "state": "AR",
      "city": "Gwenborough",
      "zip": 5
    },
    {
      "addressType":"work",
      "street1": "MNP",
      "street2": "QRS",
      "state": "WY",
      "city": "Some City",
      "zip": 1
    }],
    "phone": "1-770-736-8031 x56442",
    "rating":2,
    "notification":"email",
    "sendCatalog":true
  }


  getUser(){
    return this.user;
  }

}
