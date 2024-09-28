import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login/login-request.model';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { apiRoutes } from '../models/api-routes';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CreateAccountPage } from '../pages/create-account/create-account.page';
import { CreateAccountRequest } from '../models/create-account/create-account-request.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseResponse } from '../models/base.response';
import { StorageService, User } from './storage.service';
import { UserData } from '../pages/login/user-data.interface';


export abstract class AuthService {
  public abstract login(request: LoginRequest): Promise<BaseResponse<any>>;
  public abstract createAccount(
    request: CreateAccountRequest
  ): Promise<BaseResponse<any>>;
  public abstract logout(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService implements AuthService {
  constructor(
    private fbAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storageService: StorageService
  ) { }

  login(request: LoginRequest): Promise<BaseResponse<any>> {
    const response = new BaseResponse<any>();

    return new Promise((resolve, reject) => {
      this.fbAuth
        .signInWithEmailAndPassword(request.email, request.plainPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            this.firestore.collection('users').doc(user.uid).get()
              .subscribe((res) => {
                const userData = res.data() as UserData;

                if (userData) {
                  const loggedUser: User = {
                    uid: user.uid,
                    name: userData.name
                  }

                  this.storageService.setUser(loggedUser);

                  response.success = true;
                  response.data = userData;
                  resolve(response);
                }
              });
          }
        })
        .catch((error) => {
          console.log(error);
          response.success = false;
          response.errorCode = error.code;
          response.data = null;
          resolve(response);
        });
    });
  }

  createAccount(request: CreateAccountRequest): Promise<BaseResponse<any>> {
    return new Promise((resolve) => {
      const response = new BaseResponse<any>();

      this.fbAuth
        .createUserWithEmailAndPassword(request.email, request.plainPassword)
        .then(async (userCredential) => {
          const user = userCredential.user;

          if (user) {
            try {
              // create user in firestore
              await this.firestore
                .collection('users')
                .doc(user.uid)
                .set({
                  email: request.email,
                  name: request.name,
                })
                .then(() => {
                  response.success = true;
                })
                .catch((error) => {
                  response.success = false;
                  response.errorCode = error.code;
                });
            } catch (fsError) {
              // response.success = false;
              // response.errorCode = fsError.code;
              // response.data = { message: 'Failed to save user information in Firestore', error: firestoreError };
            }
          }
          resolve(response);
        })
        .catch((authError) => {
          response.success = false;
          response.errorCode = authError.code;
          resolve(response);
        });
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fbAuth.signOut()
        .then(() => {
          this.storageService.clearUser();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
