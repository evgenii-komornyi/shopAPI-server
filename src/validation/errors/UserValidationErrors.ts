export enum UserValidationErrors {
    EMPTY_EMAIL = 'Email cannot be empty.',
    EMAIL_LENGTH_VIOLATION = 'Email has to have length from 3 to 100.',
    EMAIL_INCORRECT_FORMAT = 'Email format is incorrect.',
    EMPTY_PASSWORD = 'Password cannot be empty.',
    PASSWORD_LENGTH_VIOLATION = 'Password has to have length from 8 to 100 length.',
    PASSWORD_INCORRECT_FORMAT = 'Password format is incorrect. Password has to contain at least one special symbol, capital letter and digit.',
    NO_SEARCH_CRITERIA = 'Invalid search criteria.',
    USER_DOES_NOT_EXISTS = 'User, or password is incorrect.',
}
