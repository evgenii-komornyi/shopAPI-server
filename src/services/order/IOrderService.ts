import { OrderCreateRequest } from '../../models/requests/order/OrderCreateRequest.ts';
import { OrderCreateResponse } from '../../models/responses/order/OrderCreateResponse.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';

export interface IOrderService {
    createOrder(orderRequest: OrderCreateRequest): Promise<OrderCreateResponse>;
    readOrder(userId: number, orderId: number): Promise<OrderFindResponse>;
}
