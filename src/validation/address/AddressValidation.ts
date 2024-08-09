import { CreateAddressRequestValidation } from './CreateAddressRequestValidation.ts';
import { UpdateAddressRequestValidation } from './UpdateAddressRequestValidation.ts';

export class AddressValidation {
    private _CreateAddressRequestValidation: CreateAddressRequestValidation;
    private _UpdateAddressRequestValidation: UpdateAddressRequestValidation;

    constructor(
        createRequestValidation: CreateAddressRequestValidation,
        updateRequestValidation: UpdateAddressRequestValidation
    ) {
        this._CreateAddressRequestValidation = createRequestValidation;
        this._UpdateAddressRequestValidation = updateRequestValidation;
    }

    public get $CreateAddressRequestValidation(): CreateAddressRequestValidation {
        return this._CreateAddressRequestValidation;
    }

    public get $UpdateAddressRequestValidation(): UpdateAddressRequestValidation {
        return this._UpdateAddressRequestValidation;
    }
}
