import { Request, Response, Router } from 'express';
import { UserRepository } from '../repositories/users/UserRepository.ts';
import { UserValidation } from '../validation/user/UserValidation.ts';
import { Status } from '../enums/Status.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';
import { UserService } from '../services/user/UserService.ts';
import { IUserService } from '../services/user/IUserService.ts';
import { FindUserValidation } from '../validation/user/FindUserRequestValidation.ts';
import { CreateUserRequestValidation } from '../validation/user/CreateUserRequestValidation.ts';
import { LoginUserValidation } from '../validation/user/LoginUserValidation.ts';
import { UserFindRequest } from '../models/requests/user/UserFindRequest.ts';
import { UserFindResponse } from '../models/responses/user/UserFindResponse.ts';
import { UserDTO } from '../dto/user/UserDTO.ts';
import { User } from '../models/User.ts';
import { UserDetailsDTO } from '../dto/user/UserDetailsDTO.ts';
import { Client } from '../models/Client.ts';
import { ClientDetailsDTO } from '../dto/client/ClientDetailsDTO.ts';

const userService: IUserService = new UserService(
    new UserRepository(),
    new UserValidation(
        new CreateUserRequestValidation(),
        new LoginUserValidation(),
        new FindUserValidation()
    )
);

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const userFindRequest: UserFindRequest = new UserFindRequest();
    userFindRequest.userId = +sanitize(trim(String(req.body.userId)));

    try {
        const userResponse: UserFindResponse = await userService.getUserById(
            userFindRequest
        );

        if (userResponse) {
            if (
                userResponse.hasValidationErrors() ||
                userResponse.hasDatabaseErrors()
            ) {
                return res
                    .status(401)
                    .json({ errors: _generateUserDTO(userResponse) });
            } else {
                return res.status(200).json({
                    data: _generateUserDTO(userResponse),
                });
            }
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

const _generateUserDTO = (userResponse: UserFindResponse): UserDTO => {
    const userDTO: UserDTO = new UserDTO();

    if (
        userResponse.hasValidationErrors() ||
        userResponse.hasDatabaseErrors()
    ) {
        userDTO.$status = Status.FAILED;
        userDTO.$validationErrors = userResponse.$ValidationsErrors;
        userDTO.$databaseErrors = userResponse.$DatabaseErrors;
    } else {
        userDTO.$user = _generateUserDetailsDTO(userResponse.$FoundUser);
    }

    return userDTO;
};

const _generateUserDetailsDTO = (
    user: User,
    token: string | undefined = undefined
): UserDetailsDTO => {
    const userDetailsDTO = new UserDetailsDTO();

    if (token) {
        userDetailsDTO.$token = token;
    }

    userDetailsDTO.$id = user.$Id;
    userDetailsDTO.$email = user.$Email;
    userDetailsDTO.$createAt = user.$CreatedAt;
    userDetailsDTO.$updateAt = user.$UpdatedAt;
    userDetailsDTO.$lastLoginAt = user.$LastLoginAt;
    userDetailsDTO.$isActive = user.$IsActive;
    userDetailsDTO.$isVerified = user.$IsVerified;
    userDetailsDTO.$uUserId = user.$UUserId;
    userDetailsDTO.$client = _generateClientDetailsDTO(user.$Client);

    return userDetailsDTO;
};

const _generateClientDetailsDTO = (client: Client): ClientDetailsDTO => {
    const clientDetailsDTO: ClientDetailsDTO = new ClientDetailsDTO();
    clientDetailsDTO.$id = client.$Id;
    clientDetailsDTO.$email = client.$Email;
    clientDetailsDTO.$firstName = client.$FirstName;
    clientDetailsDTO.$lastName = client.$LastName;
    clientDetailsDTO.$phoneNumber = client.$PhoneNumber;
    clientDetailsDTO.$creationDate = client.$CreationDate;
    clientDetailsDTO.$updateDate = client.$UpdateDate;
    clientDetailsDTO.$uClientId = client.$UClientId;

    return clientDetailsDTO;
};

export default router;
