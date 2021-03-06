import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras } from '@angular/router';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthService } from './../services/auth.service';

import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isSubscription = false;
  private unsubscribe: firebase.Unsubscribe;
  private pageInfo = environment.pageInfo;

  constructor(
    private router: Router,
    private events: Events,
    private zone: NgZone,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (environment.testType === 0) {
      return this.canActivateForApp(next, state);
    } else if (environment.testType === 1) {
      return this.canActivateForDevApp(next, state);   // for dev app
    } else {
      return this.canActivateWithoutGuard(next, state);   // without guard
    }
  }

  canActivateForApp(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return  new Promise((resolve, reject) => {

      if (this.isSubscription) {
        this.unsubscribe();
        this.isSubscription = false;
      }

      this.unsubscribe = this.authService.getFireAuth().onAuthStateChanged(async (fireUser: firebase.User) => {
        // console.log('[auth guard] onAuthStateChanged: ' + fireUser);
        this.isSubscription = true;

        /**
         * user가 null인데 firebase가 로그인 상태이면 로그인 처리
         */
        if (fireUser != null && this.authService.user == null) {
          await this.authService.updateSignInInfo();
          this.events.publish('token-reg', fireUser); // fcm token 이벤트 실행
        }
        const user: User = this.authService.user;

        /**
         * 로그인 했을 경우 /sign-in 접근 시 home으로 이동
         * 로그인 안했을 경우 /sign-in 페이지만 허용
         */
        if (user) {
          // 조건1
          if (state.url === this.pageInfo.signIn.url) {
            // console.log(`[auth guard1] ${state.url} - false -> home`);
            // alert(`[auth guard1] ${state.url} - false -> home`);
            await this.zone.run(() => {
              this.router.navigate([this.pageInfo.home.url], {skipLocationChange: true, replaceUrl: true});
            });
            resolve(false);
          } else {
          // 조건 2
            // console.log(`[auth guard2] ${state.url} - true`);
            // alert(`[auth guard2] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          }
        } else {
          // 조건 3
          if (state.url === this.pageInfo.signIn.url) {
            // console.log(`[auth guard3] ${state.url} - true`);
            // alert(`[auth guard3] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          } else {
          // 조건 4
            // console.log(`[auth guard4] ${state.url} - false -> sign-in`);
            // alert(`[auth guard4] ${state.url} - false -> sign-in`);
            state.url = this.pageInfo.signIn.url;   // 로그인 화면에서 뒤로가기 방지용
            await this.zone.run(() => {
              this.router.navigate([this.pageInfo.signIn.url], {skipLocationChange: true, replaceUrl: true});
            });
            resolve(false);
          }
        }
      });
    });
  }

  canActivateForDevApp(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return  new Promise(async (resolve, reject) => {

      await this.authService.updateSignInInfo();
      const user: User = this.authService.user;

      const navigationExtras: NavigationExtras = {
        skipLocationChange: true, replaceUrl: true
      };

      /**
       * 로그인 했을 경우 /sign-in 접근 시 home으로 이동
       * 로그인 안했을 경우 /sign-in 페이지만 허용
       */
      if (user) {
        // 조건1
        if (state.url === this.pageInfo.signIn.url) {
          // console.log(`[auth guard1] ${state.url} - false -> home`);
          // alert(`[auth guard1] ${state.url} - false -> home`);
          this.router.navigate([this.pageInfo.home.url], navigationExtras);
          resolve(false);
        } else {
        // 조건 2
          // console.log(`[auth guard2] ${state.url} - true`);
          // alert(`[auth guard2] ${state.url} - true`);
          this.events.publish('menu-setting', user);
          resolve(true);
        }
      } else {
        // 조건 3
        if (state.url === this.pageInfo.signIn.url) {
          // console.log(`[auth guard3] ${state.url} - true`);
          // alert(`[auth guard3] ${state.url} - true`);
          this.events.publish('menu-setting', user);
          resolve(true);
        } else {
        // 조건 4
          // console.log(`[auth guard4] ${state.url} - false -> sign-in`);
          // alert(`[auth guard4] ${state.url} - false -> sign-in`);
          state.url = this.pageInfo.signIn.url;   // 로그인 화면에서 뒤로가기 방지용
          this.router.navigate([this.pageInfo.signIn.url], navigationExtras);
          resolve(false);
        }
      }
    });
  }

  canActivateWithoutGuard(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return  new Promise(async (resolve, reject) => {
      const user: User = environment.testUser as User;

      this.events.publish('menu-setting', user);
      resolve(true);
    });
  }
}
