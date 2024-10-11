import { DBErrorCodes } from '../enums/DBErrorCodes.ts';
import { DatabaseErrors } from '../validation/errors/DatabaseErrors.ts';

export const handleException = (exception): string[] => {
    const databaseErrors: string[] = [];

    const formattedErrorCode: string = exception
        .toString()
        .replace('Error: ', '');

    if (formattedErrorCode === DBErrorCodes.MYSQL_CONNECTION_FAILED_CODE) {
        databaseErrors.push(DatabaseErrors.CONNECTION_FAILED);
    } else if (formattedErrorCode === DBErrorCodes.MYSQL_DUPLICATE_ENTRY_CODE) {
        databaseErrors.push(DatabaseErrors.DUPLICATE_ENTRY);
    }

    return databaseErrors;
};
