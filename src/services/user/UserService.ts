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
import bcrypt from 'bcrypt';
import { UserLoginRequest } from '../../models/requests/user/UserLoginRequest.ts';
import { UserLoginResponse } from '../../models/responses/user/UserLoginResponse.ts';
import jwt from 'jsonwebtoken';

export class UserService implements IUserService {
    private readonly _repository: IUserRepository;
    private readonly _validation: UserValidation;

    constructor(repository: IUserRepository, validation: UserValidation) {
        this._repository = repository;
        this._validation = validation;
    }

    async registerUser(
        userRequest: UserCreateRequest
    ): Promise<UserCreateResponse> {
        const response: UserCreateResponse = new UserCreateResponse();
        const validationErrors: UserValidationErrors[] =
            this._validation.$CreateUserRequestValidation.validate(userRequest);
        let databaseErrors: string[] = [];

        if (validationErrors.length !== 0) {
            response.validationErrors = validationErrors;
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(userRequest.$Password, salt);
            const currentDateTime: Date = new Date();
            const user: User = new User(
                userRequest.$Email,
                hashedPassword,
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

            try {
                const registeredUser = await this._repository.createUser(user);

                if (registeredUser) {
                    response.registeredUser = registeredUser;
                }
            } catch (error) {
                databaseErrors = this._handleException(error);

                response.databaseErrors = databaseErrors;
            }
        }

        return response;
    }

    async loginUser(userRequest: UserLoginRequest): Promise<UserLoginResponse> {
        const response: UserLoginResponse = new UserLoginResponse();
        let databaseErrors: string[] = [];

        try {
            const existingUser = await this._repository.readUserByEmail(
                userRequest.$Email
            );

            const validationErrors: UserValidationErrors[] =
                this._validation.$LoginUserValidation.validate(
                    existingUser,
                    userRequest.$Password
                );

            if (validationErrors.length !== 0) {
                response.validationErrors = validationErrors;
            } else {
                const token = jwt.sign(
                    {
                        userId: existingUser.$UUserId,
                        userCreatedAt: existingUser.$CreatedAt,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1d',
                    }
                );
                response.token = token;
                response.loggedInUser = existingUser;
            }
        } catch (error) {
            databaseErrors = this._handleException(error);

            response.databaseErrors = databaseErrors;
        }

        return response;
    }

    _handleException(exception): string[] {
        const databaseErrors: string[] = [];

        const formattedErrorCode: string = exception
            .toString()
            .replace('Error: ', '');

        if (formattedErrorCode === DBErrorCodes.MYSQL_CONNECTION_FAILED_CODE) {
            databaseErrors.push(DatabaseErrors.CONNECTION_FAILED);
        } else if (
            formattedErrorCode === DBErrorCodes.MYSQL_DUPLICATE_ENTRY_CODE
        ) {
            databaseErrors.push(DatabaseErrors.DUPLICATE_ENTRY);
        }

        return databaseErrors;
    }
}
