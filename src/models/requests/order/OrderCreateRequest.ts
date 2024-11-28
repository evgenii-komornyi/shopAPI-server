import { OrderItem } from '../../OrderItem.ts';
import { OrderBasicRequest } from './OrderBasicRequest.ts';

export class OrderCreateRequest extends OrderBasicRequest {
    private UserId?: number;
    private Email: string;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;
    private DeliveryType: string;
    private DeliveryComment?: string;
    private DeliveryPrice?: string;
    private DeliveryCountry?: string;
    private Country?: string | null;
    private City?: string | null;
    private PostalCode?: string | null;
    private Address?: string | null;
    private OrderItems: OrderItem[];

    public set userId(userId: number) {
        this.UserId = userId;
    }

    public get $UserId(): number {
        return this.UserId;
    }

    public set email(email: string) {
        this.Email = email;
    }

    public get $Email(): string {
        return this.Email;
    }

    public get $FirstName(): string {
        return this.FirstName;
    }

    public set firstName(firstName: string) {
        this.FirstName = firstName;
    }

    public get $LastName(): string {
        return this.LastName;
    }

    public set lastName(lastName: string) {
        this.LastName = lastName;
    }

    public get $PhoneNumber(): string {
        return this.PhoneNumber;
    }

    public set phoneNumber(phoneNumber: string) {
        this.PhoneNumber = phoneNumber;
    }

    public get $DeliveryType(): string {
        return this.DeliveryType;
    }

    public set deliveryType(deliveryType: string) {
        this.DeliveryType = deliveryType;
    }

    public get $DeliveryComment(): string {
        return this.DeliveryComment;
    }

    public set deliveryComment(deliveryComment: string) {
        this.DeliveryComment = deliveryComment;
    }

    public get $DeliveryPrice(): string {
        return this.DeliveryPrice;
    }

    public set deliveryPrice(deliveryPrice: string) {
        this.DeliveryPrice = deliveryPrice;
    }

    public get $DeliveryCountry(): string {
        return this.DeliveryCountry;
    }

    public set deliveryCountry(deliveryCountry: string) {
        this.DeliveryCountry = deliveryCountry;
    }

    public get $Country(): string | null | undefined {
        return this.Country;
    }

    public set country(country: string) {
        this.Country = country;
    }

    public get $City(): string | null | undefined {
        return this.City;
    }

    public set city(city: string) {
        this.City = city;
    }

    public get $PostalCode(): string | null | undefined {
        return this.PostalCode;
    }

    public set postalCode(postalCode: string) {
        this.PostalCode = postalCode;
    }

    public get $Address(): string | null | undefined {
        return this.Address;
    }

    public set address(address: string) {
        this.Address = address;
    }

    public get $OrderItems(): OrderItem[] {
        return this.OrderItems;
    }

    public set orderItems(orderItems: OrderItem[]) {
        this.OrderItems = orderItems;
    }
}
