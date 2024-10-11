import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { UserFindRequest } from '../../models/requests/user/UserFindRequest.ts';
import { UserFindResponse } from '../../models/responses/user/UserFindResponse.ts';
import { IUserRepository } from '../../repositories/users/IUserRepository.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { UserValidation } from '../../validation/user/UserValidation.ts';
import { IAddressService } from '../address/IAddressService.ts';
import { IClientService } from '../client/IClientService.ts';
import { IUserService } from './IUserService.ts';

export class UserService implements IUserService {
    private readonly _userRepository: IUserRepository;
    private readonly _clientService: IClientService;
    private readonly _addressService: IAddressService;
    private readonly _validation: UserValidation;

    constructor(
        repository: IUserRepository,
        clientService: IClientService,
        addressService: IAddressService,
        validation: UserValidation
    ) {
        this._userRepository = repository;
        this._clientService = clientService;
        this._addressService = addressService;
        this._validation = validation;
    }

    public async getUserById(
        userRequest: UserFindRequest
    ): Promise<UserFindResponse> {
        const response: UserFindResponse = new UserFindResponse();
        let databaseErrors: string[] = [];

        try {
            const existingUser = await this._userRepository.readUserById(
                userRequest.$UserId
            );

            const validationErrors: UserValidationErrors[] =
                this._validation.$FindUserValidation.validate(existingUser);

            if (validationErrors.length !== 0) {
                response.validationErrors = validationErrors;
            } else {
                response.foundUser = existingUser;
            }
        } catch (error) {
            databaseErrors = handleException(error);

            response.databaseErrors = databaseErrors;
        }

        return response;
    }
}
