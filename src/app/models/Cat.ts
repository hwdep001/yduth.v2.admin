import { Sub } from './Sub';
import { CatRule } from './SubCatRule';

export class Cat {
    id: string;
    name: string;
    version: string;
    createDate: Date;
    updateDate: Date;
    num: number;

    sub: Sub;
    catRule: CatRule;
}
