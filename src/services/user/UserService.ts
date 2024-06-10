import { User } from '../../models/User.ts';
import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { UserCreateResponse } from '../../models/responses/user/UserCreateResponse.ts';
import { IUserRepository } from '../../repositories/users/IUserRepository.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { UserValidation } from '../../validation/user/UserValidation.ts';
import { IUserService } from './IUserService.ts';
import generateUniqueId from 'generate-unique-id';
import { DatabaseErrors } from '../../validation/errors/DatabaseErrors.ts';
import { DBErrorCodes } from '../../enums/DBErrorCodes.ts';

export class UserService implements IUserService {
    private readonly _repository: IUserRepository;
    private readonly _validation: UserValidation;

    constructor(repository: IUserRepository, validation: UserValidation) {
        this._repository = repository;
        this._validation = validation;
    }

    registerUser(userRequest: UserCreateRequest): Promise<UserCreateResponse> {
        const response: UserCreateResponse = new UserCreateResponse();
        const validationErrors: UserValidationErrors[] =
            this._validation.$CreateUserRequestValidation.validate(userRequest);
        const databaseErrors: string[] = [];

        if (validationErrors.length !== 0) {
            response.validationErrors = validationErrors;

            return Promise.resolve(response);
        } else {
            const currentDateTime: Date = new Date();
            const user: User = new User(
                userRequest.$Email,
                userRequest.$Password,
                generateUniqueId({
                    length: 16,
                    useLetters: true,
                    useNumbers: true,
                }),
                currentDateTime
            );
            user.updatedAt = currentDateTime;
            user.lastLoginAt = null;
            user.isActive = true;
            user.isVerified = false;

            return this._repository
                .createUser(user)
                .then(createdUser => {
                    response.registeredUser = createdUser;

                    return response;
                })
                .catch(error => {
                    if (
                        error.toString().replace('Error: ', '') ===
                        DBErrorCodes.MYSQL_DUPLICATE_ENTRY_CODE
                    ) {
                        databaseErrors.push(DatabaseErrors.DUPLICATE_ENTRY);
                    }

                    response.databaseErrors = databaseErrors;

                    return response;
                });
        }
    }
}
