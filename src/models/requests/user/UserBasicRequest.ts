export abstract class UserBasicRequest {
    protected Email: string;
    protected Password: string;

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
