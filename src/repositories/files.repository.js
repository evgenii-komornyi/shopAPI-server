import { executeQuery } from '../db/dbConnection.db.js';

export const readItemFiles = async itemId => {
    return await executeQuery(
        `SELECT Id, FileName FROM ItemsFiles WHERE ItemId='${itemId}'`
    );
};
