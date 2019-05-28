import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

import { ResponseData } from 'src/app/models/ResponseData';

@Injectable({
  providedIn: 'root'
})
export class SubService {

  private apiServerUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  async getSubsWithCats(subId: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/ad/subs-cats/${subId}`, {
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
