import { OrderBasicDTO } from './OrderBasicDTO.ts';
import { OrderItemDTO } from './OrderItemDTO.ts';

export class OrderFindDetailsDTO extends OrderBasicDTO {
    private orderItems: OrderItemDTO[];

    public set $orderItems(items: OrderItemDTO[]) {
        this.orderItems = items;
    }
}
