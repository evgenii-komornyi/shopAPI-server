import { AddressValidationErrors } from '../../validation/errors/AddressValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { AddressDetailsDTO } from './AddressDetailsDTO.ts';

export class AddressDTO extends BasicDTO<AddressValidationErrors> {
    private address: AddressDetailsDTO;

    public set $address(address: AddressDetailsDTO) {
        this.address = address;
    }
}
