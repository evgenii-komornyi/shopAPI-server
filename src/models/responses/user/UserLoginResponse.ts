import { User } from '../../User.ts';
import { TokenizedResponse } from '../TokenizedResponse.ts';

export class UserLoginResponse extends TokenizedResponse {
    private LoggedInUser: User;

    public set loggedInUser(user: User) {
        this.LoggedInUser = user;
    }

    public get $LoggedInUser(): User {
        return this.LoggedInUser;
    }
}
