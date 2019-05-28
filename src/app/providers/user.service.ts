import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HTTP) {}

  Login(email: string, password: string){
    return this.http.post("http://10.10.10.38:8080/login", {email: email, password: password}, {})
  }

  Register(email: string, first_name: string, last_name: string, password: string, birth_date: string, student_card: string){
    return this.http.post("http://10.10.10.38:8080/register", {email: email, first_name: first_name, last_name: last_name, password: password, birth_date: birth_date, student_card: student_card}, {})
  }

  Logout(token: string){
    return this.http.post("http://10.10.10.38:8080/logout", {token: token}, {})
  }
}
