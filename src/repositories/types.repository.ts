import { executeQuery } from '../db/dbConnection.db.ts';

export const readAllTypes = async () => {
    return await executeQuery(
        `SELECT t.Id, t.Name, tf.FileName, t.Description FROM Types as t INNER JOIN TypeFiles as tf ON t.Id = tf.TypeId;`
    );
};

export const readTypesByTypeName = async typeName => {
    return await executeQuery(`SELECT 
        i.Id as ItemId, i.Name as ItemName, i.Price, 
        ifs.FileName,
        i.Discount, i.IsInStock, i.IsAvailable, 
        t.Name, t.Description, t.Id,
        i.Sex
        FROM Types as t 
        INNER JOIN Items as i 
        ON t.Id=i.TypeId
        INNER JOIN ItemsFiles as ifs
        ON i.Id=ifs.itemId
        WHERE t.Name='${typeName}'`);
};
