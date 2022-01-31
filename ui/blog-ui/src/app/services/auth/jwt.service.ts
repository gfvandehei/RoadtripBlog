import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
  constructor() { }

  storeJWT(jwt: string){
    localStorage.setItem("x-access-token", jwt);
  }

  getJWT(){
    return localStorage.getItem("x-access-token");
  }

}
