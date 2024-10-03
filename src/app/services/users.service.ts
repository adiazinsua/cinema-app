import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, finalize, tap } from 'rxjs/operators';
import { ErrorCodes, getErrorMessage } from '../models/error-codes.enum';
import { LoaderService } from './loader.service';
import { StorageService } from './storage.service';
import { LoginRequest } from '../models/login/login-request.model';
import { BaseResponse } from '../models/base.response';
import { User } from '../models/user';
import { CreateAccountRequest } from '../models/create-account/create-account-request.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export abstract class UserService {
  public abstract login(request: LoginRequest): Observable<BaseResponse>;
  public abstract createAccount(request: CreateAccountRequest): Observable<BaseResponse>;
  public abstract logout(): Observable<BaseResponse>;
  public abstract resetPassword(email: string): Observable<BaseResponse>;
  public abstract getAvatars(): Observable<any>;
  public abstract updateUserAvatar(userId: string, avatarUrl: string): Observable<BaseResponse>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiUserService implements UserService {
  private readonly usersCollection = 'users';
  private readonly avatarsCollection = 'avatars';

  constructor(
    private storageService: StorageService,
    private loaderService: LoaderService,
    private firebase: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { }

  login(request: LoginRequest): Observable<BaseResponse> {
    this.loaderService.showLoader('Logging in...');
    return from(this.firebase.signInWithEmailAndPassword(request.email, request.plainPassword)).pipe(
      switchMap(credential => {
        if (credential.user) {
          return this.getUserData(credential.user.uid);
        } else {
          throw new Error('Login failed');
        }
      }),
      switchMap(userData => {
        return from(this.storageService.setItem('user', userData)).pipe(
          map(() => userData)
        );
      }),
      catchError(error => {
        return of({ errorMessage: getErrorMessage(error.code) });
      }),
      finalize(() => this.loaderService.hideLoader())
    );
  }

  logout(): Observable<BaseResponse> {
    return from(this.firebase.signOut()).pipe(
      tap(() => {
        this.storageService.removeItem('user');
      }),
      map(() => ({})),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) }))
    );
  }

  createAccount(request: CreateAccountRequest): Observable<BaseResponse> {
    this.loaderService.showLoader();
    return this.getRandomAvatarUrl().pipe(
      switchMap(avatarUrl =>
        from(this.firebase.createUserWithEmailAndPassword(request.email, request.plainPassword)).pipe(
          switchMap(userCredential => {
            if (!userCredential.user) {
              throw new Error(ErrorCodes.UserCreationFailed);
            }
            const newUser: User = {
              uid: userCredential.user.uid,
              email: request.email,
              name: request.name,
              avatarUrl: avatarUrl
            };
            return from(this.firestore.collection(this.usersCollection).doc(newUser.uid).set(newUser)).pipe(
              map(() => newUser)
            );
          })
        )
      ),
      map(user => ({ success: true, data: user } as BaseResponse)),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) })),
      finalize(() => this.loaderService.hideLoader())
    );
  }

  resetPassword(email: string): Observable<BaseResponse> {
    this.loaderService.showLoader('Sending password reset email...');
    return from(this.firebase.sendPasswordResetEmail(email)).pipe(
      map(() => ({})),
      catchError(error => {
        return of({ errorMessage: getErrorMessage(error.code) })
      }),
      finalize(() => this.loaderService.hideLoader())
    );
  }

  getCurrentUser(): Observable<User | null> {
    return from(this.storageService.getItem('user'));
  }

  getAvatars(): Observable<any> {
    return this.firestore.collection<any>(this.avatarsCollection).valueChanges().pipe(
      map(avatars => {
        return avatars.map(avatar => ({ ...avatar })); // Devuelve las películas
      })
    );
  }

  updateUserAvatar(userId: string, avatarUrl: string): Observable<BaseResponse> {
    this.loaderService.showLoader();
    return from(this.firestore.collection(this.usersCollection).doc(userId).update({ avatarUrl: avatarUrl })).pipe(
      map(() => ({})),
      catchError(error => {
        return of({ errorMessage: getErrorMessage(error.code) })
      }),
      finalize(() => this.loaderService.hideLoader())
    )
  }

  private getUserData(uid: string): Observable<any> {
    return this.firestore.collection(this.usersCollection).doc(uid).get().pipe(
      map(doc => {
        if (doc.exists) {
          const userData = doc.data() as User;
          return {
            uid,
            email: userData?.email,
            name: userData?.name,
            avatarUrl: userData?.avatarUrl,
          };
        } else {
          throw new Error('User data not found');
        }
      })
    );
  }

  private getRandomAvatarUrl(): Observable<string> {
    return this.firestore.collection<any>(this.avatarsCollection).valueChanges().pipe(
      map(avatars => {
        if (avatars.length === 0) {
          return '';
        }
        const randomIndex = Math.floor(Math.random() * avatars.length);
        return avatars[randomIndex].url;
      }),
      catchError(error => {
        return of('');
      })
    );
  }
}