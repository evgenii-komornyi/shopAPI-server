import { OrderValidationErrors } from '../../../validation/errors/OrderValidationErrors.ts';
import { Order } from '../../Order.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class OrderUpdateResponse extends BasicResponse<OrderValidationErrors> {
    private UpdatedOrder: Order;

    public set updatedOrder(order: Order) {
        this.UpdatedOrder = order;
    }

    public get $UpdatedOrder(): Order {
        return this.UpdatedOrder;
    }
}
