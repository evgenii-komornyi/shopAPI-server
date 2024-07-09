export class ClientCreateRequest {
    private Email: string;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;
    private UserId: number;

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

    public get $UserId(): number {
        return this.UserId;
    }

    public set userId(userId: number) {
        this.UserId = userId;
    }
}
