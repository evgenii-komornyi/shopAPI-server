import { Connection } from 'mysql2/promise';
import { Order } from '../../models/Order.ts';
import { Client } from '../../models/Client.ts';
import { Item } from '../../models/Item.ts';

export interface IOrderRepository {
    createOrderForUnregisterUser(order: Order): Promise<Order>;
    createOrderForRegisterUser(
        order: Order,
        connection: Connection
    ): Promise<Order>;
    // createCartInOrder(
    //     cartInOrderRequest: CartInOrderRequest,
    //     connection?: Connection
    // ): Promise<void>;

    isClientExists(userId: number, connection: Connection): Promise<boolean>;
    isOrderExists(orderId: number, connection: Connection): Promise<boolean>;
    readClientInfoByUserId(
        userId: number,
        connection: Connection
    ): Promise<Client>;
    readOrderInfoByUserId(
        userId: number,
        connection: Connection
    ): Promise<number>;
    readOrderById(orderId: number, connection: Connection): Promise<Order>;
    readItemsInOrderById(
        orderId: number,
        connection: Connection
    ): Promise<Item[]>;
}
