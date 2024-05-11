import generateUniqueId from 'generate-unique-id';
import {
    create as createOrderInDB,
    createCartInOrder as createCartInOrderInDB,
    readOrderById,
    readItemsInOrderById,
} from '../repositories/orders.repository.js';
import { create as createClientInDB } from '../repositories/clients.repository.js';
import { create as createAddressInDB } from '../repositories/addresses.repository.js';
import { createConnection } from 'mysql2/promise.js';
import { config } from '../db/config.js';
import {
    closeConnection,
    commit,
    rollback,
    startTransaction,
} from '../db/dbConnection.db.js';
import { readItemFiles } from '../repositories/files.repository.js';

export const createOrder = async ({ body }, res, next) => {
    let connection;

    try {
        connection = await createConnection(config.db);
        await startTransaction(connection);
        const UClientId = generateUniqueId({
            length: 16,
            useLetters: false,
            useNumbers: true,
        });
        const clientId = await createNewClientAndGetClientId(
            body.client,
            UClientId
        );

        let addressId = null;

        if (body.orderInfo.deliveryType !== 'shop') {
            addressId = await createNewAddressAndGetAddressId(
                body.address,
                clientId
            );
        }

        const UOrderId = generateUniqueId({ length: 9, useLetters: false });
        const orderId = await createNewOrderAndGetOrderId(
            body.orderInfo,
            addressId,
            clientId,
            UOrderId
        );

        await createCartInOrder(body.cart, orderId);

        await commit(connection);

        res.json({ orderId: UOrderId, clientId: UClientId });
    } catch (err) {
        await rollback(connection);
        await closeConnection(connection);

        res.json(err.message);

        next(err);
    }
};

export const getOrderById = async (
    { params: { clientId, orderId } },
    res,
    next
) => {
    try {
        const order = await readOrderById(orderId);
        const items = await readItemsInOrderById(orderId);

        res.json(generateOrderDTO(order, items));
    } catch (error) {
        res.json(error.message);
        next(error);
    }
};

const generateOrderDTO = (orderItems, items) => {
    return {
        orderId: orderItems[0].UOrderId,
        items: items.map(item => generateItemDTO(item)),
        totalPrice: orderItems[0].TotalPrice,
    };
};

const generateItemDTO = item => {
    return {
        itemName: item.ItemName,
        sex: item.Sex,
        itemPrice: item.ItemPrice,
        typeName: item.Type,
        fileName: item.FileName,
        quantity: item.Quantity,
    };
};

const createAndReturnId = async (createFunction, createParams) => {
    try {
        const createdItem = await createFunction(createParams);

        if (createdItem) {
            const { insertId } = createdItem;
            return insertId;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
};

const createNewClientAndGetClientId = async (clientRequest, UClientId) => {
    const { firstName, lastName, email, phoneNumber } = clientRequest;
    const creationDate = getCurrentDateTime();

    const data = await createAndReturnId(createClientInDB, {
        firstName,
        lastName,
        email,
        phoneNumber,
        creationDate,
        UClientId,
    });

    return data;
};

const createNewAddressAndGetAddressId = async (addressRequest, clientId) => {
    const { country, city, address, postalCode } = addressRequest;

    return await createAndReturnId(createAddressInDB, {
        country,
        city,
        address,
        postalCode,
        clientId,
    });
};

const createNewOrderAndGetOrderId = async (
    orderRequest,
    deliveryAddressId,
    clientId,
    UOrderId
) => {
    const { deliveryType, deliveryComment, totalPrice } = orderRequest;
    const orderStatus = 'pending';
    const orderDate = getCurrentDateTime();

    return await createAndReturnId(createOrderInDB, {
        UOrderId,
        clientId,
        deliveryAddressId,
        deliveryType,
        deliveryComment,
        orderStatus,
        orderDate,
        totalPrice,
    });
};

const createCartInOrder = async (cart, orderId) => {
    cart.map(({ itemId, actualPrice, quantity }) =>
        createAndReturnId(createCartInOrderInDB, {
            orderId,
            itemId,
            itemPrice: actualPrice,
            itemQuantity: quantity,
        })
    );
};

const getCurrentDateTime = () =>
    new Date().toJSON().replace(/\..*$/, '').replace('T', ' ');
