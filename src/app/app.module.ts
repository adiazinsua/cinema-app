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
import { ApiUserService, UserService } from './services/users.service';
import { ToastService } from './services/toasts.service';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { HomePage } from './pages/home/home.page';
import { PasswordRecoveryPage } from './pages/password-recovery/password-recovery.page';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { MovieService } from './services/movies.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AddmovieModalComponent } from './modals/add-movie/add-movie.component';
import { MovieDetailPage } from './pages/movie-detail/movie-detail.page';
import { DatePipe } from '@angular/common';
import { LoaderService } from './services/loader.service';
import { ChangeAvatarPage } from './pages/change-avatar/change-avatar.page';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    CreateAccountPage,
    PasswordRecoveryPage,
    HomePage,
    MovieCardComponent,
    RatingStarsComponent,
    AddmovieModalComponent,
    MovieDetailPage,
    ChangeAvatarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirestoreModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: UserService,
      useClass: ApiUserService,
    },
    ToastService,
    MovieService,
    DatePipe,
    LoaderService, LoaderService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
