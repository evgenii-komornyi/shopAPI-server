export enum AddressValidationErrors {
    EMPTY_COUNTRY = 'Country cannot be empty.',
    COUNTRY_DELIVERY_VIOLATION = 'Country has to be only Latvia, Lithuania, or Estonia.',
    EMPTY_CITY = 'City cannot be empty.',
    CITY_LENGTH_VIOLATION = 'City has to have length from 4 to 100.',
    CITY_INCORRECT_FORMAT = 'City has to contains letters. Can contains - and space between the words.',
    EMPTY_POSTAL_CODE = 'Postal code cannot be empty.',
    POSTAL_CODE_INCORRECT_FORMAT = 'Postal code format is incorrect. Country do not have any matches.',
    EMPTY_ADDRESS = 'Address cannot be empty.',
    SPECIAL_CHARACTERS_NOT_ALLOWED = 'Address cannot contains any special characters.',
}
