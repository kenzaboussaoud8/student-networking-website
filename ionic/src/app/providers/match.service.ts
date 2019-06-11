import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HTTP) {}
}
