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