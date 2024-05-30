import { OrderFindRequest } from '../../models/requests/order/OrderFindRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { OrderValidationErrors } from '../errors/OrderValidationErrors.ts';

export class FindOrderRequestValidation
    implements IValidatable<OrderFindRequest, OrderValidationErrors>
{
    public validate(request: OrderFindRequest): OrderValidationErrors[] {
        const allErrors: OrderValidationErrors[] = [];

        allErrors.push(
            ...this._validateOrderId(request.$OrderId, request.$ClientId)
        );

        return allErrors;
    }

    private _validateOrderId(orderId: string, clientId: string) {
        const errors: OrderValidationErrors[] = [];
        const onlyDigitsNineLengthOrderId: RegExp = /^\d{9}$/;
        const onlyDigitsSixteenLengthClientId: RegExp = /^\d{16}$/;

        if (
            !onlyDigitsNineLengthOrderId.test(orderId) ||
            !onlyDigitsSixteenLengthClientId.test(clientId)
        ) {
            errors.push(OrderValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
    }
}
