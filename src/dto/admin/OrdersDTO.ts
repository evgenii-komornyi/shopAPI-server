import { BasicDTO } from '../BasicDTO.ts';
import { OrderFindDetailsDTO } from '../order/OrderFindDetailsDTO.ts';

export class OrdersDTO extends BasicDTO<string> {
    private orders: OrderFindDetailsDTO[];

    public set $orders(orders: OrderFindDetailsDTO[]) {
        this.orders = orders;
    }
}
