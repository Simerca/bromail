import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

import {ActivatedRoute, Router} from '@angular/router'

export interface MailData {
  expeditor:{
    userDisplayName:string
  }
  instantMessageId:any
}

export interface InstantMessage{
  msg:any
};

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  public MailData:Observable<MailData>;
  public instantMessage:Observable<any>;
  public directMessageContent;
  public mailId;
  public userHash:string = "@Simerca";
  public instantMessageID:any;

  constructor(
    private firestore:AngularFirestore,
    private route:ActivatedRoute,
    private router:Router,
  ) { 


    // On recupere l'id du mail 
    this.route.queryParams.subscribe(e=>{
      console.log(e);
      let mailId = e['id'];
      this.mailId = mailId
      // on recupere la donnée du mail 
      this.MailData = this.firestore.doc<MailData>('mails/'+mailId).valueChanges();
      this.firestore.doc('mails/'+mailId).update({
        unRead:false
      })
      // Lecture du resultat asynchrone 
      this.MailData.subscribe(mail=>{
        this.instantMessageID = mail.instantMessageId;
        console.log('set InstantMessageID');
        console.log(this.instantMessageID);
          this.instantMessage = this.firestore.doc<InstantMessage>('instantMail/'+this.instantMessageID).valueChanges();
          this.instantMessage.subscribe(e=>{
            console.log('Read Instant Message');
              console.log(e);
            })

      });

    
      

    })




  }

  sendNewDirectMessage(){

    // On envoi un nouveau message direct 
    let body = {
      userHash:this.userHash,
      content:this.directMessageContent
    }

    this.firestore.doc('instantMail/'+this.instantMessageID).get().subscribe(e=>{

      // On recupere les anciens messages 
      let oldMessage = e.data()['messages'];
      let newMessage: any = [];
      // si des messages exist 
      if(Object.keys(oldMessage).length != 0){
        newMessage = oldMessage;
      }
      newMessage.push(body);

      // Update 
      this.firestore.doc('instantMail/'+this.instantMessageID).update({messages:newMessage})
      this.directMessageContent = "";
    })

  }

  ngOnInit(): void {
   
  }



}
