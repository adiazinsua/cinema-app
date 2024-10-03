import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private storageService: StorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.storageService.getItem('user');

    if (!user) {
      // User is not logged in, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  // private checkMovieOwnership(userId: string, movieId: string): Observable<boolean> {
  //   return this.firestore
  //     .collection('movies', ref => ref.where('userId', '==', userId).where('id', '==', movieId))
  //     .get()
  //     .pipe(
  //       map(snapshot => {
  //         if (!snapshot.empty) {
  //           return true; // La película pertenece al usuario
  //         } else {
  //           this.router.navigate(['/home']); // Redirigir si no pertenece
  //           return false; // La película no pertenece al usuario
  //         }
  //       })
  //     );
  // }
}


// import {inject, Injectable} from "@angular/core";
// import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
// import {StorageService, User} from "../storage.service";
// import {fromPromise} from "rxjs/internal/observable/innerFrom";
// import {routes} from "../../app.routes";

// @Injectable({
//   providedIn: 'root'
// })
// class LoggedInService {

//   constructor(
//     private router: Router,
//     private storageService: StorageService,
//   ) {

//   }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const promise = this.storageService.getUser().then(this.handleGetLoggedUser.bind(this))
//     return fromPromise(promise);
//   }

//   private handleGetLoggedUser(user: User) {
//     if (user != null) {
//       this.router.navigateByUrl(routes.home());
//       return false
//     } else {
//       return true;
//     }
//   }

// }

// export const LoggedInGuard: CanActivateFn = (route, state) => {
//   return inject(LoggedInService).canActivate(route, state);
// }