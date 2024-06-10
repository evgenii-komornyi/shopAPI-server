export class User {
    private Id: number;
    private Email: string;
    private Password: string;
    private CreatedAt: Date;
    private UpdatedAt: Date;
    private LastLoginAt: Date | null;
    private IsActive: boolean;
    private IsVerified: boolean;
    private UUserId: string;

    constructor(
        email: string,
        password: string,
        uUserId: string,
        createdAt: Date
    ) {
        this.Email = email;
        this.Password = password;
        this.UUserId = uUserId;
        this.CreatedAt = createdAt;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public get $Id(): number {
        return this.Id;
    }

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

    public set createdAt(createdAt: Date) {
        this.CreatedAt = createdAt;
    }

    public get $CreatedAt(): Date {
        return this.CreatedAt;
    }

    public set updatedAt(updatedAt: Date) {
        this.UpdatedAt = updatedAt;
    }

    public get $UpdatedAt(): Date {
        return this.UpdatedAt;
    }

    public set lastLoginAt(lastLoginAt: Date | null) {
        this.LastLoginAt = lastLoginAt;
    }

    public get $LastLoginAt(): Date | null {
        return this.LastLoginAt;
    }

    public set isActive(isActive: boolean) {
        this.IsActive = isActive;
    }

    public get $IsActive(): boolean {
        return this.IsActive;
    }

    public set isVerified(isVerified: boolean) {
        this.IsVerified = isVerified;
    }

    public get $IsVerified(): boolean {
        return this.IsVerified;
    }

    public set uUserId(uUserId: string) {
        this.UUserId = uUserId;
    }

    public get $UUserId(): string {
        return this.UUserId;
    }
}
