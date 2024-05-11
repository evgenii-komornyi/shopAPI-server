import { executeQuery } from '../db/dbConnection.db.js';

export const create = async ({
    firstName,
    lastName,
    email,
    phoneNumber,
    creationDate,
    UClientId,
}) => {
    return await executeQuery(
        `INSERT INTO Clients (UClientId, FirstName, LastName, Email, PhoneNumber, CreationDate, UpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            UClientId,
            firstName,
            lastName,
            email,
            phoneNumber,
            creationDate,
            creationDate,
        ]
    );
};
