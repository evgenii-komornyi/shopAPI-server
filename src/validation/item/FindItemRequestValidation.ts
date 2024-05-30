import { ItemFindRequest } from '../../models/requests/item/ItemFindRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { ItemValidationErrors } from '../errors/ItemValidationErrors.ts';

export class FindItemRequestValidation
    implements IValidatable<ItemFindRequest, ItemValidationErrors>
{
    validate(request: ItemFindRequest): ItemValidationErrors[] {
        const allErrors: ItemValidationErrors[] = [];

        allErrors.push(...this._validateItemId(request.$ItemId));

        return allErrors;
    }

    private _validateItemId(itemId: string) {
        const errors: ItemValidationErrors[] = [];
        const onlyDigits: RegExp = /^\d$/;

        if (!onlyDigits.test(itemId)) {
            errors.push(ItemValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
    }
}
