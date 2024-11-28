import { User } from '../../models/User.ts';
import { IValidatable } from '../IValidatable.ts';
import { UserValidationErrors } from '../errors/UserValidationErrors.ts';

export class FindUserValidation
    implements IValidatable<User, UserValidationErrors>
{
    public validate(user: User): UserValidationErrors[] {
        const allErrors: UserValidationErrors[] = [];

        allErrors.push(...this._validateUser(user));

        return allErrors;
    }

    private _validateUser(user: User) {
        const errorList: UserValidationErrors[] = [];

        if (!user) {
            errorList.push(UserValidationErrors.USER_DOES_NOT_EXISTS);
        }

        return errorList;
    }
}
