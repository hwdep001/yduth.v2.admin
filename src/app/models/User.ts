import { UserRole } from './UserRole';

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
}
