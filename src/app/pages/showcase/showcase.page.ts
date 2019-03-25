import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.page.html',
  styleUrls: ['./showcase.page.scss'],
})
export class ShowcasePage implements OnInit {

  username:string;
  password:string;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  login(){
    console.log("Username: "+ this.username);

    console.log("Password: "+ this.password);
  }

  goRegister(){
    this.navCtrl.navigateForward('/register');
  }

}
