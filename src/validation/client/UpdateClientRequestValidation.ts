import { isNullOrEmpty } from '../../helpers/validation.helper.ts';
import { ClientUpdateRequest } from '../../models/requests/client/ClientUpdateRequest.ts';
import { ClientValidationErrors } from '../errors/ClientValidationErrors.ts';
import { IValidatable } from '../IValidatable.ts';

const unicodeLetterPattern: string = '[\\p{L}\\p{M}]';
const allLettersAndUnicodeFormat: RegExp = new RegExp(
    `^${unicodeLetterPattern}+$`,
    'u'
);

export class UpdateClientRequestValidation
    implements IValidatable<ClientUpdateRequest, ClientValidationErrors>
{
    validate(request: ClientUpdateRequest): ClientValidationErrors[] {
        const allErrors: ClientValidationErrors[] = [];
        allErrors.push(...this._validateId(request.$Id));
        allErrors.push(...this._validateFirstName(request.$FirstName));
        allErrors.push(...this._validateLastName(request.$LastName));
        allErrors.push(...this._validatePhoneNumber(request.$PhoneNumber));

        return allErrors;
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

    private _validateId(id: number): ClientValidationErrors[] {
        const errors: ClientValidationErrors[] = [];

        if (!id) {
            errors.push(ClientValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
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
