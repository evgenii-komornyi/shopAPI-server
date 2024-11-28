import { CreateOrderRequestValidation } from './CreateOrderRequestValidation.ts';
import { FindOrderRequestValidation } from './FindOrderRequestValidation.ts';
import { UpdateOrderRequestValidation } from './UpdateOrderRequestValidation.ts';

export class OrderValidation {
    private _CreateOrderRequestValidation: CreateOrderRequestValidation;
    private _FindOrderRequestValidation: FindOrderRequestValidation;
    private _UpdateOrderRequestValidation: UpdateOrderRequestValidation;

    constructor(
        createRequestValidation: CreateOrderRequestValidation,
        findOrderRequestValidation: FindOrderRequestValidation,
        updateOrderRequestValidation: UpdateOrderRequestValidation
    ) {
        this._CreateOrderRequestValidation = createRequestValidation;
        this._FindOrderRequestValidation = findOrderRequestValidation;
        this._UpdateOrderRequestValidation = updateOrderRequestValidation;
    }

    public get $CreateOrderRequestValidation(): CreateOrderRequestValidation {
        return this._CreateOrderRequestValidation;
    }

    public get $FindOrderRequestValidation(): FindOrderRequestValidation {
        return this._FindOrderRequestValidation;
    }

    public get $UpdateOrderRequestValidation(): UpdateOrderRequestValidation {
        return this._UpdateOrderRequestValidation;
    }
}
