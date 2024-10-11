import { OrderValidationErrors } from '../../validation/errors/OrderValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { OrderFindDetailsDTO } from './OrderFindDetailsDTO.ts';

export class OrderFindDTO extends BasicDTO<OrderValidationErrors> {
    private order: OrderFindDetailsDTO;

    public set $order(order: OrderFindDetailsDTO) {
        this.order = order;
    }
}
