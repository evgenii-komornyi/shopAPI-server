import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { OrderStatusResponse } from '../../models/responses/order-status/OrderStatusResponse.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';
import { OrderUpdateResponse } from '../../models/responses/order/OrderUpdateResponse.ts';

export interface IAdminOrderService {
    readOrders(): Promise<OrderFindResponse>;
    updateOrderStatus(
        orderRequest: OrderUpdateRequest
    ): Promise<OrderUpdateResponse>;
    readOrderStatuses(): Promise<OrderStatusResponse>;
    readOrderById(orderId: number): Promise<OrderFindResponse>;
}
