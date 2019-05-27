import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HTTP) {}

  getLogin(username: string, password: string) {
    return this.http.get('hihihi', {}, {});
  }
}
