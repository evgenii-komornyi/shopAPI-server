import { OrderValidationErrors } from '../../../validation/errors/OrderValidationErrors.ts';
import { OrderStatus } from '../../OrderStatus.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class OrderStatusResponse extends BasicResponse<OrderValidationErrors> {
    private OrderStatuses: OrderStatus[];

    public set orderStatuses(statuses: OrderStatus[]) {
        this.OrderStatuses = statuses;
    }

    public get $OrderStatuses(): OrderStatus[] {
        return this.OrderStatuses;
    }
}
