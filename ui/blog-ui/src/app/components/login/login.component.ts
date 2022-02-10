import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/api/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usernameControl = new FormControl('');
  passwordControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logIn(){
    if(this.usernameControl.valid && this.passwordControl.valid){
        this.authService.login(
          this.usernameControl.value, 
          this.passwordControl.value
        ).then((result) => {
          //go to home, we dont need to use result (its the token)
          this.router.navigateByUrl("/");
        }, (err) => {
          console.log(err);
          alert(err);
        })
    }
  }

  register(){
    this.router.navigateByUrl("/register");
  }

  continueAsGuest(){
    this.authService.loginGuest().then(result => {
      this.router.navigateByUrl("/");
    }, (err) => {
      console.log(err);
      alert(err);
    })
  }
}
