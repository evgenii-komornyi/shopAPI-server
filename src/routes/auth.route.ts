import { Request, Response, Router } from 'express';
import { AuthUserService } from '../services/user/AuthUserService.ts';
import { IAuthUserService } from '../services/user/IAuthUserService.ts';
import { UserRepository } from '../repositories/users/UserRepository.ts';
import { UserValidation } from '../validation/user/UserValidation.ts';
import { CreateUserRequestValidation } from '../validation/user/CreateUserRequestValidation.ts';
import { UserCreateRequest } from '../models/requests/user/UserCreateRequest.ts';
import { Status } from '../enums/Status.ts';
import { UserLoginRequest } from '../models/requests/user/UserLoginRequest.ts';
import { UserLoginResponse } from '../models/responses/user/UserLoginResponse.ts';
import { LoginUserDTO } from '../dto/user/LoginUserDTO.ts';
import { LoginUserValidation } from '../validation/user/LoginUserValidation.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';
import { FindUserValidation } from '../validation/user/FindUserRequestValidation.ts';
import { ClientRepository } from '../repositories/clients/ClientRepository.ts';
import { Client } from '../models/Client.ts';
import { ClientDetailsDTO } from '../dto/client/ClientDetailsDTO.ts';
import { User } from '../models/User.ts';
import { UserDetailsDTO } from '../dto/user/UserDetailsDTO.ts';
import { ClientCreateRequest } from '../models/requests/client/ClientCreateRequest.ts';
import { ClientService } from '../services/client/ClientService.ts';
import { ClientValidation } from '../validation/client/ClientValidation.ts';
import { CreateClientRequestValidation } from '../validation/client/CreateClientRequestValidation.ts';
import { RegisterResponse } from '../models/responses/user/RegisterResponse.ts';
import { TransactionManager } from '../managers/TransactionManager.ts';
import { RegisterDTO } from '../dto/register/RegisterDTO.ts';
import { JWTVerification } from '../middlewares/JWTVerification.ts';
import { AddressService } from '../services/address/AddressService.ts';
import { AddressRepository } from '../repositories/address/AddressRepository.ts';
import { AddressValidation } from '../validation/address/AddressValidation.ts';
import { CreateAddressRequestValidation } from '../validation/address/CreateAddressRequestValidation.ts';
import { AddressCreateRequest } from '../models/requests/address/AddressCreateRequest.ts';
import { UserValidationErrors } from '../validation/errors/UserValidationErrors.ts';
import { ClientValidationErrors } from '../validation/errors/ClientValidationErrors.ts';
import { AddressValidationErrors } from '../validation/errors/AddressValidationErrors.ts';
import { UpdateClientRequestValidation } from '../validation/client/UpdateClientRequestValidation.ts';
import { UpdateAddressRequestValidation } from '../validation/address/UpdateAddressRequestValidation.ts';

const router: Router = Router();

const _jwtVerification: JWTVerification = new JWTVerification();
const authUserService: IAuthUserService = new AuthUserService(
    new UserRepository(),
    new UserValidation(
        new CreateUserRequestValidation(),
        new LoginUserValidation(),
        new FindUserValidation()
    ),
    new ClientService(
        new ClientRepository(),
        new ClientValidation(
            new CreateClientRequestValidation(),
            new UpdateClientRequestValidation()
        )
    ),
    new AddressService(
        new AddressRepository(),
        new AddressValidation(
            new CreateAddressRequestValidation(),
            new UpdateAddressRequestValidation()
        )
    ),
    new TransactionManager()
);

