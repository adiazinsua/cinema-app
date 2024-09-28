import { DestroyRef, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';
import { EventType, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private static ERROR_DEFAULT_DURATION = 1000 * 20;
  private static NO_CONNECTION_TOAST_ID = 'noConnectionToast';

  private errorToastButtons: ToastButton[] = [
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
    durationMsec: number = ToastService.ERROR_DEFAULT_DURATION
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: durationMsec,
      color: 'danger',
      position: 'top',
      buttons: this.errorToastButtons,
    });
    await toast.present();
  }

  async noConnectionToast(message: string) {
    const existingToast = await this.toastController.getTop();

    if (existingToast?.id == ToastService.NO_CONNECTION_TOAST_ID) {
      return;
    }

    const toast = await this.toastController.create({
      message: message,
      //   duration: null,
      color: 'danger',
      position: 'top',
      id: ToastService.NO_CONNECTION_TOAST_ID,
    });
    await toast.present();
  }

  async dismissNoConnectionToast() {
    const toast = await this.toastController.getTop();

    if (toast?.id == ToastService.NO_CONNECTION_TOAST_ID) {
      await toast.dismiss();
    }
  }

  async dismissAllToasts() {
    const toast = await this.toastController.getTop();
    if (toast) {
      await toast.dismiss();
    }
  }
}
