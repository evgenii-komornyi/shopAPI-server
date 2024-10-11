import { CreateUserRequestValidation } from './CreateUserRequestValidation.ts';
import { FindUserValidation } from './FindUserRequestValidation.ts';
import { LoginUserValidation } from './LoginUserValidation.ts';

export class UserValidation {
    private CreateUserRequestValidation: CreateUserRequestValidation;
    private LoginUserValidation: LoginUserValidation;
    private FindUserValidation: FindUserValidation;

    constructor(
        createRequestValidation: CreateUserRequestValidation,
        loginUserValidation: LoginUserValidation,
        findUserValidation: FindUserValidation
    ) {
        this.CreateUserRequestValidation = createRequestValidation;
        this.LoginUserValidation = loginUserValidation;
        this.FindUserValidation = findUserValidation;
    }

    public get $CreateUserRequestValidation(): CreateUserRequestValidation {
        return this.CreateUserRequestValidation;
    }

    public get $LoginUserValidation(): LoginUserValidation {
        return this.LoginUserValidation;
    }

    public get $FindUserValidation(): FindUserValidation {
        return this.FindUserValidation;
    }
}
