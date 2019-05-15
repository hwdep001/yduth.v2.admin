import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { UserMngService } from 'src/app/services/user-mng.service';

import { SubRule } from './../../models/SubRule';
import { CatRule } from 'src/app/models/CatRule';

@Component({
  selector: 'app-sub-rule',
  templateUrl: './sub-rule.page.html',
  styleUrls: ['./sub-rule.page.scss'],
})
export class SubRulePage implements OnInit {

  public pageInfo = environment.pageInfo;
  public uid: string;
  public subRuleList: Array<SubRule>;
  public allCheck: boolean;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private userService: UserMngService
  ) {
  }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.uid = this.route.snapshot.params.uid;

    await this.getSubCatRules()
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  async getSubCatRules(): Promise<any> {
    return await this.userService.getSubCatRules(this.uid)
      .then(rd => {
        if (rd.res) {
          this.subRuleList = rd.data as Array<SubRule>;
          this.setAllCheckToggle();
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  setAllCheckToggle(): void {
    let result = true;

    for (const sr of this.subRuleList) {
      if (!sr.checked) {
        result = false;
        break;
      } else {
        for (const cr of sr.catRuleList) {
          if (!cr.checked) {
            result = false;
            break;
          }
        }
      }
    }

    this.allCheck = result;
  }

  clickAllCheck(ev) {
    const checkVal = !ev.target.checked;

    for (const sr of this.subRuleList) {
      sr.checked = checkVal;
      for (const cr of sr.catRuleList) {
        cr.checked = checkVal;
      }
    }
  }

  clickSubCheck(ev, sr: SubRule) {
    const checkVal = !ev.target.checked;

    for (const cr of sr.catRuleList) {
      cr.checked = checkVal;
    }

    sr.checked = checkVal;
    this.setAllCheckToggle();
    sr.checked = !checkVal;
  }

  clickCatCheck(ev, cr: CatRule) {
    const checkVal = !ev.target.checked;

    cr.checked = checkVal;
    this.setAllCheckToggle();
    cr.checked = !checkVal;
  }

  async updateSubCatRules() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    for (const sr of this.subRuleList) {
      sr.uid = this.uid;

      for (const cr of sr.catRuleList) {
        cr.uid = this.uid;
      }
    }

    const rd = await this.userService.updateSubCatRules(this.subRuleList);

    if (rd.res) {
      this.cmnService.presentSucToast('저장');
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    await this.getSubCatRules()
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());
  }

}
