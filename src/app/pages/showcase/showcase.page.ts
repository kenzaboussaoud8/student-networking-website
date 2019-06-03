import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.page.html',
  styleUrls: ['./showcase.page.scss'],
})
export class ShowcasePage implements OnInit {
  results: Promise<any>;
  email:string;
  password:string;

  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router, private storage: Storage) { }

  ngOnInit() {
  }

  login(){
    console.log("Email: "+ this.email);
    console.log("Password: "+ this.password);
    this.userService.Login(this.email, this.password)
    .then(({data}) => {
      var obj = JSON.parse(data);
      this.storage.set('token', obj.message.token);
      this.navCtrl.navigateForward('/account');
     }).catch(error => {
      console.log(error);
    });
  }

  goRegister(){
    this.navCtrl.navigateForward('/register');
  }

}
