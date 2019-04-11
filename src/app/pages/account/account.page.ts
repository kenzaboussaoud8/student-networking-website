import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  man:string
  women:string
  bio:string

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  goPassword_lost(){
    this.navCtrl.navigateForward('/password-lost');
  }

  goaccountpreference(){
    this.navCtrl.navigateForward('/accountpreference');
  }

}
