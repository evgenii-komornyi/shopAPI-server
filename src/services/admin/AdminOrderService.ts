import { Connection } from 'mysql2/promise';
import { ITransactionManager } from '../../managers/ITransactionManager.ts';
import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { IAdminOrderRepository } from '../../repositories/admin/IAdminOrderRepository.ts';
import { IAdminOrderService } from './IAdminOrderService.ts';
import { Order } from '../../models/Order.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';
import { OrderUpdateResponse } from '../../models/responses/order/OrderUpdateResponse.ts';
import { OrderValidation } from '../../validation/order/OrderValidation.ts';
import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { OrderValidationErrors } from '../../validation/errors/OrderValidationErrors.ts';
import { OrderStatusResponse } from '../../models/responses/order-status/OrderStatusResponse.ts';
import { OrderStatus } from '../../models/OrderStatus.ts';

export class AdminOrderService implements IAdminOrderService {
    private readonly _orderRepository: IAdminOrderRepository;
    private readonly _transactionManager: ITransactionManager;
    private readonly _orderValidation: OrderValidation;

    constructor(
        orderRepository: IAdminOrderRepository,
        transactionManager: ITransactionManager,
        orderValidation: OrderValidation
    ) {
        this._orderRepository = orderRepository;
        this._transactionManager = transactionManager;
        this._orderValidation = orderValidation;
    }

    public async readOrders(): Promise<OrderFindResponse> {
        const orderResponse: OrderFindResponse = new OrderFindResponse();

        try {
            await this._transactionManager.startTransaction();
            const connection: Connection =
                this._transactionManager.getConnection();

            const orders: Order[] = await this._orderRepository.readAllOrders(
                connection
            );

            if (orders) {
                orderResponse.foundOrders = orders;

                await this._transactionManager.commit();
            }
        } catch (error) {
            await this._transactionManager.rollback();
            orderResponse.databaseErrors = handleException(error);
        }

        return orderResponse;
    }

    public async updateOrderStatus(
        orderRequest: OrderUpdateRequest
    ): Promise<OrderUpdateResponse> {
        const response: OrderUpdateResponse = new OrderUpdateResponse();

        const validationErrors: OrderValidationErrors[] =
            this._orderValidation.$UpdateOrderRequestValidation.validate(
                orderRequest
            );

        if (validationErrors.length !== 0) {
            response.validationErrors = validationErrors;
        } else {
            try {
                const updatedOrder: Order =
                    await this._orderRepository.updateStatus(orderRequest);

                response.updatedOrder = updatedOrder;
            } catch (error) {
                response.databaseErrors = handleException(error);
                console.log(error);
            }
        }

        return response;
    }

    public async readOrderStatuses(): Promise<OrderStatusResponse> {
        const response: OrderStatusResponse = new OrderStatusResponse();

        try {
            const statuses: OrderStatus[] =
                await this._orderRepository.readStatuses();

            if (statuses && statuses.length > 0) {
                response.orderStatuses = statuses;
            }
        } catch (error) {
            console.log(error);
        }

        return response;
    }

    public async readOrderById(orderId: number): Promise<OrderFindResponse> {
        const orderResponse: OrderFindResponse = new OrderFindResponse();

        try {
            await this._transactionManager.startTransaction();
            const connection: Connection =
                this._transactionManager.getConnection();

            const order: Order = await this._orderRepository.readOrderById(
                orderId,
                connection
            );

            if (order) {
                orderResponse.foundOrder = order;

                await this._transactionManager.commit();
            }
        } catch (error) {
            await this._transactionManager.rollback();
            orderResponse.databaseErrors = handleException(error);
        } finally {
            if (this._transactionManager) {
                await this._transactionManager.rollback();
            }
        }

        return orderResponse;
    }
}
