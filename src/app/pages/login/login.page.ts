import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { LoginRequest } from 'src/app/models/login/login-request.model';
import { UserService } from 'src/app/services/users.service';
import { ToastService } from 'src/app/services/toasts.service';

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
    private userService: UserService,
    private toastService: ToastService,
    private navController: NavController
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  ngOnInit() {
    const successMessage = history?.state?.successMessage;
    if (successMessage) {
      this.setSuccessMessage(successMessage);
    }
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

    this.userService.login(request).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.redirectToHome();
    });
  }

  redirectToCreateAccount() {
    this.navController.navigateRoot([routes.createAccount()]);
  }

  redirectToHome() {
    this.navController.navigateRoot([routes.home()]);
  }

  redirectToPasswordRecovery() {
    this.navController.navigateForward([routes.passwordRecovery()]);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async setSuccessMessage(message: string) {
    await this.toastService.success(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
