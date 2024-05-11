import { executeQuery } from '../db/dbConnection.db.js';

export const create = async ({
    clientId,
    deliveryAddressId,
    deliveryType,
    deliveryComment,
    totalPrice,
    orderDate,
    orderStatus,
    UOrderId,
}) => {
    return await executeQuery(
        `INSERT INTO Orders (UOrderId, Status, OrderDate, ClientId, DeliveryAddressId, DeliveryComment, TotalPrice, DeliveryType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            UOrderId,
            orderStatus,
            orderDate,
            clientId,
            deliveryAddressId,
            deliveryComment,
            totalPrice,
            deliveryType,
        ]
    );
};

export const createCartInOrder = async ({
    orderId,
    itemId,
    itemPrice,
    itemQuantity,
}) => {
    return await executeQuery(
        `INSERT INTO OrdersItems (OrderId, ItemId, ItemPrice, ItemQuantity) VALUES (?, ?, ?, ?)`,
        [orderId, itemId, itemPrice, itemQuantity]
    );
};

export const readOrderById = async orderId => {
    return await executeQuery(
        `SELECT o.UOrderId, o.TotalPrice
            FROM OrdersItems as oi
        INNER JOIN Items as i
            ON oi.ItemId=i.Id
        INNER JOIN Orders as o
            ON oi.OrderId=o.Id
        WHERE o.UOrderId=${orderId};`
    );
};

export const readItemsInOrderById = async orderId => {
    return await executeQuery(
        `SELECT i.Name as ItemName, i.Sex, oi.ItemPrice, t.Name as Type, ifs.FileName, oi.ItemQuantity as Quantity
            FROM OrdersItems as oi
        INNER JOIN Items as i
            ON oi.ItemId=i.Id
        INNER JOIN Orders as o
            ON oi.OrderId=o.Id
        INNER JOIN ItemsFiles as ifs
            ON i.Id=ifs.itemId
        INNER JOIN Types as t
            ON i.TypeId=t.Id
        WHERE o.UOrderId=${orderId};`
    );
};
