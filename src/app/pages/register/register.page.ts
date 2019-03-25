import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username:string;
  password:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ngOnInit() {
  }

  ionViewDidload(){

    console.log('ionViewDidLoad RegisterPage');
  }

  Register(){
    if(this.username.length==0 || this.password.length==0){
      alert("Please fill all fields");
    }
  }

  goShowcase(){
    this.navCtrl.navigateBack('/showcase');
  }

}
