import { OrderValidationErrors } from '../../../validation/errors/OrderValidationErrors.ts';
import { Order } from '../../Order.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class OrderCreateResponse extends BasicResponse<OrderValidationErrors> {
    private CreatedOrder: Order;

    public set createdOrder(order: Order) {
        this.CreatedOrder = order;
    }

    public get $CreatedOrder(): Order {
        return this.CreatedOrder;
    }
}
