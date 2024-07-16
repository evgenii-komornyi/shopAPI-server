import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { UserValidationErrors } from '../errors/UserValidationErrors.ts';
import {
    countryIndex,
    isNullOrEmpty,
} from '../../helpers/validation.helper.ts';

const unicodeLetterPattern: string = '[\\p{L}\\p{M}]';
const allLettersAndUnicodeFormat: RegExp = new RegExp(
    `^${unicodeLetterPattern}+$`,
    'u'
);

export class CreateUserRequestValidation
    implements IValidatable<UserCreateRequest, UserValidationErrors>
{
    public validate(request: UserCreateRequest): UserValidationErrors[] {
        const allErrors: UserValidationErrors[] = [];

        allErrors.push(...this._validateEmail(request.$Email));
        allErrors.push(...this._validatePassword(request.$Password));

        return allErrors;
    }

    private _validateEmail(email: string): UserValidationErrors[] {
        const errorList: UserValidationErrors[] = [];
        const format: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (isNullOrEmpty(email)) {
            errorList.push(UserValidationErrors.EMPTY_EMAIL);
        } else if (email.length < 3 || email.length > 100) {
            errorList.push(UserValidationErrors.EMAIL_LENGTH_VIOLATION);
        } else if (!format.test(email)) {
            errorList.push(UserValidationErrors.EMAIL_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validatePassword(password: string): UserValidationErrors[] {
        const errorList: UserValidationErrors[] = [];
        const format: RegExp =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:,.?]).{8,100}$/;

        if (isNullOrEmpty(password)) {
            errorList.push(UserValidationErrors.EMPTY_PASSWORD);
        } else if (password.length < 8 || password.length > 100) {
            errorList.push(UserValidationErrors.PASSWORD_LENGTH_VIOLATION);
        } else if (!format.test(password)) {
            errorList.push(UserValidationErrors.PASSWORD_INCORRECT_FORMAT);
        }

        return errorList;
    }
}
