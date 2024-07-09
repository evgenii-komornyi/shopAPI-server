import { Client } from './Client.ts';
import { Person } from './Person.ts';

export class User extends Person {
    private Password: string;
    private CreatedAt: Date;
    private UpdatedAt: Date;
    private LastLoginAt: Date | null;
    private IsActive: boolean;
    private IsVerified: boolean;
    private UUserId: string;
    private Client: Client;

    constructor(
        email: string,
        password: string,
        uUserId: string,
        createdAt: Date
    ) {
        super(email);
        this.Password = password;
        this.UUserId = uUserId;
        this.CreatedAt = createdAt;
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

    public set client(client: Client) {
        this.Client = client;
    }

    public get $Client(): Client {
        return this.Client;
    }
}
