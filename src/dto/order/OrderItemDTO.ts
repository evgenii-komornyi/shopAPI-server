export class OrderItemDTO {
    private id: number;
    private itemName: string;
    private itemPrice: number;
    private sex: string;
    private typeName: string;
    private fileName: string;
    private quantity: number;

    public set $id(value: number) {
        this.id = value;
    }

    public set $itemName(value: string) {
        this.itemName = value;
    }

    public set $itemPrice(value: number) {
        this.itemPrice = value;
    }

    public set $sex(value: string) {
        this.sex = value;
    }

    public set $type(value: string) {
        this.typeName = value;
    }

    public set $fileName(value: string) {
        this.fileName = value;
    }

    public set $quantity(value: number) {
        this.quantity = value;
    }
}
