import { CreateOrderRequestValidation } from './CreateOrderRequestValidation.ts';
import { FindOrderRequestValidation } from './FindOrderRequestValidation.ts';

export class OrderValidation {
    private _CreateOrderRequestValidation: CreateOrderRequestValidation;
    private _FindOrderRequestValidation: FindOrderRequestValidation;

    constructor(
        createRequestValidation: CreateOrderRequestValidation,
        findOrderRequestValidation: FindOrderRequestValidation
    ) {
        this._CreateOrderRequestValidation = createRequestValidation;
        this._FindOrderRequestValidation = findOrderRequestValidation;
    }

    public get $CreateOrderRequestValidation(): CreateOrderRequestValidation {
        return this._CreateOrderRequestValidation;
    }

    public get $FindOrderRequestValidation(): FindOrderRequestValidation {
        return this._FindOrderRequestValidation;
    }
}
