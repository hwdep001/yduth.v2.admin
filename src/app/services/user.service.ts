import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseData } from './../models/ResponseData';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  async updateNickname(uid: string, nickname: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = {
      uid,
      nickname
    };

    await this.http.patch(`${this.apiServerUrl}/user/nickname`, data, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise().then(reponse => {
      rd = new ResponseData(reponse);
    }).catch((err: HttpErrorResponse) => {
      rd.code = err.status;
      rd.msg = err.statusText;
      console.log(err);
    });

    return rd;
  }

  async updatePhoto(uid: string, photo: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = {
      uid,
      photo
    };

    await this.http.patch(`${this.apiServerUrl}/user/photo`, data, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise().then(reponse => {
      rd = new ResponseData(reponse);
    }).catch((err: HttpErrorResponse) => {
      rd.code = err.status;
      rd.msg = err.statusText;
      console.log(err);
    });

    return rd;
  }

  async withdraw(): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.delete(`${this.apiServerUrl}/user/withdraw`, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise().then(reponse => {
      rd = new ResponseData(reponse);
    }).catch((err: HttpErrorResponse) => {
      rd.code = err.status;
      rd.msg = err.statusText;
      console.log(err);
    });

    return rd;
  }

}
