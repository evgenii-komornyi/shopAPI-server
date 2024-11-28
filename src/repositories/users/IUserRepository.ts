import { Connection } from 'mysql2/promise';
import { User } from '../../models/User.ts';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    createUserWithConnection(connection: Connection, user: User): Promise<User>;
    updateUserVerification(userId: number): Promise<void>;
    isUserExists(email: string, userId: number | undefined): Promise<boolean>;
    readUserByEmail(email: string): Promise<User>;
    readUserById(id: number): Promise<User>;
}
