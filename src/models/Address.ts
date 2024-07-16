export class Address {
    private Id: number;
    private ClientId: number;
    private Country: string;
    private City: string;
    private PostalCode: string;
    private Address: string;

    public get $Id(): number {
        return this.Id;
    }

    public get $ClientId(): number {
        return this.ClientId;
    }

    public get $Country(): string {
        return this.Country;
    }

    public get $City(): string {
        return this.City;
    }

    public get $PostalCode(): string {
        return this.PostalCode;
    }

    public get $Address(): string {
        return this.Address;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public set clientId(clientId: number) {
        this.ClientId = clientId;
    }

    public set country(country: string) {
        this.Country = country;
    }

    public set city(city: string) {
        this.City = city;
    }

    public set postalCode(postalCode: string) {
        this.PostalCode = postalCode;
    }

    public set address(address: string) {
        this.Address = address;
    }
}
