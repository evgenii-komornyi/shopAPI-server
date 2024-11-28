import { UserFindRequest } from '../../models/requests/user/UserFindRequest.ts';
import { UserFindResponse } from '../../models/responses/user/UserFindResponse.ts';

export interface IUserService {
    getUserById(request: UserFindRequest): Promise<UserFindResponse>;
}