router.post('/register', async (req: Request, res: Response) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        country,
        city,
        postalCode,
        address,
    } = req.body;
    const sanitizedTrimmedEmail = sanitize(trim(email));

    const userCreateRequest: UserCreateRequest = new UserCreateRequest();
    userCreateRequest.email = sanitizedTrimmedEmail;
    userCreateRequest.password = sanitize(trim(password));

    const clientCreateRequest: ClientCreateRequest = new ClientCreateRequest();
    clientCreateRequest.email = sanitizedTrimmedEmail;
    clientCreateRequest.firstName = sanitize(trim(firstName));
    clientCreateRequest.lastName = sanitize(trim(lastName));
    clientCreateRequest.phoneNumber = sanitize(trim(phoneNumber));

    const addressCreateRequest: AddressCreateRequest =
        new AddressCreateRequest();
    addressCreateRequest.country = sanitize(trim(country));
    addressCreateRequest.city = sanitize(trim(city));
    addressCreateRequest.postalCode = sanitize(trim(postalCode));
    addressCreateRequest.address = sanitize(trim(address));

    try {
        const registerResponse: RegisterResponse =
            await authUserService.registerUser(
                userCreateRequest,
                clientCreateRequest,
                addressCreateRequest
            );

        if (
            !registerResponse.hasDatabaseErrors() &&
            !registerResponse.hasValidationErrors()
        ) {
            await authUserService.sendVerificationEmail(
                registerResponse.$RegisteredUser.$Email,
                registerResponse.$RegisteredUser.$Id
            );
        }

        return res.status(200).json({
            data: { ..._generateRegisterUserDTO(registerResponse) },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

router.get(
    '/verify_email',
    _jwtVerification.verifyEmailJWT,
    (req: Request, res: Response) => {
        if (authUserService.verifyUser(+req.body.userId, req.body.email)) {
            return res.status(200).json({ data: { status: Status.SUCCESS } });
        } else {
            return res.status(200).json({
                data: {
                    status: Status.FAILED,
                },
            });
        }
    }
);

router.post('/login', async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    const userLoginRequest: UserLoginRequest = new UserLoginRequest();
    userLoginRequest.email = sanitize(trim(email));
    userLoginRequest.password = sanitize(trim(password));
    userLoginRequest.rememberMe = Boolean(sanitize(trim(String(rememberMe))));

    try {
        const userResponse: UserLoginResponse = await authUserService.loginUser(
            userLoginRequest
        );

        if (userResponse) {
            if (
                userResponse.hasValidationErrors() ||
                userResponse.hasDatabaseErrors()
            ) {
                return res.status(200).json({
                    data: { ..._generateLoggedInUserDTO(userResponse) },
                });
            } else {
                const expDate = userLoginRequest.$RememberMe
                    ? 365 * 24 * 60 * 60 * 1000
                    : 24 * 60 * 60 * 1000;

                return res
                    .status(200)
                    .cookie('token', userResponse.$Token, {
                        maxAge: expDate,
                        httpOnly: true,
                        sameSite: 'none',
                    })
                    .json({
                        data: {
                            ..._generateLoggedInUserDTO(userResponse, expDate),
                        },
                    });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.body.userId = undefined;
    return res.clearCookie('token').json({ data: { status: Status.SUCCESS } });
});

const _generateRegisterUserDTO = (response: RegisterResponse): RegisterDTO => {
    const registerUserDTO: RegisterDTO = new RegisterDTO();

    if (response.hasValidationErrors() || response.hasDatabaseErrors()) {
        registerUserDTO.$status = Status.FAILED;
        registerUserDTO.$databaseErrors = response.$DatabaseErrors;

        const userValidationErrors: UserValidationErrors[] =
            response.$UserValidationErrors;
        const clientValidationErrors: ClientValidationErrors[] =
            response.$ClientValidationErrors;
        const addressValidationErrors: AddressValidationErrors[] =
            response.$AddressValidationErrors;

        if (
            userValidationErrors !== undefined ||
            clientValidationErrors !== undefined ||
            addressValidationErrors !== undefined
        ) {
            registerUserDTO.$validationErrors = [
                ...(userValidationErrors ?? []),
                ...(clientValidationErrors ?? []),
                ...(addressValidationErrors ?? []),
            ];
        }
    } else {
        registerUserDTO.$status = Status.SUCCESS;
        registerUserDTO.$message =
            'You are registered successfully! We sent you a link to your email. Please, verify your email to continue to use our services.';
    }

    return registerUserDTO;
};

const _generateUserDetailsDTO = (
    user: User,
    token?: string,
    exp?: number,
    withEmail: boolean = false
): UserDetailsDTO => {
    const userDetailsDTO = new UserDetailsDTO();

    if (token) {
        userDetailsDTO.$token = token;
    }

    userDetailsDTO.$id = user.$Id;

    if (withEmail) {
        userDetailsDTO.$email = user.$Email;
    }

    if (exp) {
        userDetailsDTO.$exp = exp;
    }

    userDetailsDTO.$uUserId = user.$UUserId;
    userDetailsDTO.$client = _generateClientDetailsDTO(user.$Client);

    return userDetailsDTO;
};

const _generateLoggedInUserDTO = (
    userResponse: UserLoginResponse,
    expiresDate?: number
): LoginUserDTO => {
    const loggedInUserDTO: LoginUserDTO = new LoginUserDTO();

    if (
        userResponse.hasValidationErrors() ||
        userResponse.hasDatabaseErrors()
    ) {
        loggedInUserDTO.$status = Status.FAILED;
        loggedInUserDTO.$validationErrors = userResponse.$ValidationsErrors;
        loggedInUserDTO.$databaseErrors = userResponse.$DatabaseErrors;
    } else {
        loggedInUserDTO.$status = Status.SUCCESS;
        loggedInUserDTO.$user = _generateUserDetailsDTO(
            userResponse.$LoggedInUser,
            userResponse.$Token,
            expiresDate
        );
    }

    return loggedInUserDTO;
};

const _generateClientDetailsDTO = (
    client: Client,
    withEmail: boolean = false
): ClientDetailsDTO => {
    const clientDTO = new ClientDetailsDTO();
    clientDTO.$id = client.$Id;
    if (withEmail) {
        clientDTO.$email = client.$Email;
    }
    clientDTO.$uClientId = client.$UClientId;
    clientDTO.$firstName = client.$FirstName;
    clientDTO.$lastName = client.$LastName;
    clientDTO.$phoneNumber = client.$PhoneNumber;
    clientDTO.$creationDate = client.$CreationDate;
    clientDTO.$updateDate = client.$UpdateDate;
    clientDTO.$userId = client.$UserId;

    return clientDTO;
};

export default router;
