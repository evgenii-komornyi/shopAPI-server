import { User } from '../../models/User.ts';
import { IUserRepository } from './IUserRepository.ts';
import { executeQuery } from '../../db/dbConnection.db.ts';
import { Connection } from 'mysql2/promise';
import { Client } from '../../models/Client.ts';

export class UserRepository implements IUserRepository {
    public async createUser(user: User): Promise<User> {
        const createdUser = await this._insertUser(user);
        user.id = createdUser.insertId;

        return user;
    }

    public async createUserWithConnection(
        connection: Connection,
        user: User
    ): Promise<User> {
        const [createdUser] = await this._insertUser(user, connection);
        user.id = createdUser.insertId;

        return user;
    }

    public async updateUserVerification(userId: number): Promise<void> {
        const userInDB = await executeQuery(`SELECT * FROM Users WHERE Id=?`, [
            userId,
        ]);

        if (userInDB[0]) {
            await executeQuery(`UPDATE Users SET IsVerified=? WHERE Id=?`, [
                true,
                userId,
            ]);
        }
    }

    public async isUserExists(
        email: string,
        userId: number | undefined = undefined
    ): Promise<boolean> {
        const userInDB = await executeQuery(
            !userId
                ? `SELECT COUNT(*) AS Count FROM Users WHERE Email=?`
                : `SELECT COUNT(*) AS Count FROM Users WHERE Id=? AND Email=?`,
            !userId ? [email] : [userId, email]
        );

        return userInDB[0].Count != 0;
    }

    public async readUserByEmail(email: string): Promise<User> {
        this._updateLastLoginAt(email);

        const userInDB = await executeQuery(
            `SELECT u.Id AS UserId, u.UUserID, u.Email, u.Password, c.Id AS ClientId, c.FirstName, c.LastName, c.UClientId
                FROM Users as u
                INNER JOIN Clients AS c
                    ON c.UserId=u.Id
                WHERE u.Email=? AND u.IsActive=1 AND u.IsVerified=1`,
            [email]
        );

        return userInDB[0] ? this._convertToUser(userInDB[0]) : null;
    }

    public async readUserById(id: number): Promise<User> {
        const userInDB = await executeQuery(
            `SELECT u.Id AS UserId, u.UUserID, u.Email, u.IsActive, u.IsVerified, u.LastLoginAt, u.CreatedAt, u.UpdatedAt, c.Id AS ClientId, c.FirstName, c.LastName, c.PhoneNumber, c.CreationDate, c.UpdateDate, c.UClientId
                FROM Users as u
                INNER JOIN Clients AS c
                    ON c.UserId=u.Id
                WHERE u.Id=? AND u.IsActive=1 AND u.IsVerified=1`,
            [id]
        );

        return userInDB[0] ? this._convertToUser(userInDB[0]) : null;
    }

    private async _insertUser(
        user: User,
        connection: Connection = undefined
    ): Promise<any> {
        return await connection.execute(
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
    }

    private _convertToUser(userInDB: any): User {
        const user: User = new User(
            userInDB.Email,
            userInDB.Password,
            userInDB.UUserID,
            userInDB.CreatedAt
        );
        user.id = userInDB.UserId;
        user.isActive = Boolean(userInDB.IsActive);
        user.isVerified = Boolean(userInDB.IsVerified);
        user.lastLoginAt = userInDB.LastLoginAt;
        user.updatedAt = userInDB.UpdatedAt;
        user.client = this._convertToClient(userInDB);

        return user;
    }

    private _convertToClient(userInDB: any): Client {
        const client: Client = new Client(userInDB.Email);
        client.id = userInDB.ClientId;
        client.firstName = userInDB.FirstName;
        client.lastName = userInDB.LastName;
        client.phoneNumber = userInDB.PhoneNumber;
        client.creationDate = userInDB.CreationDate;
        client.updateDate = userInDB.UpdatedDate;
        client.uClientId = userInDB.UClientId;

        return client;
    }

    private _updateLastLoginAt = async (email: string): Promise<void> => {
        const currentDateTime: Date = new Date();

        await executeQuery(`UPDATE Users SET LastLoginAt=? WHERE Email=?`, [
            currentDateTime,
            email,
        ]);
    };
}
