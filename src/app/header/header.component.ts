import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router, RouterModule } from '@angular/router'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { filter } from 'rxjs/operators';
import { map } from "rxjs/operators";

export interface User {
  
}

export interface Mails{
}
export interface Mail {
  idDoc:string,
  expeditor:{
    userHash:any
  }
  data:{
    subject:any,
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  public Editor = ClassicEditor;
  public Mails:Observable<Mail[]>
  public searchType;

  public isLoggedIn: Observable<User>;   

  // New message var 
  public newMessageMessage;
  public newMessageReceiver;
  public newMessageSubject;


  public userHash:any = "@Simerca";
  public isLogin: boolean = false;
  constructor(
    private firestore:AngularFirestore,
    public router:Router,
    public auth:AngularFireAuth,
    public authGuard:AngularFireAuthGuard
  ) {

    this.isLoggedIn = this.auth.user;
    
    this.Mails = this.firestore.collection<Mail>('mails',ref=>ref.where('receiver.userHash','==',this.userHash)).valueChanges({idField: 'idDoc'});
      

   }
  ngOnInit(): void {
   
  }

  onLogout(){
    this.auth.signOut().then(e=>{
      this.router.navigate(['/login'])
    });

  }

  onFilter(event){
    console.log(event.target.value);

    switch(this.searchType){
      case "subject":
        console.log('search by subject')
        this.Mails = this.Mails.pipe(map(mailbox => mailbox.filter(item=>(item.data.subject.indexOf(event.target.value) > -1))))
        break;
        case "user":
          console.log('search by user')
          this.Mails = this.Mails.pipe(map(mailbox => mailbox.filter(item=>(item.expeditor.userHash.indexOf(event.target.value) > -1))))
        break;
    }
  }
  
  onDelete(id){
    this.firestore.doc('mails/'+id).delete();
  }

  sendMail(){

    console.log(this.newMessageMessage);

    // on prepare le contenu du mail 
    let message = {
      expeditor:{
        userDisplayName:"Ayrton Lecoutre",
        userHash:this.userHash
      },
      receiver:{
        userHash:this.newMessageReceiver,
        unRead:true
      },
      data:{
        subject:this.newMessageSubject,
        message:this.newMessageMessage
      }
    }

    // On crée un nouveau mail dans la bdd 
    this.firestore.collection('mails').add(message).then(e=>{
      // Insertion ok alors on prepapre instantMail 
      this.firestore.collection('instantMail').add({
        mailID:e.id,
        messages:{}
      })
    });

    // Reset du formulaire 
    this.newMessageMessage = "";
    this.newMessageReceiver = "";
  }
}
