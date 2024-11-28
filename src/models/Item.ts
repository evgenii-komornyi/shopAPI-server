export class Item {
    private Id: number;
    private ItemName: string;
    private Sex: string;
    private ItemPrice: number;
    private Type: string;
    private FileName: string;
    private Quantity: number;

    public get $Id(): number {
        return this.Id;
    }

    public get $ItemName(): string {
        return this.ItemName;
    }

    public get $Sex(): string {
        return this.Sex;
    }

    public get $ItemPrice(): number {
        return this.ItemPrice;
    }

    public get $Type(): string {
        return this.Type;
    }

    public get $FileName(): string {
        return this.FileName;
    }

    public get $Quantity(): number {
        return this.Quantity;
    }

    public set id(value: number) {
        this.Id = value;
    }

    public set itemName(value: string) {
        this.ItemName = value;
    }

    public set sex(value: string) {
        this.Sex = value;
    }

    public set itemPrice(value: number) {
        this.ItemPrice = value;
    }

    public set type(value: string) {
        this.Type = value;
    }

    public set fileName(value: string) {
        this.FileName = value;
    }

    public set quantity(value: number) {
        this.Quantity = value;
    }
}
