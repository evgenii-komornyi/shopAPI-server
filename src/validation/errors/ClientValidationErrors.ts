export enum ClientValidationErrors {
    EMPTY_EMAIL = 'Email cannot be empty.',
    EMAIL_LENGTH_VIOLATION = 'Email has to have length from 3 to 100.',
    EMAIL_INCORRECT_FORMAT = 'Email format is incorrect.',
    EMPTY_FIRST_NAME = 'First name cannot be empty.',
    FIRST_NAME_LENGTH_VIOLATION = 'First name has to have length from 2 to 100.',
    FIRST_NAME_INCORRECT_FORMAT = 'First name format is incorrect.',
    EMPTY_LAST_NAME = 'Last name cannot be empty.',
    LAST_NAME_LENGTH_VIOLATION = 'Last name has to have length from 2 to 100.',
    LAST_NAME_INCORRECT_FORMAT = 'Last name format is incorrect.',
    EMPTY_PHONE_NUMBER = 'Phone number cannot be empty.',
    PHONE_NUMBER_INCORRECT_FORMAT = 'Phone number format is incorrect.',
}
