export class AddressUpdateRequest {
    private Id: number;
    private Address: string;

    public get $Id(): number {
        return this.Id;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public get $Address(): string {
        return this.Address;
    }

    public set address(address: string) {
        this.Address = address;
    }
}
