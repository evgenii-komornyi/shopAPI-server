import { executeQuery } from '../db/dbConnection.db.js';

export const readAllItems = async () => {
    return await executeQuery(`SELECT 
            i.Id, i.Name, t.Name as Type, i.Price, i.Discount, i.IsAvailable, i.IsInStock, i.Sex
        FROM Items as i 
        INNER JOIN Types as t
        ON i.TypeId=t.Id;`);
};

export const readItemById = async itemId => {
    return await executeQuery(`SELECT 
            i.Id, i.Name, t.Name as Type, i.Price, i.Discount, i.Description, i.IsInStock, i.Sex
        FROM Items as i
        INNER JOIN Types as t
        ON i.TypeId=t.Id
        WHERE i.Id=${itemId};`);
};
