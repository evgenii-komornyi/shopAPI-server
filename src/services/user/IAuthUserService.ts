import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { UserLoginRequest } from '../../models/requests/user/UserLoginRequest.ts';
import { RegisterResponse } from '../../models/responses/user/RegisterResponse.ts';
import { UserLoginResponse } from '../../models/responses/user/UserLoginResponse.ts';

export interface IAuthUserService {
    registerUser(
        userRequest: UserCreateRequest,
        clientRequest: ClientCreateRequest
    ): Promise<RegisterResponse>;
    verifyUser(userId: number, email: string): Promise<boolean>;
    loginUser(userRequest: UserLoginRequest): Promise<UserLoginResponse>;
}
