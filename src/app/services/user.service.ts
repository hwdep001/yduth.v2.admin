import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseData } from './../models/ResponseData';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

import { UserRole } from './../models/UserRole';

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

  async updateUsed(uid: string, used: boolean): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = {
      uid,
      used
    };

    await this.http.patch(`${this.apiServerUrl}/ad/user/used`, data, {
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

  async updateUserRole(uid: string, userRoleId: number): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const userRole = new UserRole();
    userRole.id = userRoleId;

    const data = {
      uid,
      userRole
    };

    await this.http.patch(`${this.apiServerUrl}/ad/user/role`, data, {
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

  async delete(uid: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.delete(`${this.apiServerUrl}/ad/user/${uid}`, {
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

  async getUserList(): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/ad/users`, {
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

  async getUser(uid: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/ad/user/${uid}`, {
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
