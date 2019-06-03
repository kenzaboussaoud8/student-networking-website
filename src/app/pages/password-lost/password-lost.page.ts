import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.page.html',
  styleUrls: ['./password-lost.page.scss'],
})
export class PasswordLostPage implements OnInit {

  token:string;
  password:string;
  newPassword:string;
  confirmPassword:string;

  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router, private storage: Storage) { }

  ngOnInit() {
  }

  Modified(){
    this.storage.get('token').then((val) => {
      this.token = val;
      if(this.password.length == 0 || this.newPassword.length == 0 || this.confirmPassword.length == 0){
        alert("Please fill all fields");
      }else{
        this.userService.UpdatePassword(this.token, this.password, this.newPassword, this.confirmPassword).then(({data}) => {
          console.log(data);
          console.log(this.token);
          alert("password changed");
          this.navCtrl.navigateForward('/account');
        }).catch(error => {
          console.log(error);
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

}
