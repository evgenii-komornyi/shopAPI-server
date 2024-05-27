export class OrderCreateRequest {
    private Email: string;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;
    private DeliveryType: string;
    private Country?: string | null;
    private City?: string | null;
    private PostalCode?: string | null;
    private Address?: string | null;

    constructor(
        email: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        deliveryType: string
    ) {
        this.Email = email;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.PhoneNumber = phoneNumber;
        this.DeliveryType = deliveryType;
    }

    public withCountry(country: string): void {
        this.Country = country;
    }

    public withCity(city: string): void {
        this.City = city;
    }

    public withPostalCode(postalCode: string): void {
        this.PostalCode = postalCode;
    }

    public withAddress(address: string): void {
        this.Address = address;
    }

    public get $Email(): string {
        return this.Email;
    }

    public get $FirstName(): string {
        return this.FirstName;
    }

    public get $LastName(): string {
        return this.LastName;
    }

    public get $PhoneNumber(): string {
        return this.PhoneNumber;
    }

    public get $DeliveryType(): string {
        return this.DeliveryType;
    }

    public get $Country(): string | null | undefined {
        return this.Country;
    }

    public get $City(): string | null | undefined {
        return this.City;
    }

    public get $PostalCode(): string | null | undefined {
        return this.PostalCode;
    }

    public get $Address(): string | null | undefined {
        return this.Address;
    }
}
