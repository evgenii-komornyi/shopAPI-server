export class OrderStatusDetailsDTO {
    private id: number;
    private status: string;

    public set $id(id: number) {
        this.id = id;
    }

    public set $status(status: string) {
        this.status = status;
    }
}
