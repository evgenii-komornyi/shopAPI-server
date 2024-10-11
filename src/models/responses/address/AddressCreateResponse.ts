import { AddressValidationErrors } from '../../../validation/errors/AddressValidationErrors.ts';
import { Address } from '../../Address.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class AddressCreateResponse extends BasicResponse<AddressValidationErrors> {
    private CreatedAddress: Address;

    public set createdAddress(address: Address) {
        this.CreatedAddress = address;
    }

    public get $CreatedAddress(): Address {
        return this.CreatedAddress;
    }
}
