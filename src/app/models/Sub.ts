import { Cat } from './Cat';
import { ExamType } from './ExamType';

export class Sub {
    id: string;
    name: string;
    num: number;

    examTypeList: Array<ExamType>;
    type0CatList: Array<Cat>;
    type1CatList: Array<Cat>;
}
