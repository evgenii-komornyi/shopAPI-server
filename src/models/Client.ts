import { Person } from './Person.ts';

export class Client extends Person {
    private UClientId: string;
    private FirstName: string;
    private LastName: string;
    private PhoneNumber: string;
    private CreationDate: Date;
    private UpdateDate: Date;
    private UserId: number;

    public get $UClientId(): string {
        return this.UClientId;
    }

    public set uClientId(uClientId: string) {
        this.UClientId = uClientId;
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

    public get $CreationDate(): Date {
        return this.CreationDate;
    }

    public set creationDate(creationDate: Date) {
        this.CreationDate = creationDate;
    }

    public get $UpdateDate(): Date {
        return this.UpdateDate;
    }

    public set updateDate(updateDate: Date) {
        this.UpdateDate = updateDate;
    }

    public get $UserId(): number {
        return this.UserId;
    }

    public set userId(userId: number) {
        this.UserId = userId;
    }
}
