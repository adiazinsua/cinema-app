import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { LoginRequest } from 'src/app/models/login/login-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toasts.service';


const DEFAULT_API_ERROR_MESSAGE = 'Something went wrong!';
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid username or password';
const INVALID_FORM_ERROR_MESSAGE = 'All fields are required';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private navController: NavController
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  ngOnInit() { }

  changeIcon() {
    console.log('icon');
  }

  get passwordHasValue() {
    return this.form.value.password != null;
  }

  login() {
    this.clearToast();

    if (this.form.invalid) {
      this.setErrorMessage(INVALID_FORM_ERROR_MESSAGE);
      this.form.markAllAsTouched();
      return;
    }

    const request = new LoginRequest();
    request.email = this.form.value.email;
    request.plainPassword = this.form.value.password;

    this.authService.login(request).then((response) => {
      if (response.success) {
        this.redirectToHome();
        return;
      }

      if (response.errorCode) {
        if (response.errorCode == 'auth/invalid-credential') {
          this.setErrorMessage(INVALID_CREDENTIALS_ERROR_MESSAGE);
        } else {
          this.setErrorMessage(DEFAULT_API_ERROR_MESSAGE);
        }
      }
    });
  }

  redirectToCreateAccount() {
    this.navController.navigateRoot([routes.createAccount()]);
  }

  redirectToHome() {
    this.navController.navigateRoot([routes.home()]);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
