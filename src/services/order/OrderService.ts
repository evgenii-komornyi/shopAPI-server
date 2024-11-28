import { Connection } from 'mysql2/promise';
import { ITransactionManager } from '../../managers/ITransactionManager.ts';
import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { OrderCreateRequest } from '../../models/requests/order/OrderCreateRequest.ts';
import { OrderCreateResponse } from '../../models/responses/order/OrderCreateResponse.ts';
import { IOrderRepository } from '../../repositories/orders/IOrderRepository.ts';
import { OrderValidationErrors } from '../../validation/errors/OrderValidationErrors.ts';
import { OrderValidation } from '../../validation/order/OrderValidation.ts';
import { IOrderService } from './IOrderService.ts';
import { Order } from '../../models/Order.ts';
import generateUniqueId from 'generate-unique-id';
import { OrderStatus } from '../../enums/OrderStatus.ts';
import { Client } from '../../models/Client.ts';
import { DeliveryType } from '../../enums/DeliveryType.ts';
import { Item } from '../../models/Item.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';

export class OrderService implements IOrderService {
    private readonly _orderRepository: IOrderRepository;
    private readonly _orderValidation: OrderValidation;
    private readonly _transactionManager: ITransactionManager;

    constructor(
        orderRepository: IOrderRepository,
        orderValidation: OrderValidation,
        transactionManager: ITransactionManager
    ) {
        this._orderRepository = orderRepository;
        this._orderValidation = orderValidation;
        this._transactionManager = transactionManager;
    }

    public async createOrder(
        orderRequest: OrderCreateRequest
    ): Promise<OrderCreateResponse> {
        const response: OrderCreateResponse = new OrderCreateResponse();

        await this._transactionManager.startTransaction();

        const connection: Connection = this._transactionManager.getConnection();

        const validationErrors: OrderValidationErrors[] =
            this._orderValidation.$CreateOrderRequestValidation.validate(
                orderRequest
            );

        if (validationErrors.length !== 0) {
            response.validationErrors = validationErrors;
        } else {
            try {
                const order: Order = new Order();
                const uOrderId: string = generateUniqueId({
                    length: 9,
                    useLetters: false,
                    useNumbers: true,
                });
                order.uOrderId = uOrderId;
                order.orderDate = new Date();
                order.statusId = OrderStatus.CREATED;
                order.deliveryComment = orderRequest.$DeliveryComment;
                order.deliveryType = orderRequest.$DeliveryType as DeliveryType;
                order.deliveryPrice = orderRequest.$DeliveryPrice
                    ? orderRequest.$DeliveryPrice
                    : null;
                order.deliveryCountry = orderRequest.$DeliveryCountry
                    ? orderRequest.$DeliveryCountry
                    : null;

                const isClientExists =
                    await this._orderRepository.isClientExists(
                        orderRequest.$UserId,
                        connection
                    );

                if (isClientExists) {
                    const client: Client =
                        await this._orderRepository.readClientInfoByUserId(
                            orderRequest.$UserId,
                            connection
                        );

                    order.deliveryAddressId = client.$Address.$Id;
                    order.clientId = client.$Id;
                    order.client = client;
                    order.orderItems = orderRequest.$OrderItems;

                    const createdOrder: Order =
                        await this._orderRepository.createOrderForRegisterUser(
                            order,
                            connection
                        );

                    response.createdOrder = createdOrder;
                }

                this._transactionManager.commit();
            } catch (error) {
                this._transactionManager.rollback();
                response.databaseErrors = handleException(error);
            }
        }

        return response;
    }

    public async readOrder(
        userId: number,
        orderId: number,
        fullOrderInfo: boolean
    ): Promise<OrderFindResponse> {
        const orderResponse: OrderFindResponse = new OrderFindResponse();
        const validationErrors: OrderValidationErrors[] = [];

        if (!userId) {
            validationErrors.push(OrderValidationErrors.NO_SEARCH_CRITERIA);
        }

        if (validationErrors.length > 0) {
            orderResponse.validationErrors = validationErrors;
            return orderResponse;
        }

        try {
            await this._transactionManager.startTransaction();
            const connection: Connection =
                this._transactionManager.getConnection();

            const isClientExists = await this._orderRepository.isClientExists(
                userId,
                connection
            );

            if (!isClientExists) {
                validationErrors.push(
                    OrderValidationErrors.ORDER_DOES_NOT_EXISTS
                );
                orderResponse.validationErrors = validationErrors;
                return orderResponse;
            }

            const isOrderExists = await this._orderRepository.isOrderExists(
                orderId,
                connection,
                userId
            );
            if (!isOrderExists) {
                validationErrors.push(
                    OrderValidationErrors.ORDER_DOES_NOT_EXISTS
                );
                orderResponse.validationErrors = validationErrors;
                return orderResponse;
            }

            const order = fullOrderInfo
                ? await this._orderRepository.readOrderById(
                      orderId,
                      connection,
                      userId
                  )
                : await this._orderRepository.readOrderById(
                      orderId,
                      connection
                  );

            if (!fullOrderInfo) {
                const items = await this._orderRepository.readItemsInOrderById(
                    orderId,
                    connection
                );
                order.orderItems = items;
            }

            orderResponse.foundOrder = order;
            await this._transactionManager.commit();
        } catch (error) {
            await this._transactionManager.rollback();
            orderResponse.databaseErrors = handleException(error);
            console.error(error);
        } finally {
            if (this._transactionManager) {
                await this._transactionManager.rollback();
            }
        }

        return orderResponse;
    }

    public async readOrders(userId: number): Promise<OrderFindResponse> {
        const orderResponse: OrderFindResponse = new OrderFindResponse();

        try {
            orderResponse.foundOrders = await this._orderRepository.readOrders(
                userId
            );
        } catch (error) {
            orderResponse.databaseErrors = handleException(error);
        }

        return orderResponse;
    }
}
