export class OrderStatus {
    private Id: number;
    private Status: string;

    constructor(id: number, status: string) {
        this.Id = id;
        this.Status = status;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public set status(status: string) {
        this.Status = status;
    }

    public get $Id(): number {
        return this.Id;
    }

    public get $Status(): string {
        return this.Status;
    }
}
