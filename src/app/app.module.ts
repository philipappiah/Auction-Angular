import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { AppComponent } from './app.component';
import { MetaModule } from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetaSenderComponent } from './meta/Home/meta-sender.component';
import { UtilModule } from './util/util.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { SignIn, SignUp } from './app.component'




import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatListModule,
  MatDividerModule,
  MatIconModule,
  MatDialogModule,
  MatBadgeModule



} from '@angular/material';
import { LoginModalComponent } from './login-modal/login-modal.component';


const appRoutes: Routes = [
  { path: '', component: MetaSenderComponent },
  { path: 'details/:id', component: DetailViewComponent }



];

@NgModule({
  declarations: [
    AppComponent,
    DetailViewComponent,
    LoginModalComponent,
    SignIn,
    SignUp



  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),

    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    RouterModule,
    UtilModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatBadgeModule






  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SignIn, SignUp
  ]
})


export class AppModule { }
