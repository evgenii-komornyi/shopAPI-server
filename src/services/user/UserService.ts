import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { UserFindRequest } from '../../models/requests/user/UserFindRequest.ts';
import { UserFindResponse } from '../../models/responses/user/UserFindResponse.ts';
import { IUserRepository } from '../../repositories/users/IUserRepository.ts';
import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { UserValidation } from '../../validation/user/UserValidation.ts';
import { IUserService } from './IUserService.ts';

export class UserService implements IUserService {
    private readonly _repository: IUserRepository;
    private readonly _validation: UserValidation;

    constructor(repository: IUserRepository, validation: UserValidation) {
        this._repository = repository;
        this._validation = validation;
    }

    async getUserById(userRequest: UserFindRequest): Promise<UserFindResponse> {
        const response: UserFindResponse = new UserFindResponse();
        let databaseErrors: string[] = [];

        try {
            const existingUser = await this._repository.readUserById(
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
