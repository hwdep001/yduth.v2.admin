import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Component, ViewChild } from '@angular/core';

import { Platform, Events, IonRouterOutlet, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { environment } from 'src/environments/environment';

// services
import { CommonService } from './services/common.service';
import { FcmService } from './services/fcm.service';

// models
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExitAlert = 1000;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  private pageInfo = environment.pageInfo;
  public menuDisabled = true;
  public menus = new Array<MenuInterface>();
  private pagesMap: Map<string, PageInterface>;

  public user: User;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private router: Router,
    private alertCtrl: AlertController,
    private menu: MenuController,
    private fcmService: FcmService,
    private cmnService: CommonService
  ) {
    this.initializePages();
    this.initializeApp();
  }

  initializePages(): void {
    const pagesMap = new Map<string, PageInterface>();
    pagesMap.set('home', { title: '홈', url: this.pageInfo.home.url, icon: 'home' });
    pagesMap.set('user-mng', { title: '사용자 관리', url: this.pageInfo.userMng.url, icon: 'people' });
    pagesMap.set('profile', { title: '프로필', url: this.pageInfo.profile.url, icon: 'person' });
    pagesMap.set('temp', { title: 'temp', url: this.pageInfo.temp.url, icon: 'settings' });
    this.pagesMap = pagesMap;
  }

  async initializeApp(): Promise<any> {
    this.subscribeMenuSetting();

    await this.platform.ready().then(() => {

      // alert('platform: ' + this.platform.platforms().toString());
      console.log('platform: ' + this.platform.platforms().toString());

      if (this.platform.is('cordova')) {
        this.statusBar.styleLightContent();
        this.subscribeNotification();   // fcm 구독
        this.subscribeTokenReg();       // fcm token 등록 이벤트 구독
      }

      this.subscribeBackButton();       // 백버튼 이벤트 구독
      this.subscribeActiveMenu();       // 메뉴 세팅 이벤트 구독
    });
  }

  subscribeActiveMenu(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.pagesMap.forEach( (p, key) => {
          const activeUrl = '/' + event.url.split('/')[1];
          return p['active'.toString()] = (activeUrl === p.url || event.url === '/' && p.url === '/home');
        });
      }
    });
  }

  subscribeMenuSetting(): void {
    this.events.subscribe('menu-setting', (user: User) => {
      this.setMenus(user);
      this.hideSplashScreen();
    });
  }

  hideSplashScreen(): void {
    if (this.platform.is('cordova')) {
      this.splashScreen.hide();
    }
  }

  setMenus(user: User): void {
    this.user = user;

    if (user == null && this.menuDisabled === false) {
      this.menus = [];
      this.menuDisabled = true;

    } else if (user != null && this.menuDisabled === true) {
      const menus = new Array<MenuInterface>();

      let pages = new Array<PageInterface>();
      pages.push(this.pagesMap.get('home'));
      pages.push(this.pagesMap.get('user-mng'));
      menus.push({ title: '메뉴', pages});

      pages = [];
      pages.push(this.pagesMap.get('profile'));
      pages.push(this.pagesMap.get('temp'));
      menus.push({ title: '설정', pages});

      this.menus = menus;
      this.menuDisabled = false;
    }
  }

  subscribeNotification() {
    this.fcmService.subscribeToTopic('sign-up');
    this.fcmService.onNotification().subscribe(data => {

      if (data.wasTapped) {
        // console.log('Received in background');
      } else {
        // console.log('Received in foreground');
        this.cmnService.presentNotiToast(data.title, data.body);
      }
    });
  }

  subscribeTokenReg() {
    this.events.subscribe('token-reg', (fireUser: firebase.User) => {
      this.fcmService.getToken(fireUser);
    });
  }

  subscribeBackButton(): void {
    this.platform.backButton.subscribeWithPriority(0, async () => {

      // close side menu
      try {
        const element = await this.menu.getOpen();
        if (element) {
          this.menu.close();
          return;
        }
      } catch (err) {
        console.log(err);
      }

      // close modal
      // try {
      //   const element = await this.modalCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      // close action sheet
      // try {
      //   const element = await this.actionSheetCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      // close popover
      // try {
      //   const element = await this.popoverCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      if (this.router.url === '/sign-in') {
        navigator['app'.toString()].exitApp();
      } else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExitAlert) {
          this.presentExitAlert();
        } else {
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }

  async presentExitAlert(): Promise<any> {
    const alert = await this.alertCtrl.create({
      header: 'EXIT',
      message: 'Are you sure you want to <strong>exit</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Exit',
          handler: () => {
            navigator['app'.toString()].exitApp();
          }
        }
      ]
    });

    return await alert.present();
  }

}
