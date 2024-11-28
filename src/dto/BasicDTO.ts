import { Status } from '../enums/Status.ts';

export abstract class BasicDTO<E> {
    protected status: Status;
    protected validationErrors?: E[];
    protected databaseErrors?: string[];

    public set $status(status: Status) {
        this.status = status;
    }

    public set $validationErrors(errors: E[]) {
        this.validationErrors = errors;
    }

    public set $databaseErrors(errors: string[]) {
        this.databaseErrors = errors;
    }
}
