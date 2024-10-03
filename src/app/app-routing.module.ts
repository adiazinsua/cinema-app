import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { HomePage } from './pages/home/home.page';
import { PasswordRecoveryPage } from './pages/password-recovery/password-recovery.page';
import { MovieDetailPage } from './pages/movie-detail/movie-detail.page';
import { AuthGuard } from './services/guards/auth.guard';
import { ChangeAvatarPage } from './pages/change-avatar/change-avatar.page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'create-account',
    component: CreateAccountPage,
  },
  {
    path: 'password-recovery',
    component: PasswordRecoveryPage,
  },
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'movie/:id',
    component: MovieDetailPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-avatar',
    component: ChangeAvatarPage,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
