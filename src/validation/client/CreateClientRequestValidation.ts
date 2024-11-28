import { isNullOrEmpty, sanitize } from '../../helpers/validation.helper.ts';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { ClientValidationErrors } from '../errors/ClientValidationErrors.ts';

const unicodeLetterPattern: string = '[\\p{L}\\p{M}]';
const allLettersAndUnicodeFormat: RegExp = new RegExp(
    `^${unicodeLetterPattern}+$`,
    'u'
);

export class CreateClientRequestValidation
    implements IValidatable<ClientCreateRequest, ClientValidationErrors>
{
    public validate(request: ClientCreateRequest): ClientValidationErrors[] {
        const allErrors: ClientValidationErrors[] = [];

        allErrors.push(...this._validateEmail(sanitize(request.$Email)));
        allErrors.push(
            ...this._validateFirstName(sanitize(request.$FirstName))
        );
        allErrors.push(...this._validateLastName(sanitize(request.$LastName)));
        allErrors.push(
            ...this._validatePhoneNumber(sanitize(request.$PhoneNumber))
        );

        return allErrors;
    }

    private _validateEmail(email: string): ClientValidationErrors[] {
        const errorList: ClientValidationErrors[] = [];
        const format: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (isNullOrEmpty(email)) {
            errorList.push(ClientValidationErrors.EMPTY_EMAIL);
        } else if (email.length < 3 || email.length > 100) {
            errorList.push(ClientValidationErrors.EMAIL_LENGTH_VIOLATION);
        } else if (!format.test(email)) {
            errorList.push(ClientValidationErrors.EMAIL_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateFirstName(firstName: string): ClientValidationErrors[] {
        const errorList: ClientValidationErrors[] = [];
        const format: RegExp = allLettersAndUnicodeFormat;

        if (isNullOrEmpty(firstName)) {
            errorList.push(ClientValidationErrors.EMPTY_FIRST_NAME);
        } else if (firstName.length < 2 || firstName.length > 100) {
            errorList.push(ClientValidationErrors.FIRST_NAME_LENGTH_VIOLATION);
        } else if (!format.test(firstName)) {
            errorList.push(ClientValidationErrors.FIRST_NAME_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateLastName(lastName: string): ClientValidationErrors[] {
        const errorList: ClientValidationErrors[] = [];
        const format: RegExp = allLettersAndUnicodeFormat;

        if (isNullOrEmpty(lastName)) {
            errorList.push(ClientValidationErrors.EMPTY_LAST_NAME);
        } else if (lastName.length < 2 || lastName.length > 100) {
            errorList.push(ClientValidationErrors.LAST_NAME_LENGTH_VIOLATION);
        } else if (!format.test(lastName)) {
            errorList.push(ClientValidationErrors.LAST_NAME_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validatePhoneNumber(
        phoneNumber: string
    ): ClientValidationErrors[] {
        const errorList: ClientValidationErrors[] = [];
        const format: RegExp = /^(?:\+|00)\d{8,15}$/;

        if (isNullOrEmpty(phoneNumber)) {
            errorList.push(ClientValidationErrors.EMPTY_PHONE_NUMBER);
        } else if (!format.test(phoneNumber)) {
            errorList.push(
                ClientValidationErrors.PHONE_NUMBER_INCORRECT_FORMAT
            );
        }

        return errorList;
    }
}
