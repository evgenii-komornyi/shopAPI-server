import { OrderBasicRequest } from './OrderBasicRequest.ts';

export class OrderFindRequest extends OrderBasicRequest {
    private OrderId: string;
    private ClientId: string;

    public set orderId(orderId: string) {
        this.OrderId = orderId;
    }

    public get $OrderId(): string {
        return this.OrderId;
    }

    public set clientId(clientId: string) {
        this.ClientId = clientId;
    }

    public get $ClientId(): string {
        return this.ClientId;
    }
}
