import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtService} from "../auth/jwt.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) { }
}
