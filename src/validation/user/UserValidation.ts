import { CreateUserRequestValidation } from './CreateUserRequestValidation.ts';

export class UserValidation {
    private CreateUserRequestValidation: CreateUserRequestValidation;

    constructor(createRequestValidation: CreateUserRequestValidation) {
        this.CreateUserRequestValidation = createRequestValidation;
    }

    public get $CreateUserRequestValidation(): CreateUserRequestValidation {
        return this.CreateUserRequestValidation;
    }
}
