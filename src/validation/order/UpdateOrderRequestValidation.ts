import { OrderStatus } from '../../enums/OrderStatus.ts';
import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { OrderValidationErrors } from '../errors/OrderValidationErrors.ts';

export class UpdateOrderRequestValidation
    implements IValidatable<OrderUpdateRequest, OrderValidationErrors>
{
    public validate(request: OrderUpdateRequest): OrderValidationErrors[] {
        const allErrors: OrderValidationErrors[] = [];

        allErrors.push(...this._validateOrderId(request.$OrderId));
        allErrors.push(...this._validateStatus(request.$StatusId));

        return allErrors;
    }

    private _validateOrderId(orderId: number): OrderValidationErrors[] {
        const errors: OrderValidationErrors[] = [];

        if (!orderId) {
            errors.push(OrderValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
    }

    private _validateStatus(status: number): OrderValidationErrors[] {
        const errors: OrderValidationErrors[] = [];

        if (!status) {
            errors.push(OrderValidationErrors.EMPTY_ORDER_STATUS);
        }

        if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
            errors.push(OrderValidationErrors.INVALID_ORDER_STATUS);
        }

        return errors;
    }
}
