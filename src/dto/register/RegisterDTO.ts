import { Status } from '../../enums/Status.ts';
import { AddressValidationErrors } from '../../validation/errors/AddressValidationErrors.ts';
import { ClientValidationErrors } from '../../validation/errors/ClientValidationErrors.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';

export class RegisterDTO {
    private message: string;
    private validationErrors: (
        | UserValidationErrors
        | ClientValidationErrors
        | AddressValidationErrors
    )[];
    private databaseErrors: string[];
    private status: Status;

    public set $message(message: string) {
        this.message = message;
    }

    public set $validationErrors(
        errors: (
            | UserValidationErrors
            | ClientValidationErrors
            | AddressValidationErrors
        )[]
    ) {
        this.validationErrors = errors;
    }

    public set $databaseErrors(errors: string[]) {
        this.databaseErrors = errors;
    }

    public set $status(status: Status) {
        this.status = status;
    }
}
