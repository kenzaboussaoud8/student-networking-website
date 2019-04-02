import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.page.html',
  styleUrls: ['./password-lost.page.scss'],
})
export class PasswordLostPage implements OnInit {

  password:string;
  new_password:string;
  confirmed_password:string;

  constructor() { }

  ngOnInit() {
  }

  Modified(){
    if(this.password.length == 0 || this.new_password.length == 0 || this.confirmed_password.length == 0){
      alert("Please fill all fields");
    }
  }

}
