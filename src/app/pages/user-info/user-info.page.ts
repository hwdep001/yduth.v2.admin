import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import { CommonService } from './../../services/common.service';
import { UserService } from './../../services/user.service';
import { UserRoleService } from './../../services/user-role.service';

import { User } from 'src/app/models/User';
import { UserRole } from './../../models/UserRole';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public user: User;

  constructor(
    private router: ActivatedRoute,
    private alertCtrl: AlertController,
    private cmnService: CommonService,
    private userService: UserService,
    private urService: UserRoleService
  ) {
  }

  async ngOnInit() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const uid: string = this.router.snapshot.paramMap.get('uid');

    await this.getUser(uid)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  async getUser(uid: string): Promise<any> {
    return await this.userService.getUser(uid)
      .then(rd => {
        if (rd.res) {
          this.user = rd.data;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  async updateUsed() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const rd = await this.userService.updateUsed(this.user.uid, this.user.used);

    if (rd.res) {
      loading.dismiss();
      this.cmnService.presentSucToast('저장');
    } else {
      this.user.used = !this.user.used;
      loading.dismiss();
      this.cmnService.presentErrToast(rd.toErrString());
    }

    loading.dismiss();
  }

  async updateUserRole(userRole: UserRole) {
    const loading = await this.cmnService.getLoading();
    loading.present();
    const rd = await this.userService.updateUserRole(this.user.uid, userRole.id);

    if (rd.res) {
      this.user.userRole = userRole;
      loading.dismiss();
      this.cmnService.presentSucToast('저장');
    } else {
      loading.dismiss();
      this.cmnService.presentErrToast(rd.toErrString());
    }
  }

  async getUserRoleList(): Promise<Array<UserRole>> {
    let result = new Array<UserRole>();
    const rd = await this.urService.getUserRoleList();

    if (rd.res) {
      result = rd.data;
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    return result;
  }

  async presentRoleAlert() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const inputs = [];
    const userRoleList = await this.getUserRoleList();

    userRoleList.forEach((ur: UserRole) => {
      inputs.push({
        name: ur.name,
        type: 'radio',
        label: ur.name,
        value: ur,
        checked: this.user.userRole.id === ur.id
      });
    });

    loading.dismiss();

    const alert = await this.alertCtrl.create({
      header: 'Radio',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Save',
          handler: (data: UserRole) => {
            this.updateUserRole(data);
          }
        }
      ]
    });

    await alert.present();
  }

}
