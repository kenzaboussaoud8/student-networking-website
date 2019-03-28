import { Component, OnInit } from '@angular/core';
import { NavController, /*NavParams*/ } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email:string;
  first_name:string;
  last_name:string;
  password:string;
  birth_date:string;
  student_card:string;
  
  constructor(public navCtrl: NavController, /*public navParams: NavParams*/) { }

  ngOnInit() {
  }

  ionViewDidload(){

    console.log('ionViewDidLoad RegisterPage');
  }

  Register(){
    if(this.email.length == 0 || this.first_name.length == 0 || this.last_name.length == 0 || this.password.length == 0 || this.birth_date.length == 0 || this.birth_date.length == 0){
      alert("Please fill all fields");
    }
  }

  goShowcase(){
    this.navCtrl.navigateBack('/showcase');
  }

}
