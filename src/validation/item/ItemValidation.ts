import { FindItemRequestValidation } from './FindItemRequestValidation.ts';

export class ItemValidation {
    private _FindItemRequestValidation: FindItemRequestValidation;

    constructor(findItemRequestValidation: FindItemRequestValidation) {
        this._FindItemRequestValidation = findItemRequestValidation;
    }

    public get $FindOrderRequestValidation(): FindItemRequestValidation {
        return this._FindItemRequestValidation;
    }
}
