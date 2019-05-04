import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { FCM } from '@ionic-native/fcm/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private platform: Platform,
    private fcm: FCM,
    private afs: AngularFirestore
  ) {}

  // Get permission from the user
  async getToken(fireUser: firebase.User) {

    if (this.platform.is('cordova')) {
      let token = null;
      await this.fcm.getToken().then(data => {
        token = data;
      }).catch(err => {
        console.log(err);
        alert(JSON.stringify(err));
      });

      return this.saveTokenToFirestore(fireUser, token);
    }

  }

  // Save the token to firestore
  private saveTokenToFirestore(fireUser: firebase.User, token: string) {
    if (!token || fireUser == null) {
      return;
    }

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token,
      uid: fireUser.uid,
      email: fireUser.email
    };

    return devicesRef.doc(token).set(docData);
  }

  // Listen to incoming FCM messages
  onNotification() {
    return this.fcm.onNotification();
  }

  subscribeToTopic(topic: string) {
    this.fcm.subscribeToTopic(topic);
  }

  unsubscribeFromTopic(topic: string) {
    this.fcm.unsubscribeFromTopic(topic);
  }

}
