import { UserBasicRequest } from './UserBasicRequest.ts';

export class UserLoginRequest extends UserBasicRequest {
    private RememberMe: boolean;

    public get $RememberMe(): boolean {
        return this.RememberMe;
    }

    public set rememberMe(rememberMe: boolean) {
        this.RememberMe = rememberMe;
    }
}
