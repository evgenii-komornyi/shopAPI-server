import { CreateClientRequestValidation } from './CreateClientRequestValidation.ts';

export class ClientValidation {
    private _CreateClientRequestValidation: CreateClientRequestValidation;

    constructor(createRequestValidation: CreateClientRequestValidation) {
        this._CreateClientRequestValidation = createRequestValidation;
    }

    public get $CreateClientRequestValidation(): CreateClientRequestValidation {
        return this._CreateClientRequestValidation;
    }
}
