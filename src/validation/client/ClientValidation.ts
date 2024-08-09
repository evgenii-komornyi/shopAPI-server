import { CreateClientRequestValidation } from './CreateClientRequestValidation.ts';
import { UpdateClientRequestValidation } from './UpdateClientRequestValidation.ts';

export class ClientValidation {
    private _CreateClientRequestValidation: CreateClientRequestValidation;
    private _UpdateClientRequestValidation: UpdateClientRequestValidation;

    constructor(
        createRequestValidation: CreateClientRequestValidation,
        updateRequestValidation: UpdateClientRequestValidation
    ) {
        this._CreateClientRequestValidation = createRequestValidation;
        this._UpdateClientRequestValidation = updateRequestValidation;
    }

    public get $CreateClientRequestValidation(): CreateClientRequestValidation {
        return this._CreateClientRequestValidation;
    }

    public get $UpdateClientRequestValidation(): UpdateClientRequestValidation {
        return this._UpdateClientRequestValidation;
    }
}
