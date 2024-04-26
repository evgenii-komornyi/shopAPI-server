import { executeQuery } from '../db/dbConnection.db.js';

export const readAllFish = async () => {
    return await executeQuery(`SELECT 
            f.Id, f.Name, t.Name as Type, f.Price, f.Discount, f.IsAvailable, f.IsInStock, f.Sex
        FROM Fish as f 
        INNER JOIN Types as t
        ON f.TypeId=t.Id;`);
};

export const readFishById = async fishId => {
    return await executeQuery(`SELECT 
            f.Id, f.Name, t.Name as Type, f.Price, f.Discount, f.Description, f.IsInStock, f.Sex
        FROM Fish as f 
        INNER JOIN Types as t
        ON f.TypeId=t.Id
        WHERE f.Id=${fishId};`);
};
