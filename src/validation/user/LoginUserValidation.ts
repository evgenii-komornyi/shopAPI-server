import { User } from '../../models/User.ts';
import { IValidatable } from '../IValidatable.ts';
import { UserValidationErrors } from '../errors/UserValidationErrors.ts';
import bcrypt from 'bcrypt';

export class LoginUserValidation
    implements IValidatable<User, UserValidationErrors>
{
    public validate(
        user: User,
        passwordRequest?: string
    ): UserValidationErrors[] {
        const allErrors: UserValidationErrors[] = [];

        allErrors.push(...this._validateUser(user));

        if (user) {
            allErrors.push(
                ...this._validatePassword(passwordRequest, user.$Password)
            );
        }

        return allErrors;
    }

    private _validateUser(user: User) {
        const errorList: UserValidationErrors[] = [];

        if (!user) {
            errorList.push(UserValidationErrors.USER_DOES_NOT_EXISTS);
        }

        return errorList;
    }

    private _validatePassword(
        passwordRequest: string,
        passwordToCompare: string
    ) {
        const errorList: UserValidationErrors[] = [];

        if (!bcrypt.compareSync(passwordRequest, passwordToCompare)) {
            errorList.push(UserValidationErrors.USER_DOES_NOT_EXISTS);
        }

        return errorList;
    }
}
