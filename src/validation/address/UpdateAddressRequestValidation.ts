import { isNullOrEmpty } from '../../helpers/validation.helper.ts';
import { AddressUpdateRequest } from '../../models/requests/address/AddressUpdateRequest.ts';
import { AddressValidationErrors } from '../errors/AddressValidationErrors.ts';
import { IValidatable } from '../IValidatable.ts';

export class UpdateAddressRequestValidation
    implements IValidatable<AddressUpdateRequest, AddressValidationErrors>
{
    validate(request: AddressUpdateRequest): AddressValidationErrors[] {
        const allErrors: AddressValidationErrors[] = [];
        allErrors.push(...this._validateId(request.$Id));
        allErrors.push(...this._validateAddress(request.$Address));

        return allErrors;
    }

    private _validateAddress(
        address: string | null | undefined
    ): AddressValidationErrors[] {
        const errorList: AddressValidationErrors[] = [];
        const format: RegExp = /^[\p{L}\p{N}.,\-:// ]+$/u;

        if (isNullOrEmpty(address)) {
            errorList.push(AddressValidationErrors.EMPTY_ADDRESS);
        } else if (address.length > 100) {
            errorList.push(AddressValidationErrors.ADDRESS_LENGTH_VIOLATION);
        } else if (!format.test(address)) {
            errorList.push(
                AddressValidationErrors.SPECIAL_CHARACTERS_NOT_ALLOWED
            );
        }

        return errorList;
    }

    private _validateId(id: number): AddressValidationErrors[] {
        const errors: AddressValidationErrors[] = [];

        if (!id) {
            errors.push(AddressValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
    }
}
