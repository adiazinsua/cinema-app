import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonInput } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from './pages/login/login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirestoreModule } from '@angular/fire/firestore';
import { ApiAuthService, AuthService } from './services/auth.service';
import { ToastService } from './services/toasts.service';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { HomePage } from './pages/home/home.page';

@NgModule({
  declarations: [AppComponent, LoginPage, CreateAccountPage, HomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirestoreModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: AuthService,
      useClass: ApiAuthService,
    },
    ToastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
