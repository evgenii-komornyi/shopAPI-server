import { Connection } from 'mysql2/promise';
import { executeQuery } from '../../db/dbConnection.db.ts';
import { Order } from '../../models/Order.ts';
import { IOrderRepository } from './IOrderRepository.ts';
import { CartInOrderRequest } from '../../models/requests/cart/CartInOrderRequest.ts';
import { Client } from '../../models/Client.ts';
import { Address } from '../../models/Address.ts';
import { OrderItem } from '../../models/OrderItem.ts';
import { Item } from '../../models/Item.ts';

export class OrderRepository implements IOrderRepository {
    public async createOrderForUnregisterUser(order: Order): Promise<Order> {
        const createdOrder = await this._insertOrder(order);
        order.id = createdOrder.insertId;

        return order;
    }

    public async createOrderForRegisterUser(
        order: Order,
        connection: Connection
    ): Promise<Order> {
        try {
            const [createdOrder] = await this._insertOrder(order, connection);
            order.id = createdOrder.insertId;

            await this._insertCartInOrderItems(
                order.$OrderItems,
                order.$Id,
                connection
            );

            return order;
        } catch (e) {
            console.log(e);
        }
    }

    // public async createCartInOrder(
    //     request: CartInOrderRequest,
    //     connection?: Connection
    // ): Promise<void> {
    //     const queryWithParams = {
    //         query: `INSERT INTO OrdersItems (OrderId, ItemId, ItemPrice, ItemQuantity) VALUES (?, ?, ?, ?)`,
    //         params: [
    //             request.$OrderId,
    //             request.$ItemId,
    //             request.$ItemPrice,
    //             request.$ItemQuantity,
    //         ],
    //     };
    //     connection
    //         ? await connection.execute(
    //               queryWithParams.query,
    //               queryWithParams.params
    //           )
    //         : executeQuery(queryWithParams.query, queryWithParams.params);
    // }

    public async isClientExists(
        userId: number,
        connection: Connection
    ): Promise<boolean> {
        const [clientFromBD] = await connection.execute(
            `SELECT COUNT(Id) AS Count FROM Clients WHERE UserId=${userId}`
        );

        return clientFromBD[0].Count > 0;
    }

    public async isOrderExists(
        orderId: number,
        connection: Connection,
        userId: number
    ): Promise<boolean> {
        const [orderFromBD] = await connection.execute(
            `SELECT COUNT(o.Id) AS Count FROM Orders as o INNER JOIN Clients as c ON o.ClientId=c.Id WHERE UOrderId=? AND c.UserId=?`,
            [orderId, userId]
        );

        return orderFromBD[0].Count > 0;
    }

    public async readClientInfoByUserId(
        userId: number,
        connection: Connection
    ): Promise<Client> {
        const [clientFromDB] = await connection.execute(
            `SELECT 
                c.Id, c.Email, c.PhoneNumber, c.FirstName, c.LastName, c.UClientId, 
                a.Id AS AddressId, a.Country, a.City, a.PostalCode, a.Address 
            FROM Clients AS c 
            INNER JOIN Addresses AS a 
                ON a.ClientId=c.Id 
            WHERE UserId=${userId}`
        );

        const client: Client = this._createClient(clientFromDB[0]);
        client.userId = userId;

        return client;
    }

    public async readOrderInfoByUserId(
        userId: number,
        connection: Connection
    ): Promise<number> {
        const [orderInfoFromDB] = await connection.execute(
            `SELECT o.UOrderId FROM Clients AS c 
            INNER JOIN Orders as o
                ON o.ClientId=c.Id
            WHERE c.UserId=${userId}`
        );

        return orderInfoFromDB[0].UOrderId;
    }

    public async readOrderById(
        orderId: number,
        connection: Connection,
        userId?: number
    ): Promise<Order> {
        return !userId
            ? this._getCreatedOrder(orderId, connection)
            : this._getOrderByIdForRegisteredUser(orderId, connection, userId);
    }

    private async _getCreatedOrder(
        orderId: number,
        connection: Connection
    ): Promise<Order> {
        const [orderFromDB] = await connection.execute(
            `SELECT o.UOrderId, s.Status, o.OrderDate, o.DeliveryType, o.DeliveryComment, o.DeliveryPrice, o.DeliveryCountry
                FROM Orders as o
            INNER JOIN Status as s
                ON o.StatusId=s.Id
            WHERE UOrderId=${orderId};`
        );

        return this._createOrder(orderFromDB[0], true);
    }

