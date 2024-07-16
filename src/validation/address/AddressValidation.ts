import { CreateAddressRequestValidation } from './CreateAddressRequestValidation.ts';

export class AddressValidation {
    private _CreateAddressRequestValidation: CreateAddressRequestValidation;

    constructor(createRequestValidation: CreateAddressRequestValidation) {
        this._CreateAddressRequestValidation = createRequestValidation;
    }

    public get $CreateAddressRequestValidation(): CreateAddressRequestValidation {
        return this._CreateAddressRequestValidation;
    }
}
