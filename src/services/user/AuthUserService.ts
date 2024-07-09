import { User } from '../../models/User.ts';
import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { IUserRepository } from '../../repositories/users/IUserRepository.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { UserValidation } from '../../validation/user/UserValidation.ts';
import { IAuthUserService } from './IAuthUserService.ts';
import generateUniqueId from 'generate-unique-id';
import bcrypt from 'bcrypt';
import { UserLoginRequest } from '../../models/requests/user/UserLoginRequest.ts';
import { UserLoginResponse } from '../../models/responses/user/UserLoginResponse.ts';
import jwt from 'jsonwebtoken';
import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { Client } from '../../models/Client.ts';
import { IClientService } from '../client/IClientService.ts';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { ClientValidationErrors } from '../../validation/errors/ClientValidationErrors.ts';
import { RegisterResponse } from '../../models/responses/user/RegisterResponse.ts';
import { ITransactionManager } from '../../managers/ITransactionManager.ts';

export class AuthUserService implements IAuthUserService {
    private readonly _userRepository: IUserRepository;
    private readonly _userValidation: UserValidation;
    private readonly _clientService: IClientService;
    private readonly _transactionManager: ITransactionManager;

    constructor(
        userRepository: IUserRepository,
        userValidation: UserValidation,
        clientService: IClientService,
        transactionManager: ITransactionManager
    ) {
        this._userRepository = userRepository;
        this._userValidation = userValidation;
        this._clientService = clientService;
        this._transactionManager = transactionManager;
    }

    public async registerUser(
        userRequest: UserCreateRequest,
        clientRequest: ClientCreateRequest
    ): Promise<RegisterResponse> {
        let response: RegisterResponse = new RegisterResponse();

        const userValidationErrors: UserValidationErrors[] =
            this._userValidation.$CreateUserRequestValidation.validate(
                userRequest
            );
        const clientValidationErrors: ClientValidationErrors[] =
            this._clientService.$Validation.$CreateClientRequestValidation.validate(
                clientRequest
            );
        let databaseErrors: string[] = [];

        if (
            userValidationErrors.length !== 0 ||
            clientValidationErrors.length !== 0
        ) {
            if (userValidationErrors.length !== 0) {
                response.userValidationErrors = userValidationErrors;
            }

            if (clientValidationErrors.length !== 0) {
                response.clientValidationErrors = !clientValidationErrors.some(
                    error => error.includes('Email')
                )
                    ? clientValidationErrors
                    : clientValidationErrors.filter(
                          error => !error.includes('Email')
                      );
            }
        } else {
            const currentDateTime: Date = new Date();

            const user: User = this._createUserEntity(
                userRequest,
                currentDateTime
            );

            const client: Client = this._createClientEntity(
                clientRequest,
                currentDateTime
            );

            try {
                response = await this._registerUserAndLinkClient(
                    user,
                    client,
                    response
                );
            } catch (error) {
                databaseErrors = handleException(error);

                response.databaseErrors = databaseErrors;
            }
        }

        return response;
    }

    public async loginUser(
        userRequest: UserLoginRequest
    ): Promise<UserLoginResponse> {
        const response: UserLoginResponse = new UserLoginResponse();
        let databaseErrors: string[] = [];

        try {
            const existingUser: User =
                await this._userRepository.readUserByEmail(userRequest.$Email);
            console.log(existingUser);

            const validationErrors: UserValidationErrors[] =
                this._userValidation.$LoginUserValidation.validate(
                    existingUser,
                    userRequest.$Password
                );

            if (validationErrors.length !== 0) {
                response.validationErrors = validationErrors;
            } else {
                const token = jwt.sign(
                    {
                        userId: existingUser.$Id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1d',
                    }
                );

                response.token = token;
                response.loggedInUser = existingUser;

                console.log(response);
            }
        } catch (error) {
            databaseErrors = handleException(error);
            console.log(error);

            response.databaseErrors = databaseErrors;
        }

        return response;
    }

    private _createUserEntity(
        userRequest: UserCreateRequest,
        currentDateTime: Date
    ): User {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userRequest.$Password, salt);

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

        return user;
    }

    private _createClientEntity(
        clientRequest: ClientCreateRequest,
        currentDateTime: Date
    ): Client {
        const client: Client = new Client(clientRequest.$Email);
        client.userId = clientRequest.$UserId;
        client.firstName = clientRequest.$FirstName;
        client.lastName = clientRequest.$LastName;
        client.phoneNumber = clientRequest.$PhoneNumber;
        client.creationDate = currentDateTime;
        client.updateDate = currentDateTime;
        client.uClientId = generateUniqueId({
            length: 16,
            useLetters: false,
            useNumbers: true,
        });

        return client;
    }

    private async _registerUserAndLinkClient(
        user: User,
        client: Client,
        response: RegisterResponse
    ): Promise<RegisterResponse> {
        try {
            await this._transactionManager.startTransaction();
            const connection = this._transactionManager.getConnection();

            const createdUser =
                await this._userRepository.createUserWithConnection(
                    connection,
                    user
                );

            client.userId = createdUser.$Id;

            const createdClient =
                await this._clientService.linkClientWithUserWithConnection(
                    connection,
                    client
                );
            createdUser.client = createdClient;

            response.registeredUser = createdUser;
            response.createdClient = createdClient;

            await this._transactionManager.commit();
        } catch (error) {
            await this._transactionManager.rollback();
            response.databaseErrors = handleException(error.code);
        }

        return response;
    }
}
