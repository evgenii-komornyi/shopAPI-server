import { NextFunction, Request, Response } from 'express';

import generateUniqueId from 'generate-unique-id';
import {
    create as createOrderInDB,
    createCartInOrder as createCartInOrderInDB,
    readOrderById,
    readItemsInOrderById,
} from '../repositories/orders.repository.ts';
import { create as createClientInDB } from '../repositories/clients.repository.ts';
import { create as createAddressInDB } from '../repositories/addresses.repository.ts';
import { createConnection } from 'mysql2/promise.js';
import { config } from '../configs/config.ts';
import {
    closeConnection,
    commit,
    rollback,
    startTransaction,
} from '../db/dbConnection.db.ts';

import { OrderValidation } from '../validation/order/OrderValidation.ts';
import { CreateOrderRequestValidation } from '../validation/order/CreateOrderRequestValidation.ts';
import { OrderValidationErrors } from '../validation/errors/OrderValidationErrors.ts';
import { OrderCreateRequest } from '../models/requests/order/OrderCreateRequest.ts';
import { DeliveryType } from '../enums/DeliveryType.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';
import { FindOrderRequestValidation } from '../validation/order/FindOrderRequestValidation.ts';
import { OrderFindRequest } from '../models/requests/order/OrderFindRequest.ts';
import { OrderItem } from '../models/OrderItem.ts';
import { UpdateOrderRequestValidation } from '../validation/order/UpdateOrderRequestValidation.ts';
import { OrderStatus } from '../enums/OrderStatus.ts';

const _validator = new OrderValidation(
    new CreateOrderRequestValidation(),
    new FindOrderRequestValidation(),
    new UpdateOrderRequestValidation()
);

export const createOrder = async (
    { body }: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let connection;
    const { email, firstName, lastName, phoneNumber } = body.client;
    const { deliveryType, deliveryComment, deliveryPrice, deliveryCountry } =
        body.orderInfo;

    const orderCreateRequest: OrderCreateRequest = new OrderCreateRequest();
    orderCreateRequest.email = sanitize(trim(email));
    orderCreateRequest.firstName = sanitize(trim(firstName));
    orderCreateRequest.lastName = sanitize(trim(lastName));
    orderCreateRequest.phoneNumber = sanitize(trim(phoneNumber));
    orderCreateRequest.deliveryType = sanitize(trim(deliveryType));
    orderCreateRequest.deliveryComment = sanitize(trim(deliveryComment));
    orderCreateRequest.orderItems = _generateOrderItems(body.cart);

    if (deliveryType === DeliveryType.COURIER) {
        const { country, city, postalCode, address } = body.address;

        orderCreateRequest.country = sanitize(trim(country));
        orderCreateRequest.city = sanitize(trim(city));
        orderCreateRequest.postalCode = sanitize(trim(postalCode));
        orderCreateRequest.address = sanitize(trim(address));
        orderCreateRequest.deliveryPrice = sanitize(trim(deliveryPrice));
        orderCreateRequest.deliveryCountry = sanitize(trim(deliveryCountry));
    }

    const validationErrors: OrderValidationErrors[] =
        _validator.$CreateOrderRequestValidation.validate(orderCreateRequest);

    if (validationErrors.length === 0) {
        try {
            connection = await createConnection(config.development.db);
            await startTransaction(connection);
            const UClientId = generateUniqueId({
                length: 16,
                useLetters: false,
                useNumbers: true,
            });
            const clientId = await _createNewClientAndGetClientId(
                body.client,
                UClientId
            );

            let addressId = null;

            if (body.orderInfo.deliveryType !== DeliveryType.SHOP) {
                addressId = await _createNewAddressAndGetAddressId(
                    body.address,
                    clientId
                );
            }

            const UOrderId = generateUniqueId({ length: 9, useLetters: false });
            const orderId = await _createNewOrderAndGetOrderId(
                body.orderInfo,
                addressId,
                clientId,
                UOrderId
            );

            await _createCartInOrder(body.cart, orderId);

            await commit(connection);

            res.status(200).json({
                orderId: UOrderId,
                clientId: UClientId,
            });
        } catch (err) {
            await rollback(connection);
            await closeConnection(connection);

            res.json(err.message);

            next(err);
        }
    } else {
        res.status(400).json({ error: 'Bad request. Check inputs.' });
    }
};

const _generateOrderItems = (cart: any[]): OrderItem[] => {
    const orderItems: OrderItem[] = cart.map(item => {
        const orderItem: OrderItem = new OrderItem();
        orderItem.id = item.id;
        orderItem.quantity = item.quantity;
        orderItem.actualPrice = item.actualPrice;

        return orderItem;
    });

    return orderItems;
};

export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const {
        params: { clientId, orderId },
    }: Request = req;

    const orderFindRequest: OrderFindRequest = new OrderFindRequest();
    orderFindRequest.orderId = trim(orderId);
    orderFindRequest.clientId = trim(clientId);

    const validationErrors: OrderValidationErrors[] =
        _validator.$FindOrderRequestValidation.validate(orderFindRequest);

    if (validationErrors.length === 0) {
        try {
            const {
                params: { orderId },
            }: Request = req;
            const order = await readOrderById(orderId);
            const items = await readItemsInOrderById(orderId);

            res.status(200).json(_generateOrderDTO(order, items));
        } catch (error) {
            res.json(error.message);
            next(error);
        }
    } else {
        res.status(400).json({ error: 'Bad request. Check inputs.' });
    }
};

const _generateOrderDTO = (orderItems, items) => {
    return {
        orderId: orderItems[0].UOrderId,
        items: items.map(item => _generateItemDTO(item)),
    };
};

const _generateItemDTO = item => {
    return {
        itemName: item.ItemName,
        sex: item.Sex,
        itemPrice: item.ItemPrice,
        typeName: item.Type,
        fileName: item.FileName,
        quantity: item.Quantity,
    };
};

const _createAndReturnId = async (createFunction, createParams) => {
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

const _createNewClientAndGetClientId = async (clientRequest, UClientId) => {
    const { firstName, lastName, email, phoneNumber } = clientRequest;
    const creationDate = _getCurrentDateTime();

    const data = await _createAndReturnId(createClientInDB, {
        firstName,
        lastName,
        email,
        phoneNumber,
        creationDate,
        UClientId,
    });

    return data;
};

const _createNewAddressAndGetAddressId = async (addressRequest, clientId) => {
    const { country, city, address, postalCode } = addressRequest;

    return await _createAndReturnId(createAddressInDB, {
        country,
        city,
        address,
        postalCode,
        clientId,
    });
};

const _createNewOrderAndGetOrderId = async (
    orderRequest,
    deliveryAddressId,
    clientId,
    UOrderId
) => {
    const { deliveryType, deliveryComment, deliveryPrice, deliveryCountry } =
        orderRequest;
    const orderStatusId = OrderStatus.CREATED;
    const orderDate = _getCurrentDateTime();

    return await _createAndReturnId(createOrderInDB, {
        UOrderId,
        clientId,
        deliveryAddressId,
        deliveryType,
        deliveryComment,
        deliveryPrice,
        deliveryCountry,
        orderStatusId,
        orderDate,
    });
};

const _createCartInOrder = async (cart, orderId) => {
    cart.map(({ itemId, actualPrice, quantity }) =>
        _createAndReturnId(createCartInOrderInDB, {
            orderId,
            itemId,
            itemPrice: actualPrice,
            itemQuantity: quantity,
        })
    );
};

const _getCurrentDateTime = () =>
    new Date().toJSON().replace(/\..*$/, '').replace('T', ' ');
