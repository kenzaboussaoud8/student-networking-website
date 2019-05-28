import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  results: Promise<any>;
  email:string;
  first_name:string;
  last_name:string;
  password:string;
  birth_date:string;
  student_card:string;
  
  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router) { }

  ngOnInit() {
  }

  ionViewDidload(){

    console.log('ionViewDidLoad RegisterPage');
  }

  Register(){
    if(this.email.length == 0 || this.first_name.length == 0 || this.last_name.length == 0 || this.password.length == 0 || this.birth_date.length == 0 || this.birth_date.length == 0){
      alert("Please fill all fields");
    }else{
      this.userService.Register(this.email, this.first_name, this.last_name, this.password, this.birth_date, this.student_card)
      .then(data => {
        console.log(data);
        this.navCtrl.navigateForward('/home');
      }, error => {
        console.log(error);
      });
    }
  }


}
