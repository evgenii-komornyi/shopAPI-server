import { OrderCreateRequest } from '../../models/requests/order/OrderCreateRequest.ts';
import { DeliveryType } from '../../enums/DeliveryType.ts';
import { countryIndex } from '../../helpers/validation.helper.ts';
import { IValidatable } from '../IValidatable.ts';
import { OrderValidationErrors } from '../errors/OrderValidationErrors.ts';

const unicodeLetterPattern: string = '[\\p{L}\\p{M}]';
const allLettersAndUnicodeFormat: RegExp = new RegExp(
    `^${unicodeLetterPattern}+$`,
    'u'
);

export class CreateOrderRequestValidation
    implements IValidatable<OrderCreateRequest, OrderValidationErrors>
{
    public validate(request: OrderCreateRequest): OrderValidationErrors[] {
        const allErrors: OrderValidationErrors[] = [];

        allErrors.push(...this._validateEmail(request.$Email));
        allErrors.push(...this._validateFirstName(request.$FirstName));
        allErrors.push(...this._validateLastName(request.$LastName));
        allErrors.push(...this._validatePhoneNumber(request.$PhoneNumber));

        if (request.$DeliveryType === DeliveryType.COURIER) {
            allErrors.push(...this._validateCountry(request.$Country));
            allErrors.push(...this._validateCity(request.$City));
            allErrors.push(
                ...this._validatePostalCode(
                    request.$PostalCode,
                    request.$Country
                )
            );
            allErrors.push(...this._validateAddress(request.$Address));
        }

        return allErrors;
    }

    private _validateEmail(email: string): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (this._isNullOrEmpty(email)) {
            errorList.push(OrderValidationErrors.EMPTY_EMAIL);
        } else if (email.length < 3 || email.length > 100) {
            errorList.push(OrderValidationErrors.EMAIL_LENGTH_VIOLATION);
        } else if (!format.test(email)) {
            errorList.push(OrderValidationErrors.EMAIL_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateFirstName(firstName: string): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = allLettersAndUnicodeFormat;

        if (this._isNullOrEmpty(firstName)) {
            errorList.push(OrderValidationErrors.EMPTY_FIRST_NAME);
        } else if (firstName.length < 2 || firstName.length > 100) {
            errorList.push(OrderValidationErrors.FIRST_NAME_LENGTH_VIOLATION);
        } else if (!format.test(firstName)) {
            errorList.push(OrderValidationErrors.FIRST_NAME_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateLastName(lastName: string): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = allLettersAndUnicodeFormat;

        if (this._isNullOrEmpty(lastName)) {
            errorList.push(OrderValidationErrors.EMPTY_LAST_NAME);
        } else if (lastName.length < 2 || lastName.length > 100) {
            errorList.push(OrderValidationErrors.LAST_NAME_LENGTH_VIOLATION);
        } else if (!format.test(lastName)) {
            errorList.push(OrderValidationErrors.LAST_NAME_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validatePhoneNumber(phoneNumber: string): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = /^(?:\+|00)\d{8,15}$/;

        if (this._isNullOrEmpty(phoneNumber)) {
            errorList.push(OrderValidationErrors.EMPTY_PHONE_NUMBER);
        } else if (!format.test(phoneNumber)) {
            errorList.push(OrderValidationErrors.PHONE_NUMBER_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateCountry(
        country: string | null | undefined
    ): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = /\b(Latvia|Lithuania|Estonia)\b/;

        if (this._isNullOrEmpty(country)) {
            errorList.push(OrderValidationErrors.EMPTY_COUNTRY);
        } else if (country && !format.test(country)) {
            errorList.push(OrderValidationErrors.COUNTRY_DELIVERY_VIOLATION);
        }

        return errorList;
    }

    private _validateCity(
        city: string | null | undefined
    ): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = new RegExp(
            `^${unicodeLetterPattern}+(?:[\\s-]${unicodeLetterPattern}+)*$`,
            'u'
        );

        if (this._isNullOrEmpty(city)) {
            errorList.push(OrderValidationErrors.EMPTY_CITY);
        } else if (city && (city?.length < 4 || city?.length > 100)) {
            errorList.push(OrderValidationErrors.CITY_LENGTH_VIOLATION);
        } else if (city && !format.test(city)) {
            errorList.push(OrderValidationErrors.CITY_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validatePostalCode(
        postalCode: string | null | undefined,
        country: string | null | undefined
    ): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp[] = [/^LV-\d{4}$/, /^[0-9]{5}$/, /^LT-\d{5}$/];

        if (this._isNullOrEmpty(postalCode)) {
            errorList.push(OrderValidationErrors.EMPTY_POSTAL_CODE);
        } else if (
            postalCode &&
            country &&
            !format[countryIndex(country)].test(postalCode)
        ) {
            errorList.push(OrderValidationErrors.POSTAL_CODE_INCORRECT_FORMAT);
        }

        return errorList;
    }

    private _validateAddress(
        address: string | null | undefined
    ): OrderValidationErrors[] {
        const errorList: OrderValidationErrors[] = [];
        const format: RegExp = /^[\p{L}\p{N}.,\-:// ]+$/u;

        if (this._isNullOrEmpty(address)) {
            errorList.push(OrderValidationErrors.EMPTY_ADDRESS);
        } else if (address && address?.length > 100) {
            errorList.push(OrderValidationErrors.CITY_LENGTH_VIOLATION);
        } else if (address && !format.test(address)) {
            errorList.push(
                OrderValidationErrors.SPECIAL_CHARACTERS_NOT_ALLOWED
            );
        }

        return errorList;
    }

    private _isNullOrEmpty(value: string | null | undefined): boolean {
        return value == null || value.length == 0;
    }
}
