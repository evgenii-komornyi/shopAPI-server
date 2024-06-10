import { User } from '../../models/User.ts';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
}
