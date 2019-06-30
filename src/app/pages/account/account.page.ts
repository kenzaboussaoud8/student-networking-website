import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  results : Promise<any>
  token : string

  public email : string = '';
  public first_name : string ='';
  public last_name : string ='';
  public birth_date : Date = null;
  public gender : string ='';
  public bio : string ='';
  public cities : any [];
  public schools : any [];
  public city_user : string ='';
  public school_user : string ='';

  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('token').then((val) => {
      this.userService.User(val).then(({data}) => {
        var data_user = JSON.parse(data);
        this.email = data_user.message.email;
        this.first_name = data_user.message.first_name;
        this.last_name = data_user.message.last_name;
        this.birth_date = data_user.message.birth_date;
        this.gender = data_user.message.gender;
        this.city_user = data_user.message.cityname;
        this.school_user = data_user.message.name;
        this.userService.Schools().then(({data}) => {
          var data_schools = JSON.parse(data);
          this.schools = data_schools.message;
          console.log(this.schools);
        }).catch(error => {
          console.log(error);
        });
        this.userService.Cities().then(({data}) => {
          var data_cities = JSON.parse(data);
          this.cities = data_cities.message;
          console.log(this.cities);
        }).catch(error => {
          console.log(error);
        });
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
      this.navCtrl.navigateForward('/showcase');
    });
  }

  goPassword_lost(){
    this.navCtrl.navigateForward('/password-lost');
  }

  goaccountpreference(){
    this.navCtrl.navigateForward('/accountpreference');
  }

  saveaccount(){
    this.storage.get('token').then((val) => {
      this.token = val;
      this.userService.UpdateUserInfo(this.token, this.bio, this.city_user, this.school_user, this.gender).then(({data}) => {
        console.log(data);
        console.log(this.token);
        alert("info updated");
        this.navCtrl.navigateForward('/account');
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }
}
