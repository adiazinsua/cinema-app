import { Observable, of } from "rxjs";
import { BaseResponse } from "src/app/models/base.response";
import { CreateAccountRequest } from "src/app/models/create-account/create-account-request.model";
import { LoginRequest } from "src/app/models/login/login-request.model";
import { UserService } from "../users.service";

export class MockUserService extends UserService {

  private avatarList = [
    { url: 'randomurl' },
    { url: 'randomur2' },
    { url: 'randomur3' },
    { url: 'randomur4' },
    { url: 'randomur5' },
  ]

  public override login(request: LoginRequest): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override createAccount(request: CreateAccountRequest): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override logout(): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override resetPassword(email: string): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override getAvatars(): Observable<any> {
    return of(this.avatarList);
  }

  public override updateUserAvatar(userId: string, avatarUrl: string): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response)
  }
}