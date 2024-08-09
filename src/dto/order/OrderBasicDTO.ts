import { DeliveryType } from '../../enums/DeliveryType.ts';

export class OrderBasicDTO {
    private id: number;
    private orderStatus: string;
    private orderDate: Date;
    private deliveryComment: string;
    private deliveryType: DeliveryType;
    private uOrderId: string;

    public set $id(id: number) {
        this.id = id;
    }

    public set $orderStatus(orderStatus: string) {
        this.orderStatus = orderStatus;
    }

    public set $orderDate(orderDate: Date) {
        this.orderDate = orderDate;
    }

    public set $deliveryComment(deliveryComment: string) {
        this.deliveryComment = deliveryComment;
    }

    public set $deliveryType(deliveryType: DeliveryType) {
        this.deliveryType = deliveryType;
    }

    public set $uOrderId(uOrderId: string) {
        this.uOrderId = uOrderId;
    }
}
