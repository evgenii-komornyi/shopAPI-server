import { Connection } from 'mysql2/promise';
import { Order } from '../../models/Order.ts';
import { IAdminOrderRepository } from './IAdminOrderRepository.ts';
import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { executeQuery } from '../../db/dbConnection.db.ts';
import { OrderStatus } from '../../models/OrderStatus.ts';
import { Client } from '../../models/Client.ts';
import { Address } from '../../models/Address.ts';
import { OrderItem } from '../../models/OrderItem.ts';
import { Item } from '../../models/Item.ts';

export class AdminOrderRepository implements IAdminOrderRepository {
    public async readOrderById(
        orderId: number,
        connection: Connection = undefined
    ): Promise<Order> {
        const orderQuery: string = `SELECT
            o.Id, o.UOrderId, o.StatusId, o.OrderDate,
            o.DeliveryType, o.DeliveryComment,
            o.DeliveryPrice, o.DeliveryCountry,
            o.DeliveryAddressId, o.ClientId,
            s.Status as OrderStatus,
            c.Email, c.PhoneNumber, c.FirstName, c.LastName,
            a.Country, a.City, a.PostalCode, a.Address
        FROM Orders as o
        INNER JOIN Status as s
            ON o.StatusId=s.Id
        INNER JOIN Clients as c
            ON c.Id=o.ClientId
        INNER JOIN Addresses as a
            ON a.Id=o.DeliveryAddressId
        WHERE o.Id=${orderId}`;

        const orderItemsQuery: string = `SELECT i.Id as Id, i.Name as ItemName, i.Sex, oi.ItemPrice, t.Name as Type, ifs.FileName, oi.ItemQuantity as Quantity
            FROM OrdersItems as oi
        INNER JOIN Items as i
            ON oi.ItemId=i.Id
        INNER JOIN Orders as o
            ON oi.OrderId=o.Id
        INNER JOIN ItemsFiles as ifs
            ON i.Id=ifs.itemId
        INNER JOIN Types as t
            ON i.TypeId=t.Id
        WHERE o.Id=${orderId};`;

        const [orderFromDB] =
            connection !== undefined
                ? await connection.execute(orderQuery)
                : await executeQuery(orderQuery);

        const itemsFromDB =
            connection !== undefined
                ? await connection.execute(orderItemsQuery)
                : await executeQuery(orderItemsQuery);

        const order: Order = this._createOrder(
            Array.isArray(orderFromDB) ? orderFromDB[0] : orderFromDB,
            true
        );
        order.orderItems = this._createItems(
            connection ? itemsFromDB[0] : itemsFromDB
        );

        return order;
    }

    public async readAllOrders(connection: Connection): Promise<Order[]> {
        const [ordersInBD] = await connection.execute(
            `SELECT o.Id, o.UOrderId, o.StatusId, o.OrderDate,
            o.DeliveryType, o.DeliveryComment,
            o.DeliveryPrice, o.DeliveryCountry,
                o.DeliveryAddressId, o.ClientId,
                s.Status as OrderStatus
                FROM Orders as o
                INNER JOIN Status as s
                ON o.StatusId=s.Id`
            // WHERE o.StatusId='${Status.CREATED}'`
        );

        return this._createOrders(ordersInBD);
    }

    public async updateStatus(request: OrderUpdateRequest): Promise<Order> {
        try {
            await executeQuery(`Update Orders SET StatusId=? WHERE Id=?`, [
                request.$StatusId,
                request.$OrderId,
            ]);
        } catch (e) {
            console.log(e);
        }

        return await this.readOrderById(request.$OrderId);
    }

    async readStatuses(): Promise<OrderStatus[]> {
        const statusesFromDB = await executeQuery(
            `SELECT Id, Status FROM Status`
        );

        return this._createStatuses(statusesFromDB);
    }

    private _createStatuses(statusesFromDB: any): OrderStatus[] {
        const statuses: OrderStatus[] = [];

        statusesFromDB.forEach(status =>
            statuses.push(this._createStatus(status))
        );

        return statuses;
    }

    private _createStatus(status: any): OrderStatus {
        return new OrderStatus(status.Id, status.Status);
    }

    private _createOrders(ordersFromDB: any): Order[] {
        const orders: Order[] = [];
        ordersFromDB.forEach(orderItem =>
            orders.push(this._createOrder(orderItem))
        );

        return orders;
    }

    private _createOrder(
        orderFromDB: any,
        withAdditionalInfo: boolean = false
    ): Order {
        const order: Order = new Order();

        order.id = orderFromDB.Id;
        order.uOrderId = orderFromDB.UOrderId;
        order.orderDate = orderFromDB.OrderDate;
        order.clientId = orderFromDB.ClientId;
        order.deliveryAddressId = orderFromDB.DeliveryAddressId;
        order.statusId = orderFromDB.StatusId;
        order.status = orderFromDB.OrderStatus;
        order.deliveryType = orderFromDB.DeliveryType;
        order.deliveryComment = orderFromDB.DeliveryComment;
        order.deliveryPrice = orderFromDB.DeliveryPrice;
        order.deliveryCountry = orderFromDB.DeliveryCountry;

        if (withAdditionalInfo) {
            order.client = this._createClient(orderFromDB);
        }

        return order;
    }

    private _createClient(orderFromDB: any): Client {
        const client: Client = new Client(orderFromDB.Email);

        client.id = orderFromDB.ClientId;
        client.phoneNumber = orderFromDB.PhoneNumber;
        client.firstName = orderFromDB.FirstName;
        client.lastName = orderFromDB.LastName;
        client.address = this._createAddress(orderFromDB);

        return client;
    }

    private _createAddress(orderFromDB: any): Address {
        const address: Address = new Address();

        address.country = orderFromDB.Country;
        address.city = orderFromDB.City;
        address.postalCode = orderFromDB.PostalCode;
        address.address = orderFromDB.Address;

        return address;
    }

    private _createItems(itemsInOrderFromDB: any): Item[] {
        const items: Item[] = [];

        itemsInOrderFromDB.forEach(dbItem => {
            const item: Item = new Item();
            item.id = dbItem.Id;
            item.itemName = dbItem.ItemName;
            item.sex = dbItem.Sex;
            item.itemPrice = dbItem.ItemPrice;
            item.type = dbItem.Type;
            item.fileName = dbItem.FileName;
            item.quantity = dbItem.Quantity;

            items.push(item);
        });

        return items;
    }
}
