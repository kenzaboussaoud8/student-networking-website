import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  loginForm: FormGroup;

  error_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
		  { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minLength', message: 'Password length must be longer or equal than 6 characters.'},
      { type: 'pattern', message: 'Password must contain number, special, uppercase and lowercase characters.'}
    ],
  }

  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router, private storage: Storage, public formBuilder: FormBuilder) { 
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+!*$@%_])(?=.*[0-9])[a-zA-Z0-9-+!*$@%_]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
     ]))
    });
  }

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
