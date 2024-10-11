import { OrderValidationErrors } from '../../validation/errors/OrderValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { OrderUpdateDetailsDTO } from './OrderUpdateDetailsDTO.ts';

export class OrderUpdateDTO extends BasicDTO<OrderValidationErrors> {
    private order: OrderUpdateDetailsDTO;

    public set $order(order: OrderUpdateDetailsDTO) {
        this.order = order;
    }
}
