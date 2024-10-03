import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async setItem(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async getItem(key: string) {
    return await this.storage.get(key);
  }

  async removeItem(key: string) {
    await this.storage.remove(key);
  }
}
