import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/users.service';
import { ToastService } from 'src/app/services/toasts.service';

const EMAIL_SENT_SUCCESS_MESSAGE = 'Password recovery email sent!';
const INVALID_FORM_ERROR_MESSAGE = 'All fields are required';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private toastService: ToastService,
    private navController: NavController
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() { }

  recover() {
    this.clearToast();

    if (this.form.invalid) {
      this.setErrorMessage(INVALID_FORM_ERROR_MESSAGE);
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;

    this.usersService.resetPassword(email).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.setSuccessMessage(EMAIL_SENT_SUCCESS_MESSAGE);
    });
  }


  back() {
    this.navController.back();
  }

  async setSuccessMessage(message: string) {
    await this.toastService.success(message);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }


}
