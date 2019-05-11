import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { UserMngService } from 'src/app/services/user-mng.service';

import { Sub } from './../../models/Sub';
import { Cat } from './../../models/Cat';
import { SubCatRule, SubRule, CatRule } from 'src/app/models/SubCatRule';

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
          const subCatRule = rd.data as SubCatRule;

          const srMap = new Map<string, SubRule>();
          const crMap = new Map<string, CatRule>();
          subCatRule.subRuleList.forEach(subRule => {
            subRule.checked = true;
            srMap.set(subRule.sub.id, subRule);

            subRule.catRuleList.forEach(catRule => {
              catRule.checked = true;
              crMap.set(`${subRule.id}_${catRule.cat.id}`, catRule);
            });
          });

          for (const sub of subCatRule.subList) {
            let sr = srMap.get(sub.id);

            for (const cat of sub.catList) {
              let cr = new CatRule();
              if (sr != null) {
                cr = crMap.get(`${sr.id}_${cat.id}`);
                if (cr == null) {
                  cr = new CatRule();
                }
              }

              cat.catRule = cr;
            }

            if (sr == null) {
              sr = new SubRule();
            }
            sub.subRule = sr;
          }

          this.subCatRule = subCatRule;
          this.setAllCheckToggle();
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  setAllCheckToggle(): void {
    let result = true;

    for (const sub of this.subCatRule.subList) {
      if (!sub.subRule.checked) {
        result = false;
        break;
      } else {
        for (const cat of sub.catList) {
          if (!cat.catRule.checked) {
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

    for (const sub of this.subCatRule.subList) {
      sub.subRule.checked = checkVal;
      for (const cat of sub.catList) {
        cat.catRule.checked = checkVal;
      }
    }
  }

  clickSubCheck(ev, sub: Sub) {
    const checkVal = !ev.target.checked;

    for (const cat of sub.catList) {
      cat.catRule.checked = checkVal;
    }

    sub.subRule.checked = checkVal;
    this.setAllCheckToggle();
    sub.subRule.checked = !checkVal;
  }

  clickCatCheck(ev, cat: Cat) {
    const checkVal = !ev.target.checked;

    cat.catRule.checked = checkVal;
    this.setAllCheckToggle();
    cat.catRule.checked = !checkVal;
  }

  async updateSubCatRules() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const subRuleList = new Array<SubRule>();
    let catRuleList = null;
    for (const sub of this.subCatRule.subList) {
      if (!sub.subRule.checked) {
        continue;
      }

      catRuleList = new Array<CatRule>();
      for (const cat of sub.catList) {
        const tempCat = Object.assign({}, cat);  // 순환참조 방지
        tempCat.catRule = null;

        if (cat.catRule.checked) {
          cat.catRule.cat = tempCat;
          catRuleList.push(cat.catRule);
        }
      }

      const tempSub = Object.assign({}, sub);  // 순환참조 방지
      tempSub.catList = null;
      tempSub.subRule = null;
      sub.subRule.sub = tempSub;

      sub.subRule.uid = this.uid;
      sub.subRule.catRuleList = catRuleList;
      subRuleList.push(sub.subRule);
    }

    const scr = new SubCatRule();
    scr.subRuleList = subRuleList;
    scr.uid = this.uid;

    const rd = await this.userService.updateSubCatRules(scr);

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
