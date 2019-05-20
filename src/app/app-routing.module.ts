import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'password-lost', loadChildren: './pages/password-lost/password-lost.module#PasswordLostPageModule' },
  { path: 'showcase', loadChildren: './pages/showcase/showcase.module#ShowcasePageModule' },
  { path: 'myrequests', loadChildren: './pages/myrequests/myrequests.module#MyrequestsPageModule' },
  { path: 'account', loadChildren: './pages/account/account.module#AccountPageModule' },
  { path: 'messenger', loadChildren: './pages/messenger/messenger.module#MessengerPageModule' },
  { path: 'accountpreference', loadChildren: './pages/accountpreference/accountpreference.module#AccountpreferencePageModule' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
