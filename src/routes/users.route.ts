import { Request, Response, Router } from 'express';
import { UserService } from '../services/user/UserService.ts';
import { IUserService } from '../services/user/IUserService.ts';
import { UserRepository } from '../repositories/users/UserRepository.ts';
import { UserValidation } from '../validation/user/UserValidation.ts';
import { CreateUserRequestValidation } from '../validation/user/CreateUserRequestValidation.ts';
import { UserCreateRequest } from '../models/requests/user/UserCreateRequest.ts';
import { UserCreateResponse } from '../models/responses/user/UserCreateResponse.ts';
import { RegisterUserDTO } from '../dto/user/RegisterUserDTO.ts';
import { Status } from '../enums/Status.ts';
import { UserLoginRequest } from '../models/requests/user/UserLoginRequest.ts';
import { UserLoginResponse } from '../models/responses/user/UserLoginResponse.ts';
import { LoginUserDTO } from '../dto/user/LoginUserDTO.ts';
import { LoginUserValidation } from '../validation/user/LoginUserValidation.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';

const router: Router = Router();

const userService: IUserService = new UserService(
    new UserRepository(),
    new UserValidation(
        new CreateUserRequestValidation(),
        new LoginUserValidation()
    )
);

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userCreateRequest: UserCreateRequest = new UserCreateRequest();
    userCreateRequest.email = sanitize(trim(email));
    userCreateRequest.password = sanitize(trim(password));

    try {
        const userResponse: UserCreateResponse = await userService.registerUser(
            userCreateRequest
        );

        if (userResponse) {
            const registeredUserDTO: RegisterUserDTO =
                _generateRegisteredUserDTO(userResponse);

            return res.status(200).json({
                registeredUser: registeredUserDTO,
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userLoginRequest: UserLoginRequest = new UserLoginRequest();
    userLoginRequest.email = sanitize(trim(email));
    userLoginRequest.password = sanitize(trim(password));

    try {
        const userResponse: UserLoginResponse = await userService.loginUser(
            userLoginRequest
        );

        if (userResponse) {
            if (
                userResponse.hasValidationErrors() ||
                userResponse.hasDatabaseErrors()
            ) {
                return res
                    .status(401)
                    .json({ errors: _generateLoggedInUserDTO(userResponse) });
            } else {
                return res.status(200).json({
                    loggedInUser: _generateLoggedInUserDTO(userResponse),
                });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

const _generateRegisteredUserDTO = (
    userResponse: UserCreateResponse
): RegisterUserDTO => {
    const registeredUserDTO: RegisterUserDTO = new RegisterUserDTO();

    if (
        userResponse.hasValidationErrors() ||
        userResponse.hasDatabaseErrors()
    ) {
        registeredUserDTO.$status = Status.FAILED;
        registeredUserDTO.$validationErrors = userResponse.$ValidationsErrors;
        registeredUserDTO.$databaseErrors = userResponse.$DatabaseErrors;
    } else {
        registeredUserDTO.$id = userResponse.$RegisteredUser.$Id;
        registeredUserDTO.$email = userResponse.$RegisteredUser.$Email;
        registeredUserDTO.$createAt = userResponse.$RegisteredUser.$CreatedAt;
        registeredUserDTO.$updateAt = userResponse.$RegisteredUser.$UpdatedAt;
        registeredUserDTO.$lastLoginAt =
            userResponse.$RegisteredUser.$LastLoginAt;
        registeredUserDTO.$isActive = userResponse.$RegisteredUser.$IsActive;
        registeredUserDTO.$isVerified =
            userResponse.$RegisteredUser.$IsVerified;
        registeredUserDTO.$uUserId = userResponse.$RegisteredUser.$UUserId;
        registeredUserDTO.$status = Status.SUCCESS;
    }

    return registeredUserDTO;
};

const _generateLoggedInUserDTO = (
    userResponse: UserLoginResponse
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
        loggedInUserDTO.$id = userResponse.$LoggedInUser.$Id;
        loggedInUserDTO.$email = userResponse.$LoggedInUser.$Email;
        loggedInUserDTO.$createAt = userResponse.$LoggedInUser.$CreatedAt;
        loggedInUserDTO.$updateAt = userResponse.$LoggedInUser.$UpdatedAt;
        loggedInUserDTO.$lastLoginAt = userResponse.$LoggedInUser.$LastLoginAt;
        loggedInUserDTO.$isActive = userResponse.$LoggedInUser.$IsActive;
        loggedInUserDTO.$isVerified = userResponse.$LoggedInUser.$IsVerified;
        loggedInUserDTO.$uUserId = userResponse.$LoggedInUser.$UUserId;
        loggedInUserDTO.$status = Status.SUCCESS;
        loggedInUserDTO.$token = userResponse.$Token;
    }

    return loggedInUserDTO;
};

export default router;