    private async _getOrderByIdForRegisteredUser(
        orderId: number,
        connection: Connection,
        userId: number
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
        WHERE o.UOrderId=? AND c.UserId=?`;

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
        WHERE o.UOrderId=?`;

        const [orderFromDB] = await connection.execute(orderQuery, [
            orderId,
            userId,
        ]);
        const [itemsFromDB] = await connection.execute(orderItemsQuery, [
            orderId,
        ]);

        const order: Order = this._createOrder(orderFromDB[0], true, true);
        order.orderItems = this._createItems(itemsFromDB);

        return order;
    }

    public async readItemsInOrderById(
        orderId: number,
        connection: Connection
    ): Promise<Item[]> {
        const [itemsInOrderFromDB] = await connection.execute(
            `SELECT i.Id, i.Name as ItemName, i.Sex, oi.ItemPrice, t.Name as Type, ifs.FileName, oi.ItemQuantity as Quantity
                FROM OrdersItems as oi
            INNER JOIN Items as i
                ON oi.ItemId=i.Id
            INNER JOIN Orders as o
                ON oi.OrderId=o.Id
            INNER JOIN ItemsFiles as ifs
                ON i.Id=ifs.itemId
            INNER JOIN Types as t
                ON i.TypeId=t.Id
            WHERE o.UOrderId=${orderId};`
        );

        return this._createItems(itemsInOrderFromDB);
    }

    async readOrders(userId: number): Promise<Order[]> {
        const ordersInDB = await executeQuery(
            `SELECT o.Id, o.UOrderId, s.Status as OrderStatus, o.OrderDate, o.DeliveryPrice
                FROM Orders as o
            INNER JOIN Status as s
                ON o.StatusId=s.Id
            INNER JOIN Clients as c
                ON c.UserId=${userId}
            WHERE ClientId=c.Id
            ORDER BY o.OrderDate DESC;
            `
        );

        return this._createOrders(ordersInDB);
    }

    private _createOrders(ordersFromDB: any): Order[] {
        const orders: Order[] = [];
        ordersFromDB.forEach(orderItem =>
            orders.push(this._createOrder(orderItem))
        );

        return orders;
    }

    private async _insertCartInOrderItems(
        orderItems: OrderItem[] | Item[],
        orderId: number,
        connection: Connection
    ): Promise<void> {
        orderItems.forEach(async item => {
            await connection.execute(
                `INSERT INTO OrdersItems (OrderId, ItemId, ItemPrice, ItemQuantity) VALUES (?, ?, ?, ?)`,
                [orderId, item.$Id, item.$ActualPrice, item.$Quantity]
            );
        });
    }

    private _createClient(clientFromDB: any): Client {
        const client: Client = new Client(clientFromDB.Email);
        client.id = clientFromDB.Id;
        client.firstName = clientFromDB.FirstName;
        client.lastName = clientFromDB.LastName;
        client.phoneNumber = clientFromDB.PhoneNumber;
        client.uClientId = clientFromDB.UClientId;
        client.address = this._createAddress(clientFromDB);

        return client;
    }

    private _createAddress(client: any): Address {
        const address: Address = new Address();
        address.id = client.AddressId;
        address.country = client.Country;
        address.city = client.City;
        address.postalCode = client.PostalCode;
        address.address = client.Address;
        address.clientId = client.Id;

        return address;
    }

    private _createOrder(
        orderFromDB: any,
        withAdditionalInfo: boolean = false,
        withClientInfo: boolean = false
    ): Order {
        const order: Order = new Order();
        order.id = orderFromDB.Id ? orderFromDB.Id : null;
        order.uOrderId = orderFromDB.UOrderId;
        order.status = orderFromDB.OrderStatus;
        order.orderDate = orderFromDB.OrderDate;

        if (withAdditionalInfo) {
            order.deliveryType = orderFromDB.DeliveryType;
            order.deliveryComment = orderFromDB.DeliveryComment;
            order.deliveryPrice = orderFromDB.DeliveryPrice;
            order.deliveryCountry = orderFromDB.DeliveryCountry;

            if (withClientInfo) {
                order.client = this._createClient(orderFromDB);
                order.$Client.id = orderFromDB.ClientId;
            }
        }

        return order;
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

    private async _insertOrder(
        order: Order,
        connection: Connection = undefined
    ) {
        const queryWithParams = {
            query: `INSERT INTO Orders (UOrderId, StatusId, OrderDate, ClientId, DeliveryAddressId, DeliveryComment, DeliveryType, DeliveryPrice, DeliveryCountry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                order.$UOrderId,
                order.$StatusId,
                order.$OrderDate,
                order.$ClientId,
                order.$DeliveryAddressId,
                order.$DeliveryComment,
                order.$DeliveryType,
                order.$DeliveryPrice,
                order.$DeliveryCountry,
            ],
        };

        return connection
            ? await connection.execute(
                  queryWithParams.query,
                  queryWithParams.params
              )
            : await executeQuery(queryWithParams.query, queryWithParams.params);
    }
}
