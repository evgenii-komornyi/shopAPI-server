import { ClientDetailsDTO } from '../client/ClientDetailsDTO.ts';
import { OrderBasicDTO } from './OrderBasicDTO.ts';
import { OrderItemDTO } from './OrderItemDTO.ts';

export class OrderFindDetailsDTO extends OrderBasicDTO {
    private orderItems?: OrderItemDTO[];
    private client?: ClientDetailsDTO;
    private totalPrice?: number;

    public set $orderItems(items: OrderItemDTO[]) {
        this.orderItems = items;
    }

    public set $client(client: ClientDetailsDTO) {
        this.client = client;
    }

    public set $totalPrice(totalPrice: number) {
        this.totalPrice = totalPrice;
    }
}
