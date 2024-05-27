import { executeQuery } from '../db/dbConnection.db.ts';

export const readItemFiles = async itemId => {
    return await executeQuery(
        `SELECT Id, FileName FROM ItemsFiles WHERE ItemId='${itemId}'`
    );
};
