export class OrderItem {
    private Id: number;
    private Quantity: number;
    private ActualPrice: number;

    public get $Id(): number {
        return this.Id;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public get $Quantity(): number {
        return this.Quantity;
    }

    public set quantity(quantity: number) {
        this.Quantity = quantity;
    }

    public get $ActualPrice(): number {
        return this.ActualPrice;
    }

    public set actualPrice(actualPrice: number) {
        this.ActualPrice = actualPrice;
    }
}
