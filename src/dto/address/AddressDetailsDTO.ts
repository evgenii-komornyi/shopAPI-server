export class AddressDetailsDTO {
    private id: number;
    private country: string;
    private city: string;
    private postalCode: string;
    private address: string;
    private clientId: number;

    public set $id(id: number) {
        this.id = id;
    }

    public set $country(country: string) {
        this.country = country;
    }

    public set $city(city: string) {
        this.city = city;
    }

    public set $postalCode(postalCode: string) {
        this.postalCode = postalCode;
    }

    public set $address(address: string) {
        this.address = address;
    }

    public set $clientId(clientId: number) {
        this.clientId = clientId;
    }
}
