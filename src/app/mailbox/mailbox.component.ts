import { Component, OnInit } from '@angular/core'; 
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})
export class MailboxComponent implements OnInit {

  public Editor = ClassicEditor;
  public Mails:Observable<any[]>

  // New message var 
  public newMessageMessage;
  public newMessageReceiver;
  public newMessageSubject;


  public userHash:any = "@Simerca";

  constructor(
    private firestore:AngularFirestore
  ) {

    this.Mails = this.firestore.collection('mails',ref=>ref.where('receiver.userHash','==',this.userHash)).snapshotChanges();

   }
  ngOnInit(): void {
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
        
      },
      unRead:true,
      date:new Date(),
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
      }).then(instantMsg=>{
        this.firestore.doc('mails/'+e.id).update({instantMessageId:instantMsg.id})
      })
    });

    // Reset du formulaire 
    this.newMessageMessage = "";
    this.newMessageReceiver = "";
  }

}
