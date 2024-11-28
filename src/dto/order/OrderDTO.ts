import { OrderValidationErrors } from '../../validation/errors/OrderValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { OrderDetailsDTO } from './OrderDetailsDTO.ts';

export class OrderDTO extends BasicDTO<OrderValidationErrors> {
    private order: OrderDetailsDTO;

    public set $order(order: OrderDetailsDTO) {
        this.order = order;
    }
}
