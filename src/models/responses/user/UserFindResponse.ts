import { UserValidationErrors } from '../../../validation/errors/UserValidationErrors.ts';
import { User } from '../../User.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class UserFindResponse extends BasicResponse<UserValidationErrors> {
    private FoundUser: User;

    public set foundUser(foundUser: User) {
        this.FoundUser = foundUser;
    }

    public get $FoundUser(): User {
        return this.FoundUser;
    }
}
