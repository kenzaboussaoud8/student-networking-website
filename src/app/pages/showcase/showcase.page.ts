import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.page.html',
  styleUrls: ['./showcase.page.scss'],
})
export class ShowcasePage implements OnInit {

  email: string;
  password: string;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  login() {
    console.log('Email: ' + this.email);

    console.log('Password: ' + this.password);
  }

  goRegister() {
    this.navCtrl.navigateForward('/register');
  }

}
