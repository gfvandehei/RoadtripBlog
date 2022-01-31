import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { JwtService } from '../auth/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) { }

  async login(email: string, password: string): Promise<string>{
    let result = await this.http.post<{token: string}>(`${environment.apiURL}/auth/login`, {
      email: email,
      password: password
    }).toPromise();
    const token = result.token;
    this.jwt.storeJWT(token);
    return token;
  }

  async register(newUser: User & {password: string}){
    let result = await this.http.post<{user: User, token: string}>(`${environment.apiURL}/auth/register`, newUser).toPromise();
    this.jwt.storeJWT(result.token);
    return result;
  }

}
