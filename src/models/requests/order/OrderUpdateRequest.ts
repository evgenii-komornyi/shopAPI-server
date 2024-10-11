import { OrderBasicRequest } from './OrderBasicRequest.ts';

export class OrderUpdateRequest extends OrderBasicRequest {
    private OrderId: number;
    private StatusId: number;

    public set orderId(orderId: number) {
        this.OrderId = orderId;
    }

    public get $OrderId(): number {
        return this.OrderId;
    }

    public set statusId(statusId: number) {
        this.StatusId = statusId;
    }

    public get $StatusId(): number {
        return this.StatusId;
    }
}
