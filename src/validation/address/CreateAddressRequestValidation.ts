import {
    countryIndex,
    isNullOrEmpty,
} from '../../helpers/validation.helper.ts';
import { AddressCreateRequest } from '../../models/requests/address/AddressCreateRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { AddressValidationErrors } from '../errors/AddressValidationErrors.ts';

const unicodeLetterPattern: string = '[\\p{L}\\p{M}]';

export class CreateAddressRequestValidation
    implements IValidatable<AddressCreateRequest, AddressValidationErrors>
{
    public validate(request: AddressCreateRequest): AddressValidationErrors[] {
        const allErrors: AddressValidationErrors[] = [];

        allErrors.push(...this._validateCountry(request.$Country));
        allErrors.push(...this._validateCity(request.$City));
        allErrors.push(
            ...this._validatePostalCode(request.$PostalCode, request.$Country)
        );
        allErrors.push(...this._validateAddress(request.$Address));

        return allErrors;
    }

    private _validateCountry(
        country: string | null | undefined
    ): AddressValidationErrors[] {
        const errorList: AddressValidationErrors[] = [];
        const format: RegExp = /\b(Latvia|Lithuania|Estonia)\b/;

        if (isNullOrEmpty(country)) {
            errorList.push(AddressValidationErrors.EMPTY_COUNTRY);
        } else if (country && !format.test(country)) {
            errorList.push(AddressValidationErrors.COUNTRY_DELIVERY_VIOLATION);
        }

        return errorList;
    }

    private _validateCity(
        city: string | null | undefined
    ): AddressValidationErrors[] {
        const errorList: AddressValidationErrors[] = [];
        const format: RegExp = new RegExp(
            `^${unicodeLetterPattern}+(?:[\\s-]${unicodeLetterPattern}+)*$`,
            'u'
        );

        if (isNullOrEmpty(city)) {
            errorList.push(AddressValidationErrors.EMPTY_CITY);
        } else if (city && (city?.length < 4 || city?.length > 100)) {
            errorList.push(AddressValidationErrors.CITY_LENGTH_VIOLATION);
        } else if (city && !format.test(city)) {
            errorList.push(AddressValidationErrors.CITY_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validatePostalCode(
        postalCode: string | null | undefined,
        country: string | null | undefined
    ): AddressValidationErrors[] {
        const errorList: AddressValidationErrors[] = [];
        const format: RegExp[] = [/^LV-\d{4}$/, /^[0-9]{5}$/, /^LT-\d{5}$/];

        const countryByName: number = country ? countryIndex(country) : -1;
        if (isNullOrEmpty(postalCode)) {
            errorList.push(AddressValidationErrors.EMPTY_POSTAL_CODE);
        } else if (
            postalCode &&
            country &&
            countryByName !== -1 &&
            !format[countryByName].test(postalCode)
        ) {
            errorList.push(
                AddressValidationErrors.POSTAL_CODE_INCORRECT_FORMAT
            );
        }

        return errorList;
    }

    private _validateAddress(
        address: string | null | undefined
    ): AddressValidationErrors[] {
        const errorList: AddressValidationErrors[] = [];
        const format: RegExp = /^[\p{L}\p{N}.,\-:// ]+$/u;

        if (isNullOrEmpty(address)) {
            errorList.push(AddressValidationErrors.EMPTY_ADDRESS);
        } else if (address && address?.length > 100) {
            errorList.push(AddressValidationErrors.ADDRESS_LENGTH_VIOLATION);
        } else if (address && !format.test(address)) {
            errorList.push(
                AddressValidationErrors.SPECIAL_CHARACTERS_NOT_ALLOWED
            );
        }

        return errorList;
    }
}
