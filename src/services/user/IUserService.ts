import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { UserLoginRequest } from '../../models/requests/user/UserLoginRequest.ts';
import { UserCreateResponse } from '../../models/responses/user/UserCreateResponse.ts';
import { UserLoginResponse } from '../../models/responses/user/UserLoginResponse.ts';

export interface IUserService {
    registerUser(userRequest: UserCreateRequest): Promise<UserCreateResponse>;
    loginUser(userRequest: UserLoginRequest): Promise<UserLoginResponse>;
}
