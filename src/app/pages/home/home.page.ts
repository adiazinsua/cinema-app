import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { LoginRequest } from 'src/app/models/login/login-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService, User } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toasts.service';
// import { UsersService } from 'src/app/services/users.service';

const DEFAULT_API_ERROR_MESSAGE = 'Something went wrong!';
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid username or password';
const INVALID_FORM_ERROR_MESSAGE = 'All fields are required';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private user?: User;
  public userName?: string;
  // public form: FormGroup;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private navController: NavController,
    private storageService: StorageService
  ) {

  }

  ngOnInit() {
    this.storageService.getUser().then(user => {
      this.user = user as User;
      this.userName = user?.name;
    });
  }

  changeIcon() {
    console.log('icon');
  }

  logout() {
    this.authService.logout().then(() => this.redirectToLogin())
  }
  // get passwordHasValue() {
  //   return this.form.value.password != null;
  // }

  // login() {
  //   this.clearToast();

  //   if (this.form.invalid) {
  //     this.setErrorMessage(INVALID_FORM_ERROR_MESSAGE);
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   const request = new LoginRequest();
  //   request.email = this.form.value.email;
  //   request.plainPassword = this.form.value.password;

  // this.usersService.login(request).subscribe((response) => {
  //   console.log(response);
  //   if (response.success) {
  //     // guardosesion
  //     console.log('Login exitoso', response);

  //     // this.navCtrl.navigateForward('/dashboard');
  //     return;
  //   }

  //   if (response.errorCode) {
  //     if (response.errorCode == 'auth/invalid-credential') {
  //       this.setErrorMessage(INVALID_CREDENTIALS_ERROR_MESSAGE);
  //     } else {
  //       this.setErrorMessage(DEFAULT_API_ERROR_MESSAGE);
  //     }
  //   }
  // });
  // }

  redirectToLogin() {
    this.navController.navigateRoot([routes.login()]);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
