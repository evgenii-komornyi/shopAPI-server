export class ClientDetailsDTO {
    private id: number;
    private email: string;
    private firstName: string;
    private lastName: string;
    private phoneNumber: string;
    private uClientId: string;
    private creationDate: Date;
    private updateDate: Date;
    private userId: number;

    public set $id(id: number) {
        this.id = id;
    }

    public set $email(email: string) {
        this.email = email;
    }

    public set $firstName(firstName: string) {
        this.firstName = firstName;
    }

    public set $lastName(lastName: string) {
        this.lastName = lastName;
    }

    public set $phoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }

    public set $uClientId(uClientId: string) {
        this.uClientId = uClientId;
    }

    public set $creationDate(creationDate: Date) {
        this.creationDate = creationDate;
    }

    public set $updateDate(updateDate: Date) {
        this.updateDate = updateDate;
    }

    public set $userId(userId: number) {
        this.userId = userId;
    }
}
