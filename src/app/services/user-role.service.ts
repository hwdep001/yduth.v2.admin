import { ResponseData } from 'src/app/models/ResponseData';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private apiServerUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  async getUserRoleList(): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/ad/user-roles`, {
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
