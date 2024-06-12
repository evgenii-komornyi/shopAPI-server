import { CreateUserRequestValidation } from './CreateUserRequestValidation.ts';
import { LoginUserValidation } from './LoginUserValidation.ts';

export class UserValidation {
    private CreateUserRequestValidation: CreateUserRequestValidation;
    private LoginUserValidation: LoginUserValidation;

    constructor(
        createRequestValidation: CreateUserRequestValidation,
        loginUserValidation: LoginUserValidation
    ) {
        this.CreateUserRequestValidation = createRequestValidation;
        this.LoginUserValidation = loginUserValidation;
    }

    public get $CreateUserRequestValidation(): CreateUserRequestValidation {
        return this.CreateUserRequestValidation;
    }

    public get $LoginUserValidation(): LoginUserValidation {
        return this.LoginUserValidation;
    }
}
