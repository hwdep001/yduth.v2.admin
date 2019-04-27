import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  async presentSucToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'bottom',
      color: 'primary',
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

  async presentErrToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'bottom',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

  async getLoading(message?: string, duration?: number): Promise<HTMLIonLoadingElement> {
    return await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: (message == null ? 'Loading...' : message),
      animated: true,
      translucent: true,
      duration: (duration == null ? 20000 : duration)
    });
  }

}
