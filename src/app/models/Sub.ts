import { Cat } from './Cat';
import { SubRule } from './SubCatRule';

export class Sub {
    id: string;
    name: string;
    num: number;

    catList: Array<Cat>;
    subRule: SubRule;
}
