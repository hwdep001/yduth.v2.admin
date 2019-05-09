import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { UserMngService } from 'src/app/services/user-mng.service';

import { SubCatRule } from 'src/app/models/SubCatRule';
import { SubRule } from 'src/app/models/SubRule';
import { CatRule } from './../../models/CatRule';

@Component({
  selector: 'app-sub-rule',
  templateUrl: './sub-rule.page.html',
  styleUrls: ['./sub-rule.page.scss'],
})
export class SubRulePage implements OnInit {

  public pageInfo = environment.pageInfo;
  public uid: string;
  public subCatRule: SubCatRule;
  public allCheck: boolean;

  constructor(
    private router: ActivatedRoute,
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

    this.uid = this.router.snapshot.paramMap.get('uid');

    await this.getSubCatRules()
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  async getSubCatRules(): Promise<any> {
    return await this.userService.getSubCatRules(this.uid)
      .then(rd => {
        if (rd.res) {
          this.subCatRule = rd.data;
          this.setAllCheckToggle();
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  setAllCheckToggle(): void {
    let result = true;

    for (const sr of this.subCatRule.subRuleList) {
      if (!sr.subChecked) {
        result = false;
        break;
      } else {
        for (const cr of sr.catRuleList) {
          if (!cr.catChecked) {
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

    for (const sr of this.subCatRule.subRuleList) {
      sr.subChecked = checkVal;
      for (const cr of sr.catRuleList) {
        cr.catChecked = checkVal;
      }
    }
  }

  clickSubCheck(ev, sr: SubRule) {
    const checkVal = !ev.target.checked;

    for (const cr of sr.catRuleList) {
      cr.catChecked = checkVal;
    }

    sr.subChecked = checkVal;
    this.setAllCheckToggle();
    sr.subChecked = !checkVal;
  }

  clickCatCheck(ev, cr: CatRule) {
    const checkVal = !ev.target.checked;

    cr.catChecked = checkVal;
    this.setAllCheckToggle();
    cr.catChecked = !checkVal;
  }

  async updateSubCatRules() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const rd = await this.userService.updateSubCatRules(this.subCatRule);

    if (rd.res) {
      this.cmnService.presentSucToast('저장');
      await this.getSubCatRules()
        .then(() => loading.dismiss())
        .catch(() => loading.dismiss());
    } else {
      loading.dismiss();
      this.cmnService.presentErrToast(rd.toErrString());
    }
  }

}
