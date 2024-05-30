import { FindTypeRequestValidation } from './FindTypeRequestValidation.ts';

export class TypeValidation {
    private _FindTypeRequestValidation: FindTypeRequestValidation;

    constructor(findTypeRequestValidation: FindTypeRequestValidation) {
        this._FindTypeRequestValidation = findTypeRequestValidation;
    }

    public get $FindTypeRequestValidation(): FindTypeRequestValidation {
        return this._FindTypeRequestValidation;
    }
}
