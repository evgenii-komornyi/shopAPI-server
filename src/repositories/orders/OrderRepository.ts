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
        const [createdOrder] = await this._insertOrder(order, connection);
        order.id = createdOrder.insertId;

        await this._insertCartInOrderItems(
            order.$OrderItems,
            order.$Id,
            connection
        );

        return order;
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
        connection: Connection
    ): Promise<boolean> {
        const [orderFromBD] = await connection.execute(
            `SELECT COUNT(Id) AS Count FROM Orders WHERE UOrderId=${orderId}`
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
        connection: Connection
    ): Promise<Order> {
        const [orderFromDB] = await connection.execute(
            `SELECT UOrderId, Status, OrderDate, DeliveryType, DeliveryComment, DeliveryPrice, DeliveryCountry
                FROM Orders
            WHERE UOrderId=${orderId};`
        );

        return this._createOrder(orderFromDB[0]);
    }

    private _createOrder(orderFormDB: any): Order {
        const order: Order = new Order();
        order.uOrderId = orderFormDB.UOrderId;
        order.status = orderFormDB.Status;
        order.deliveryType = orderFormDB.DeliveryType;
        order.deliveryComment = orderFormDB.DeliveryComment;
        order.deliveryPrice = orderFormDB.DeliveryPrice;
        order.deliveryCountry = orderFormDB.DeliveryCountry;

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
            query: `INSERT INTO Orders (UOrderId, Status, OrderDate, ClientId, DeliveryAddressId, DeliveryComment, DeliveryType, DeliveryPrice, DeliveryCountry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                order.$UOrderId,
                order.$Status,
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
