import { Sub } from './Sub';
import { Cat } from './Cat';

export class SubCatRule {
    uid: string;
    subList: Array<Sub>;
    subRuleList: Array<SubRule>;
}

export class SubRule {
    id: string;
    uid: string;
    sub: Sub;
    catRuleList: Array<CatRule>;

    //
    checked: boolean;
}

export class CatRule {
    subRule: SubRule;
    cat: Cat;

    //
    checked: boolean;
}
