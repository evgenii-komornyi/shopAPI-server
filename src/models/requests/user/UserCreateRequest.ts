import { UserBasicRequest } from './UserBasicRequest.ts';

export class UserCreateRequest extends UserBasicRequest {
    private Email: string;
    private Password: string;

    public set email(email: string) {
        this.Email = email;
    }

    public get $Email(): string {
        return this.Email;
    }

    public set password(password: string) {
        this.Password = password;
    }

    public get $Password(): string {
        return this.Password;
    }
}
