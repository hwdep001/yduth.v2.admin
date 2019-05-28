import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import { SubService } from 'src/app/services/sub.service';
import { CatService } from 'src/app/services/cat.service';

import { Sub } from 'src/app/models/Sub';

@Component({
  selector: 'app-user-cat',
  templateUrl: './user-cat.page.html',
  styleUrls: ['./user-cat.page.scss'],
})
export class UserCatPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public subList: Array<Sub>;

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private cmnService: CommonService,
    private subService: SubService,
    private catService: CatService
  ) {
  }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const uid: string = this.route.snapshot.params.uid;

    await this.getSubsWithCats(uid)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  private async getSubsWithCats(uid: string): Promise<any> {
    return await this.subService.getSubsWithCats(uid)
      .then(rd => {
        if (rd.res) {
          this.subList = rd.data as Array<Sub>;
        } else {
          alert(rd.toErrString());
        }
      }).catch(err => alert(err));
  }

  async presentDeleteCat(subId: string, catId: number, index: number): Promise<any> {
    const alert = await this.alertCtrl.create({
      message: '삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: '삭제',
          handler: async () => {
            this.deleteCat(subId, catId, index);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteCat(subId: string, catId: number, index: number) {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.catService.delete(catId)
      .then(rd => {
        if (rd.res) {
          for (const sub of this.subList) {
            if (sub.id === subId) {
              sub.type1CatList.splice(index, 1);
            }
          }
          loading.dismiss();
        } else {
          loading.dismiss();
          alert(rd.toErrString());
        }
      }).catch(err => {
        loading.dismiss();
        alert(err);
      });
  }

}
