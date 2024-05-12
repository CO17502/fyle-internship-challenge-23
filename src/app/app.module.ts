import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: ':username', component: UserProfileComponent} // Define route for /username
];

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule, //Add CommonModule
    FormsModule, // Add FormsModule here
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]

})
export class AppModule { }
