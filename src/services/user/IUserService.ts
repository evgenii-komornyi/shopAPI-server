import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { UserCreateResponse } from '../../models/responses/user/UserCreateResponse.ts';

export interface IUserService {
    registerUser(userRequest: UserCreateRequest): Promise<UserCreateResponse>;
}
