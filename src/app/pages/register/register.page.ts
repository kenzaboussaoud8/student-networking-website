import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './../../providers/user.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AgeValidator } from './../../../validators/age';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  results: Promise<any>;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  birth_date: string;
  student_card: string;
  registerForm: FormGroup;

  error_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
		  { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    'first_name': [
      { type: 'required', message: 'Firstname is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Lastname is required.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minLength', message: 'Password length must be longer or equal than 6 characters.'},
      { type: 'pattern', message: 'Password must contain number, special, uppercase and lowercase characters.'}
    ],
    'birth_date': [
      { type: 'required', message: 'Birth date is required.' },
      { type: 'notOldEnough', message: 'You must be 18 or older to use this app.' }
    ],
    'student_card': [
      { type: 'required', message: 'Student card is required.' }
    ],
  }
  
  constructor(public navCtrl: NavController, private userService: UserService, private  router:  Router, public formBuilder: FormBuilder, public alertCtrl: AlertController) { 
    this.registerForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+!*$@%_])(?=.*[0-9])[a-zA-Z0-9-+!*$@%_]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
     ])),
      birth_date: new FormControl('', Validators.compose([
        Validators.required,
        AgeValidator.isValid
      ])),
      student_card: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
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
        this.presentAlert;
        this.navCtrl.navigateForward('/showcase');
      }).catch(error => {
        console.log(error);
      });
    }
  }


}
