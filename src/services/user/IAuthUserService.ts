import { AddressCreateRequest } from '../../models/requests/address/AddressCreateRequest.ts';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { UserCreateRequest } from '../../models/requests/user/UserCreateRequest.ts';
import { UserLoginRequest } from '../../models/requests/user/UserLoginRequest.ts';
import { RegisterResponse } from '../../models/responses/user/RegisterResponse.ts';
import { UserLoginResponse } from '../../models/responses/user/UserLoginResponse.ts';

export interface IAuthUserService {
    registerUser(
        userRequest: UserCreateRequest,
        clientRequest: ClientCreateRequest,
        addressRequest: AddressCreateRequest
    ): Promise<RegisterResponse>;
    sendVerificationEmail(email: string, userId: number): Promise<void>;
    verifyUser(userId: number, email: string): Promise<boolean>;
    loginUser(userRequest: UserLoginRequest): Promise<UserLoginResponse>;
}
