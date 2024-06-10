import { User } from '../../models/User.ts';
import { IUserRepository } from './IUserRepository.ts';
import { executeQuery } from '../../db/dbConnection.db.ts';

export class UserRepository implements IUserRepository {
    async createUser(user: User): Promise<User> {
        const createdUser = await executeQuery(
            `INSERT INTO Users (UUserId, Email, Password, CreatedAt, UpdatedAt, LastLoginAt, IsActive, IsVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.$UUserId,
                user.$Email,
                user.$Password,
                user.$CreatedAt,
                user.$UpdatedAt,
                user.$LastLoginAt,
                user.$IsActive,
                user.$IsVerified,
            ]
        );
        user.id = createdUser.insertId;

        return user;
    }
}
