import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  async getUser(): Promise<User | undefined> {
    const ret = await Preferences.get({ key: 'user' });
    if (ret.value) {
      return JSON.parse(ret.value) as User;
    }
    return undefined;
  }

  async setUser(user: User) {
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user),
    });
  }

  async clearUser() {
    await Preferences.remove({ key: 'user' });
  }

  //   async setFirstUse() {
  //     await Preferences.set({
  //       key: 'first-use',
  //       value: 'true',
  //     });
  //   }

  //   async getFirstUse(): Promise<boolean | undefined> {
  //     const ret = await Preferences.get({ key: 'first-use' });
  //     if (ret.value) {
  //       return JSON.parse(ret.value) as boolean;
  //     }
  //     return undefined;
  //   }

  // private handleGetLoggedUser(user: User) {
  //   if (user != null) {
  //     this.router.navigateByUrl(routes.home());
  //     return false
  //   } else {
  //     return true;
  //   }
  // }
  async setRememberedUser(lastUser: LastUserLogged) {
    await Preferences.set({
      key: 'last-user-logged',
      value: JSON.stringify(lastUser),
    });
  }

  async getRememberedUser(): Promise<LastUserLogged | undefined> {
    const ret = await Preferences.get({ key: 'last-user-logged' });
    if (ret.value) {
      return JSON.parse(ret.value) as LastUserLogged;
    }
    return undefined;
  }

  async clearRememberedUser() {
    await Preferences.remove({ key: 'last-user-logged' });
  }
}

export interface User {
  uid: string;
  name: string;
  //   mobilePushContactKey: string;
}

export interface LastUserLogged {
  userId: number;
  name: string;
  idType: string;
  idNumber: string;
}

export interface BiometricsActivation {
  userId: number;
  biometricsIdentifier: string;
}
