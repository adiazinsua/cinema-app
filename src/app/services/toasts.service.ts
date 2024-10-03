import { DestroyRef, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';
import { EventType, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private static DEFAULT_DURATION = 1000 * 20;

  private toastButtons: ToastButton[] = [
    {
      icon: 'close-outline',
      role: 'cancel',
    },
  ];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    const sub = this.router.events.subscribe((x) => {
      if (x.type == EventType.NavigationStart) {
        this.dismissAllToasts();
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  async error(
    message: string,
    durationMsec: number = ToastService.DEFAULT_DURATION
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: durationMsec,
      color: 'danger',
      position: 'top',
      buttons: this.toastButtons,
    });
    await toast.present();
  }

  async dismissAllToasts() {
    const toast = await this.toastController.getTop();
    if (toast) {
      await toast.dismiss();
    }
  }

  async success(
    message: string,
    durationMsec: number = ToastService.DEFAULT_DURATION
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: durationMsec,
      color: 'success',
      position: 'top',
      buttons: this.toastButtons,
    });
    await toast.present();
  }
}
