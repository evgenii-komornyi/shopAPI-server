import { BasicResponse } from '../BasicResponse.ts';
import { UserValidationErrors } from '../../../validation/errors/UserValidationErrors.ts';
import { User } from '../../User.ts';

export class UserCreateResponse extends BasicResponse<UserValidationErrors> {
    private RegisteredUser: User;

    public set registeredUser(user: User) {
        this.RegisteredUser = user;
    }

    public get $RegisteredUser(): User {
        return this.RegisteredUser;
    }
}
