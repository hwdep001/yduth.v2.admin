import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from 'src/environments/environment';

import { CommonService } from './../../services/common.service';
import { UserMngService } from './../../services/user-mng.service';

import { User } from './../../models/User';
import { IonSearchbar, AlertController } from '@ionic/angular';
import { ResponseData } from 'src/app/models/ResponseData';

@Component({
  selector: 'app-user-mng',
  templateUrl: './user-mng.page.html',
  styleUrls: ['./user-mng.page.scss'],
})
export class UserMngPage implements OnInit {

  @ViewChild('searchbar') searchbar: IonSearchbar;
  public pageInfo = environment.pageInfo;

  public userList: Array<User>;
  public loadedUserList: Array<User>;
  public searchClicked = false;

  constructor(
    private alertCtrl: AlertController,
    private cmnService: CommonService,
    private userService: UserMngService
  ) { }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.searchClicked = false;
    await this.getUserList()
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());
  }

  async getUserList(): Promise<any> {
    return await this.userService.getUserList()
      .then(rd => {
        if (rd.res) {
          this.loadedUserList = rd.data;
          this.initializeUsers();
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  initializeUsers(): void {
    this.userList = this.loadedUserList;
  }

  clickSearchbar() {
    this.searchClicked = true;
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 600);
  }

  cancelSearchbar(event) {
    this.searchClicked = false;
    this.initializeUsers();
  }

  search(ev: any): void {
    // Reset items back to all of the items
    this.initializeUsers();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
        this.userList = this.userList.filter((item) => {
            return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1
                || item.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
    }
  }

  delete(uid: string): void {
    this.getDeleteAlert(() => {
      this.userService.delete(uid).then((rd: ResponseData) => {
        if (rd.res) {
          this.cmnService.presentSucToast('삭제 성공');
          this.initData();
        } else {
          this.cmnService.presentErrToast(rd.toErrString());
        }
      });
    });
  }

  private async getDeleteAlert(deleteHandler: any) {
    const alert = await this.alertCtrl.create({
      header: '회원 삭제',
      message: '삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        }, {
          text: '삭제',
          handler: () => {
            deleteHandler();
          }
        }
      ]
    });

    return await alert.present();
  }

}
