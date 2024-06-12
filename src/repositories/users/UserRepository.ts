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

    async isUserExists(email: string): Promise<boolean> {
        const userInDB = await executeQuery(
            `SELECT COUNT(*) AS Count FROM Users WHERE Email=?`,
            [email]
        );

        return userInDB[0].Count != 0;
    }

    async readUserByEmail(email: string): Promise<User> {
        _updateLastLoginAt(email);

        const userInDB = await executeQuery(
            `SELECT Id, UUserID, Email, Password, IsActive, IsVerified, LastLoginAt, CreatedAt, UpdatedAt FROM Users WHERE Email=?`,
            [email]
        );

        return userInDB[0] ? this._convertToUser(userInDB[0]) : null;
    }

    _convertToUser(userInDB: any): User {
        const user: User = new User(
            userInDB.Email,
            userInDB.Password,
            userInDB.UUserID,
            userInDB.CreatedAt
        );
        user.id = userInDB.Id;
        user.isActive = Boolean(userInDB.IsActive);
        user.isVerified = Boolean(userInDB.IsVerified);
        user.lastLoginAt = userInDB.LastLoginAt;
        user.updatedAt = userInDB.UpdatedAt;

        return user;
    }
}

const _updateLastLoginAt = async (email: string): Promise<void> => {
    const currentDateTime: Date = new Date();

    await executeQuery(`UPDATE Users SET LastLoginAt=? WHERE Email=?`, [
        currentDateTime,
        email,
    ]);
};
