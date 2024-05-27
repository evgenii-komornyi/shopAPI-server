import { CreateRequestValidation } from './CreateOrderRequestValidation';

export class OrderValidation {
    private _CreateRequestValidation: CreateRequestValidation;

    constructor(createRequestValidation: CreateRequestValidation) {
        this._CreateRequestValidation = createRequestValidation;
    }

    public get $CreateRequestValidation(): CreateRequestValidation {
        return this._CreateRequestValidation;
    }
}
