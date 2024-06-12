import { User } from '../../models/User.ts';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    isUserExists(email): Promise<boolean>;
    readUserByEmail(email: string): Promise<User>;
}
