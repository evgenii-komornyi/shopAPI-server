import { executeQuery } from '../db/dbConnection.db.js';

export const create = async ({
    country,
    city,
    address,
    postalCode,
    clientId,
}) => {
    return await executeQuery(
        `INSERT INTO Addresses (Country, City, Address, PostalCode, ClientId) VALUES (?, ?, ?, ?, ?)`,
        [country, city, address, postalCode, clientId]
    );
};
