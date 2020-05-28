import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailboxComponent } from './mailbox/mailbox.component';
import { ReadComponent } from './read/read.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path:'', component: MailboxComponent }, 
  { path:'mailbox', component: MailboxComponent }, 
  { path:'read', component: ReadComponent } ,
  { path:'login', component: LoginComponent } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
