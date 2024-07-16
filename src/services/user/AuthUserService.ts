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
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { IAddressService } from '../address/IAddressService.ts';
import { AddressCreateRequest } from '../../models/requests/address/AddressCreateRequest.ts';
import { AddressValidationErrors } from '../../validation/errors/AddressValidationErrors.ts';
import { Address } from '../../models/Address.ts';

dotenv.config();

export class AuthUserService implements IAuthUserService {
    private readonly _userRepository: IUserRepository;
    private readonly _userValidation: UserValidation;
    private readonly _clientService: IClientService;
    private readonly _addressService: IAddressService;
    private readonly _transactionManager: ITransactionManager;

    constructor(
        userRepository: IUserRepository,
        userValidation: UserValidation,
        clientService: IClientService,
        addressService: IAddressService,
        transactionManager: ITransactionManager
    ) {
        this._userRepository = userRepository;
        this._userValidation = userValidation;
        this._clientService = clientService;
        this._addressService = addressService;
        this._transactionManager = transactionManager;
    }

    public async registerUser(
        userRequest: UserCreateRequest,
        clientRequest: ClientCreateRequest,
        addressRequest: AddressCreateRequest
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
        const addressValidationErrors: AddressValidationErrors[] =
            this._addressService.$Validation.$CreateAddressRequestValidation.validate(
                addressRequest
            );
        let databaseErrors: string[] = [];

        if (
            userValidationErrors.length !== 0 ||
            clientValidationErrors.length !== 0 ||
            addressValidationErrors.length !== 0
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

            if (addressValidationErrors.length !== 0) {
                response.addressValidationErrors = addressValidationErrors;
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

            const address: Address = this._createAddressEntity(addressRequest);

            try {
                response = await this._registerUserAndLinkClient(
                    user,
                    client,
                    address,
                    response
                );
            } catch (error) {
                databaseErrors = handleException(error);

                response.databaseErrors = databaseErrors;
            }
        }

        return response;
    }

    public async verifyUser(userId: number, email: string): Promise<boolean> {
        if (!this._userRepository.isUserExists(email, userId)) {
            return false;
        }

        await this._userRepository.updateUserVerification(userId);

        return true;
    }

    public async loginUser(
        userRequest: UserLoginRequest
    ): Promise<UserLoginResponse> {
        const response: UserLoginResponse = new UserLoginResponse();
        let databaseErrors: string[] = [];

        try {
            const existingUser: User =
                await this._userRepository.readUserByEmail(userRequest.$Email);

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
            }
        } catch (error) {
            databaseErrors = handleException(error);

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

    private _createAddressEntity(
        addressRequest: AddressCreateRequest
    ): Address {
        const address: Address = new Address();
        address.country = addressRequest.$Country;
        address.city = addressRequest.$City;
        address.postalCode = addressRequest.$PostalCode;
        address.address = addressRequest.$Address;

        return address;
    }

    private async _registerUserAndLinkClient(
        user: User,
        client: Client,
        address: Address,
        response: RegisterResponse
    ): Promise<RegisterResponse> {
        try {
            await this._transactionManager.startTransaction();
            const connection = this._transactionManager.getConnection();

            const createdUser: User =
                await this._userRepository.createUserWithConnection(
                    connection,
                    user
                );

            client.userId = createdUser.$Id;

            const createdClient: Client =
                await this._clientService.linkClientWithUserWithConnection(
                    connection,
                    client
                );
            createdUser.client = createdClient;
            address.clientId = createdClient.$Id;

            const createdAddress: Address =
                await this._addressService.linkAddressWithClientWithConnection(
                    connection,
                    address
                );

            response.registeredUser = createdUser;
            response.createdClient = createdClient;
            response.clientAddress = createdAddress;

            await this._transactionManager.commit();
        } catch (error) {
            await this._transactionManager.rollback();
            response.databaseErrors = handleException(error.code);
        }

        return response;
    }

    public async sendVerificationEmail(
        userEmail: string,
        userId: number
    ): Promise<void> {
        const emailToken = this._generateEmailToken(userEmail, userId);

        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });

        const verificationLink = `${process.env.VERIFICATION_DOMAIN}?emailToken=${emailToken}`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: 'Verify your email',
            html: `Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    }

    private _generateEmailToken(email: string, userId: number): string {
        return jwt.sign(
            {
                userId,
                email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }
}
