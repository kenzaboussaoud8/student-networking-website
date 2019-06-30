import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';
import { PasswordLostPage } from '../pages/password-lost/password-lost.page';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HTTP) {}

  Login(email: string, password: string){
    return this.http.post("http://192.168.1.14:8080/login", {email: email, password: password}, {})
  }

  Register(email: string, first_name: string, last_name: string, password: string, birth_date: string, student_card: string){
    return this.http.post("http://192.168.1.14:8080/register", {email: email, first_name: first_name, last_name: last_name, password: password, birth_date: birth_date, student_card: student_card}, {})
  }

  Logout(token: string){
    return this.http.delete("http://192.168.1.14:8080/logout", {}, {authorization: token})
  }

  User(token: string){
    return this.http.get("http://192.168.1.14:8080/user",{},{authorization: token})
  }

  Schools(){
    return this.http.get("http://192.168.1.14:8080/schools",{},{})
  }

  Cities(){
    return this.http.get("http://192.168.1.14:8080/cities",{},{})
  }

  UpdatePassword(token: string, password: string, newPassword: string, confirmPassword: string){
    return this.http.put("http://192.168.1.14:8080/modifyPassword",{password: password, newPassword: newPassword, confirmPassword: confirmPassword},{authorization: token})
  }

  UpdateUserInfo(token: string, bio: string, City_id: string, School_id: string, gender: string ){
    return this.http.put("http://192.168.1.14:8080/modifyUserInfo",{bio: bio,City_id: City_id, School_id: School_id, gender: gender},{authorization: token})
  }
  
}
