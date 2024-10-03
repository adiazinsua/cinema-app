import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loader: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) { }

  async showLoader(message: string = 'Loading...') {
    this.loader = await this.loadingController.create({
      message,
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    await this.loader.present();
  }

  async hideLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  async updateMessage(newMessage: string) {
    if (this.loader) {
      this.loader.message = newMessage;
    }
  }

}