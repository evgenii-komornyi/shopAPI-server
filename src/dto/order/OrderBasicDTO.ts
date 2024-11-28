import { DeliveryType } from '../../enums/DeliveryType.ts';

export class OrderBasicDTO {
    private id: number;
    private orderStatus: string;
    private orderStatusId: number;
    private orderDate: Date;
    private deliveryPrice: string;
    private deliveryComment: string;
    private deliveryType: DeliveryType;
    private uOrderId: string;
    private clientId?: number;
    private addressId?: number;

    public set $id(id: number) {
        this.id = id;
    }

    public set $orderStatus(orderStatus: string) {
        this.orderStatus = orderStatus;
    }

    public set $orderStatusId(orderStatusId: number) {
        this.orderStatusId = orderStatusId;
    }

    public set $orderDate(orderDate: Date) {
        this.orderDate = orderDate;
    }

    public set $deliveryPrice(deliveryPrice: string) {
        this.deliveryPrice = deliveryPrice;
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

    public set $clientId(clientId: number) {
        this.clientId = clientId;
    }

    public set $addressId(addressId: number) {
        this.addressId = addressId;
    }
}
