import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router, RouterModule } from '@angular/router'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bromail';

  
}
