import { Status } from '../../enums/Status.ts';
import { ClientValidationErrors } from '../../validation/errors/ClientValidationErrors.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { ClientDetailsDTO } from '../client/ClientDetailsDTO.ts';
import { UserDetailsDTO } from '../user/UserDetailsDTO.ts';

export class RegisterDTO {
    private user: UserDetailsDTO;
    private client: ClientDetailsDTO;
    private validationErrors: (UserValidationErrors | ClientValidationErrors)[];
    private databaseErrors: string[];
    private status: Status;

    public set $user(user: UserDetailsDTO) {
        this.user = user;
    }

    public set $client(client: ClientDetailsDTO) {
        this.client = client;
    }

    public set $validationErrors(
        errors: (UserValidationErrors | ClientValidationErrors)[]
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
