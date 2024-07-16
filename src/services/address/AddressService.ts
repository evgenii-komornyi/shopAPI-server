import { Connection } from 'mysql2/promise';
import { Address } from '../../models/Address.ts';
import { AddressCreateRequest } from '../../models/requests/address/AddressCreateRequest.ts';
import { AddressCreateResponse } from '../../models/responses/address/AddressCreateResponse.ts';
import { AddressValidation } from '../../validation/address/AddressValidation.ts';
import { IAddressService } from './IAddressService.ts';
import { IAddressRepository } from '../../repositories/address/IAddressRepository.ts';

export class AddressService implements IAddressService {
    private readonly _repository: IAddressRepository;
    private readonly _validation: AddressValidation;

    constructor(repository: IAddressRepository, validation: AddressValidation) {
        this._repository = repository;
        this._validation = validation;
    }

    public linkAddressWithClient(
        request: AddressCreateRequest
    ): Promise<AddressCreateResponse> {
        throw new Error('Method not implemented.');
    }

    public async linkAddressWithClientWithConnection(
        connection: Connection,
        address: Address
    ): Promise<Address> {
        try {
            return await this._repository.createAddressWithConnection(
                connection,
                address
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public get $Validation(): AddressValidation {
        return this._validation;
    }
}
