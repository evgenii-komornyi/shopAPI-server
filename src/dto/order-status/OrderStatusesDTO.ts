import { BasicDTO } from '../BasicDTO.ts';
import { OrderStatusDetailsDTO } from './OrderStatusDetailsDTO.ts';

export class OrderStatusesDTO extends BasicDTO<string> {
    private statuses: OrderStatusDetailsDTO[];

    public set $statuses(statuses: OrderStatusDetailsDTO[]) {
        this.statuses = statuses;
    }
}
