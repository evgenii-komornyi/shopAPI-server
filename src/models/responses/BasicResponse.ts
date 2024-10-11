export class BasicResponse<E> {
    protected ValidationErrors: E[];
    protected DatabaseErrors: string[];

    public hasValidationErrors(): boolean {
        return this.ValidationErrors && this.ValidationErrors.length !== 0;
    }

    public hasDatabaseErrors(): boolean {
        return this.DatabaseErrors && this.DatabaseErrors.length !== 0;
    }

    public set validationErrors(errors: E[]) {
        this.ValidationErrors = errors;
    }

    public get $ValidationsErrors(): E[] {
        return this.ValidationErrors;
    }

    public set databaseErrors(errors: string[]) {
        this.DatabaseErrors = errors;
    }

    public get $DatabaseErrors(): string[] {
        return this.DatabaseErrors;
    }
}
