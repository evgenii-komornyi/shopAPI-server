import { executeQuery } from '../db/dbConnection.db.js';

export const readAllTypes = async () => {
    return await executeQuery(
        `SELECT t.Id, t.Name, tf.FileName, t.Description FROM Types as t INNER JOIN TypeFiles as tf ON t.Id = tf.TypeId;`
    );
};

export const readTypesByTypeName = async typeName => {
    return await executeQuery(`SELECT 
        f.Id as FishId, f.Name as FishName, f.Price, 
        fs.FileName,
        f.Discount, f.IsInStock, f.IsAvailable, 
        t.Name, t.Description, t.Id,
        f.Sex
        FROM Types as t 
        INNER JOIN Fish as f 
        ON t.Id=f.TypeId
        INNER JOIN FishFiles as fs
        ON f.Id=fs.fishId
        WHERE t.Name='${typeName}'`);
};
