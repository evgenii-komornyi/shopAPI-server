import { executeQuery } from '../db/dbConnection.db.js';

export const readFishFiles = async fishId => {
    return await executeQuery(
        `SELECT Id, FileName FROM FishFiles WHERE FishId='${fishId}'`
    );
};
