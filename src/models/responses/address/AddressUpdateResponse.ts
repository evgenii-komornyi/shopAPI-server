import { AddressValidationErrors } from '../../../validation/errors/AddressValidationErrors.ts';
import { Address } from '../../Address.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class AddressUpdateResponse extends BasicResponse<AddressValidationErrors> {
    private UpdatedAddress: Address;

    public set updatedAddress(address: Address) {
        this.UpdatedAddress = address;
    }

    public get $UpdatedAddress(): Address {
        return this.UpdatedAddress;
    }
}
