import { ClientValidationErrors } from '../../../validation/errors/ClientValidationErrors.ts';
import { UserValidationErrors } from '../../../validation/errors/UserValidationErrors.ts';
import { Client } from '../../Client.ts';
import { User } from '../../User.ts';

export class RegisterResponse {
    private RegisteredUser: User;
    private CreatedClient: Client;
    private UserValidationErrors: UserValidationErrors[];
    private ClientValidationErrors: ClientValidationErrors[];
    private DatabaseErrors: string[];

    public set registeredUser(user: User) {
        this.RegisteredUser = user;
    }

    public get $RegisteredUser(): User {
        return this.RegisteredUser;
    }

    public set createdClient(client: Client) {
        this.CreatedClient = client;
    }

    public get $CreatedClient(): Client {
        return this.CreatedClient;
    }

    public hasValidationErrors(): boolean {
        return (
            (this.UserValidationErrors &&
                this.UserValidationErrors.length !== 0) ||
            (this.ClientValidationErrors &&
                this.ClientValidationErrors.length !== 0)
        );
    }

    public hasDatabaseErrors(): boolean {
        return this.DatabaseErrors && this.DatabaseErrors.length !== 0;
    }

    public set userValidationErrors(errors: UserValidationErrors[]) {
        this.UserValidationErrors = errors;
    }

    public get $UserValidationErrors(): UserValidationErrors[] {
        return this.UserValidationErrors;
    }

    public set clientValidationErrors(errors: ClientValidationErrors[]) {
        this.ClientValidationErrors = errors;
    }

    public get $ClientValidationErrors(): ClientValidationErrors[] {
        return this.ClientValidationErrors;
    }

    public set databaseErrors(errors: string[]) {
        this.DatabaseErrors = errors;
    }

    public get $DatabaseErrors(): string[] {
        return this.DatabaseErrors;
    }
}
