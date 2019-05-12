import { UserRole } from './UserRole';
import { Sub } from './Sub';

export class User {
    uid: string;
    email: string;
    googleDisplayName: string;
    googlePhotoUrl: string;
    nickname: string;
    photo: string;
    createDate: Date;
    updateDate: Date;
    used: boolean;

    userRole: UserRole;
    subList: Array<Sub>;
}
