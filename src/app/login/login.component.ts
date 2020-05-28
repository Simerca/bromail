import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import {AppComponent} from '../app.component';
import {HeaderComponent} from '../header/header.component';
import {AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email;
  public error;
  public errorMessage;
  public isLoggedIn: Observable<User>;
  public password;
  constructor(
    public auth: AngularFireAuth,
    public header: HeaderComponent,
    public firestore: AngularFirestore,
    public router: Router,
  ) { 

    this.isLoggedIn = this.auth.user;
    this.isLoggedIn.subscribe(e=>{
      if(e){
        this.router.navigate(['/']);
      }
    })

  }

  ngOnInit(): void {
  }

  onLogin(){
    this.error = false;
    this.auth.signInWithEmailAndPassword(this.email, this.password).then(e=>{
      console.log(e);
      this.router.navigate(['/']);
      
    }).catch(error=>{
      this.error = true;
      this.errorMessage = error.message
      console.log(error);
    })
  }

  onRegister(){
    this.error = false;
    this.auth.createUserWithEmailAndPassword(this.email,this.password).then(e=>{
      console.log(e);
      this.firestore.collection('users').doc(e.user.uid).set({
        email:e.user.email,
        displayName:e.user.displayName,
        uid:e.user.uid
      }).then(e=>{
        this.router.navigate(['/']);
      })
    }).catch(error=>{
      this.error = true;
      this.errorMessage = error.message;
    })
  }

}
