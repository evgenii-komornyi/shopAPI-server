import { OrderValidationErrors } from '../../../validation/errors/OrderValidationErrors.ts';
import { Order } from '../../Order.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class OrderFindResponse extends BasicResponse<OrderValidationErrors> {
    private FoundOrder: Order;
    private FoundOrders: Order[];

    public set foundOrder(value: Order) {
        this.FoundOrder = value;
    }

    public get $FoundOrder(): Order {
        return this.FoundOrder;
    }

    public set foundOrders(value: Order[]) {
        this.FoundOrders = value;
    }

    public get $FoundOrders(): Order[] {
        return this.FoundOrders;
    }
}
