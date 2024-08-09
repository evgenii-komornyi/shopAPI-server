export class CartInOrderRequest {
    private OrderId: number;
    private ItemId: number;
    private ItemName: string;
    private ItemPrice: number;
    private ItemQuantity: number;

    public get $OrderId(): number {
        return this.OrderId;
    }

    public get $ItemId(): number {
        return this.ItemId;
    }

    public get $ItemName(): string {
        return this.ItemName;
    }

    public get $ItemPrice(): number {
        return this.ItemPrice;
    }

    public get $ItemQuantity(): number {
        return this.ItemQuantity;
    }

    public set orderId(value: number) {
        this.OrderId = value;
    }

    public set itemId(value: number) {
        this.ItemId = value;
    }

    public set itemName(value: string) {
        this.ItemName = value;
    }

    public set itemPrice(value: number) {
        this.ItemPrice = value;
    }

    public set itemQuantity(value: number) {
        this.ItemQuantity = value;
    }
}
