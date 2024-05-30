import { OrderBasicRequest } from './OrderBasicRequest.ts';

export class OrderCreateRequest extends OrderBasicRequest {
    private Email: string;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;
    private DeliveryType: string;
    private Country?: string | null;
    private City?: string | null;
    private PostalCode?: string | null;
    private Address?: string | null;

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
}
