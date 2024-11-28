import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { BasicResponse } from './BasicResponse.ts';

export abstract class TokenizedResponse extends BasicResponse<UserValidationErrors> {
    protected Token: string;

    public get $Token(): string {
        return this.Token;
    }

    public set token(token: string) {
        this.Token = token;
    }
}
