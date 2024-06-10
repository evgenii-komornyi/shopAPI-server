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

const router: Router = Router();

const userService: IUserService = new UserService(
    new UserRepository(),
    new UserValidation(new CreateUserRequestValidation())
);

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userCreateRequest: UserCreateRequest = new UserCreateRequest();
    userCreateRequest.email = email;
    userCreateRequest.password = password;

    try {
        const userResponse: UserCreateResponse = await userService.registerUser(
            userCreateRequest
        );

        if (userResponse) {
            const registeredUserDTO: RegisterUserDTO = new RegisterUserDTO();

            if (
                userResponse.hasValidationErrors() ||
                userResponse.hasDatabaseErrors()
            ) {
                registeredUserDTO.$status = Status.FAILED;
                registeredUserDTO.$validationErrors =
                    userResponse.$ValidationsErrors;
                registeredUserDTO.$databaseErrors =
                    userResponse.$DatabaseErrors;
            } else {
                registeredUserDTO.$id = userResponse.$RegisteredUser.$Id;
                registeredUserDTO.$email = userResponse.$RegisteredUser.$Email;
                registeredUserDTO.$createAt =
                    userResponse.$RegisteredUser.$CreatedAt;
                registeredUserDTO.$updateAt =
                    userResponse.$RegisteredUser.$UpdatedAt;
                registeredUserDTO.$lastLoginAt =
                    userResponse.$RegisteredUser.$LastLoginAt;
                registeredUserDTO.$isActive =
                    userResponse.$RegisteredUser.$IsActive;
                registeredUserDTO.$isVerified =
                    userResponse.$RegisteredUser.$IsVerified;
                registeredUserDTO.$uUserId =
                    userResponse.$RegisteredUser.$UUserId;
                registeredUserDTO.$status = Status.SUCCESS;
            }

            return res.status(200).json({
                registeredUser: registeredUserDTO,
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

export default router;
