import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { CreateAccountRequest } from 'src/app/models/create-account/create-account-request.model';
import { ToastService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/users.service';

const ACCOUNT_CREATED_SUCCESS_MESSAGE = 'Account created successfully! You can now log in to your new account'

export function SamePasswordBothInputs(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordCtrl = control.get('password');
    const rePasswordCtrl = control.get('confirmPassword');

    if (passwordCtrl?.value && rePasswordCtrl?.value) {
      const password = passwordCtrl.value;
      const rePassword = rePasswordCtrl.value;

      if (password !== rePassword) {
        return { passwordMismatch: true };
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);

  public form: FormGroup;

  public specialCharRegex = new RegExp(
    /[!"#$%&'()*+,\-.\/:;<=>?\[@\]^_{|}\\~]/
  );
  public uppercaseRegex = new RegExp(/[A-Z]/);
  public lowercaseRegex = new RegExp(/[a-z]/);
  public lengthRegex = new RegExp(/^.{8,30}$/);

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private userService: UserService
  ) {
    this.form = this.fb.group(
      {
        email: [null, [Validators.required, Validators.email]],
        name: [null, Validators.required],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      { validators: [SamePasswordBothInputs()] }
    );
  }

  ngOnInit() {
  }

  create() {
    this.clearToast();
    var request = new CreateAccountRequest();
    request.email = this.form.value.email;
    request.plainPassword = this.form.value.password;
    request.name = this.form.value.name;

    this.userService.createAccount(request).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.redirectToLoginWithMessage(ACCOUNT_CREATED_SUCCESS_MESSAGE)
    })
  }

  get showPasswordRequirements(): boolean {
    return this.form?.controls['password']?.dirty;
  }

  public passwordTestRegex(exp: RegExp) {
    return exp.test(this.form.get('password')?.value);
  }

  get shouldEnableCreateBtn() {
    return (
      this.form.valid &&
      this.passwordTestRegex(this.lowercaseRegex) &&
      this.passwordTestRegex(this.uppercaseRegex) &&
      this.passwordTestRegex(this.specialCharRegex) &&
      this.passwordTestRegex(this.lengthRegex)
    );
  }

  redirectToLoginWithMessage(message: string = '') {
    this.navController.navigateRoot([routes.login()], { state: { successMessage: message } });
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
