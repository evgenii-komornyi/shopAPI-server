export class ClientUpdateRequest {
    private Id: number;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;

    public get $Id(): number {
        return this.Id;
    }

    public set id(id: number) {
        this.Id = id;
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
}
