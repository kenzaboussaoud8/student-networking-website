import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { UserService } from './providers/user.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appMenu = [
    {title: 'Accueil', url:'/home', icon: 'list'},
    {title: 'Messagerie', url:'/messenger', icon: 'list'},
    {title: 'Mes Demandes', url:'/myrequests', icon: 'list'},
    {title: 'Mon Compte', url:'/account', icon: 'list'},
    {title: 'Deconnexion', url:'/showcase', icon: 'list'}

  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController, 
    private userService: UserService, 
    private router:  Router
  ) {
    this.initializeApp();
  }

  // logout(){
  //   this.userService.Logout(this.token)
  //   .then(data => {
  //     console.log(data);
  //     this.navCtrl.navigateForward('/showcase');
  //    }, error => {
  //     console.log(error);
  //   });
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
