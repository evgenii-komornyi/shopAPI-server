export class AddressCreateRequest {
    private Country: string;
    private City: string;
    private PostalCode: string;
    private Address: string;

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
