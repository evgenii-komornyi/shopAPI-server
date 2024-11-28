import { Connection } from 'mysql2/promise';
import { AddressCreateRequest } from '../../models/requests/address/AddressCreateRequest.ts';
import { AddressCreateResponse } from '../../models/responses/address/AddressCreateResponse.ts';
import { Address } from '../../models/Address.ts';
import { AddressValidation } from '../../validation/address/AddressValidation.ts';
import { AddressUpdateRequest } from '../../models/requests/address/AddressUpdateRequest.ts';
import { AddressUpdateResponse } from '../../models/responses/address/AddressUpdateResponse.ts';

export interface IAddressService {
    linkAddressWithClient(
        request: AddressCreateRequest
    ): Promise<AddressCreateResponse>;
    linkAddressWithClientWithConnection(
        connection: Connection,
        address: Address
    ): Promise<Address>;
    updateAddress(
        request: AddressUpdateRequest
    ): Promise<AddressUpdateResponse>;
    get $Validation(): AddressValidation;
}
