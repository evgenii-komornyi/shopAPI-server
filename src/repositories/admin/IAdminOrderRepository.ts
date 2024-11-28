import { Connection } from 'mysql2/promise';
import { Order } from '../../models/Order.ts';
import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { OrderStatus } from '../../models/OrderStatus.ts';

export interface IAdminOrderRepository {
    readAllOrders(connection: Connection): Promise<Order[]>;
    readOrderById(orderId: number, connection: Connection): Promise<Order>;

    updateStatus(request: OrderUpdateRequest): Promise<Order>;
    readStatuses(): Promise<OrderStatus[]>;
}
