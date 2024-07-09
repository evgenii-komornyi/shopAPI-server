import { Connection } from 'mysql2/promise';
import { User } from '../../models/User.ts';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    createUserWithConnection(connection: Connection, user: User): Promise<User>;
    isUserExists(email): Promise<boolean>;
    readUserByEmail(email: string): Promise<User>;
    readUserById(id: number): Promise<User>;
}
