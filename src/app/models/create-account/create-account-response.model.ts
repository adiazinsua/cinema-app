export class CreateAccountResponse {
  public success?: boolean;
  public errors?: CreateAccountResponseErrors;
}

export class CreateAccountResponseErrors {
  public apiError?: boolean;
  public userAlreadyExists?: boolean;
}
