import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { CommonService } from './common.service';

import { ResponseData } from './../models/ResponseData';
import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServerUrl: string;
  private userInfo: User = null;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth,
    private cmnService: CommonService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  get user(): User {
    return this.userInfo;
  }

  get existUser(): boolean {
    return this.userInfo == null ? false : true;
  }

  get uid(): string {
    return this.existUser ? this.userInfo.uid : null;
  }

  get email(): string {
    return this.existUser ? this.userInfo.email : null;
  }

  get googlePhotoUrl(): string {
    return this.existUser ? this.userInfo.googlePhotoUrl : null;
  }

  get nickname(): string {
    return this.existUser ? this.userInfo.nickname : null;
  }

  get photo(): string {
    return this.existUser ? this.userInfo.photo : null;
  }

  setUser(user: User) {
    this.userInfo =  user;
  }

  getFireAuth(): firebase.auth.Auth {
    return this.afAuth.auth;
  }

  async getIdToken(): Promise<string> {

    let idToken;

    if (environment.devAppTest) {
      idToken = await fetch(environment.devAppTestFilePath).then(async response => {
        return await response.json().then(data => idToken = data.idToken);
      });
    } else {
      idToken = await this.getFireAuth().currentUser.getIdToken(true);
    }

    return idToken;
  }

  async signIn() {
    const loading = await this.getLoading();
    loading.present();

    const promises = new Array();

    if (this.platform.is('cordova')) {
      promises.push(await this.nativeGoogleLogin());
    } else {
      promises.push(await this.webGoogleLogin());
    }

    Promise.all(promises)
      .catch(err => {
        // console.log(err);
      })
      .finally(() => loading.dismiss());
  }

  webGoogleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider).catch(err => {
      // popup 취소 에러
      // console.log(err);
    });
  }

  async nativeGoogleLogin(): Promise<any> {
    return this.gplus.login(this.getGoogleLoginOptions()).then(provider => {
      return this.afAuth.auth.signInAndRetrieveDataWithCredential(
        firebase.auth.GoogleAuthProvider.credential(provider.idToken)
      );
    }).catch(err => {
      // console.log(err);
    });
  }

  googleTrySilentLogin() {
    this.gplus.trySilentLogin(this.getGoogleLoginOptions());
  }

  getGoogleLoginOptions()  {
    return {
      webClientId: environment.webClientId,
      offline: false,
      scopes: 'profile email'
    };
  }

  async updateSignInInfo(): Promise<User> {

    if (this.platform.is('cordova')) {
      this.googleTrySilentLogin();
    }

    const idToken: string = await this.getIdToken();
    const rd = new ResponseData(
      await this.http.post(`${this.apiServerUrl}/ad/sign-in-up`, null, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise() as ResponseData);

    if (rd.res) {
      this.userInfo = rd.data as User;
    } else {
      this.signOut();
      this.cmnService.presentErrToast(rd.toErrString());
    }

    return this.userInfo;
  }

  async signOut() {
    this.userInfo = null;

    if (this.platform.is('cordova')) {
      await this.gplus.disconnect();
    }

    this.afAuth.auth.signOut();
  }

  async getLoading(): Promise<HTMLIonLoadingElement> {
    return await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Loading...',
      animated: true,
      translucent: true,
      showBackdrop: true,
      backdropDismiss: true,
      duration: 20000
    });
  }

}
