import { OrderCreateRequest } from '../../models/requests/order/OrderCreateRequest.ts';
import { OrderCreateResponse } from '../../models/responses/order/OrderCreateResponse.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';

export interface IOrderService {
    createOrder(orderRequest: OrderCreateRequest): Promise<OrderCreateResponse>;
    readOrder(
        userId: number,
        orderId: number,
        fullOrderInfo: boolean
    ): Promise<OrderFindResponse>;
    readOrders(userId: number): Promise<OrderFindResponse>;
}
