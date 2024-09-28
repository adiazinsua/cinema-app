import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
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
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toasts.service';

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
  public folder!: string;

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
    private authService: AuthService
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
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  create() {
    this.clearToast();
    var request = new CreateAccountRequest();
    request.email = this.form.value.email;
    request.plainPassword = this.form.value.password;
    request.name = this.form.value.name;

    this.authService.createAccount(request).then((response) => {
      if (response.success) {
        console.log('login exitoso');
        //redirect
        return;
      }

      if (response.errorCode) {
        this.setErrorMessage('error al crear');
        return;
      }
    });
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
