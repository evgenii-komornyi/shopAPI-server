import { DeliveryType } from '../enums/DeliveryType.ts';
import { OrderStatus } from '../enums/OrderStatus.ts';
import { Client } from './Client.ts';
import { Item } from './Item.ts';
import { OrderItem } from './OrderItem.ts';

export class Order {
    private Id: number;
    private ClientId: number;
    private Status: OrderStatus;
    private OrderDate: Date;
    private DeliveryAddressId?: number;
    private DeliveryComment: string;
    private DeliveryType: DeliveryType;
    private DeliveryPrice?: string;
    private DeliveryCountry?: string;
    private UOrderId: string;
    private Client: Client;
    private OrderItems: OrderItem[] | Item[];

    public get $Id(): number {
        return this.Id;
    }

    public set id(value: number) {
        this.Id = value;
    }

    public get $ClientId(): number {
        return this.ClientId;
    }

    public set clientId(value: number) {
        this.ClientId = value;
    }

    public get $Status(): OrderStatus {
        return this.Status;
    }

    public set status(value: OrderStatus) {
        this.Status = value;
    }

    public get $OrderDate(): Date {
        return this.OrderDate;
    }

    public set orderDate(value: Date) {
        this.OrderDate = value;
    }

    public get $DeliveryAddressId(): number | undefined {
        return this.DeliveryAddressId;
    }

    public set deliveryAddressId(value: number | undefined) {
        this.DeliveryAddressId = value;
    }

    public get $DeliveryComment(): string {
        return this.DeliveryComment;
    }

    public set deliveryComment(value: string) {
        this.DeliveryComment = value;
    }

    public get $DeliveryType(): DeliveryType {
        return this.DeliveryType;
    }

    public set deliveryType(value: DeliveryType) {
        this.DeliveryType = value;
    }

    public get $DeliveryPrice(): string {
        return this.DeliveryPrice;
    }

    public set deliveryPrice(value: string) {
        this.DeliveryPrice = value;
    }

    public get $DeliveryCountry(): string {
        return this.DeliveryCountry;
    }

    public set deliveryCountry(value: string) {
        this.DeliveryCountry = value;
    }

    public get $UOrderId(): string {
        return this.UOrderId;
    }

    public set uOrderId(value: string) {
        this.UOrderId = value;
    }

    public get $Client(): Client {
        return this.Client;
    }

    public set client(value: Client) {
        this.Client = value;
    }

    public get $OrderItems(): OrderItem[] | Item[] {
        return this.OrderItems;
    }

    public set orderItems(value: OrderItem[] | Item[]) {
        this.OrderItems = value;
    }
}
