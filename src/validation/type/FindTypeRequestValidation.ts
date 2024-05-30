import { ItemType } from '../../enums/ItemType.ts';
import { TypeFindRequest } from '../../models/requests/type/TypeFindRequest.ts';
import { IValidatable } from '../IValidatable.ts';
import { TypeValidationErrors } from '../errors/TypeValidationErrors.ts';

export class FindTypeRequestValidation
    implements IValidatable<TypeFindRequest, TypeValidationErrors>
{
    public validate(request: TypeFindRequest): TypeValidationErrors[] {
        const allErrors: TypeValidationErrors[] = [];

        allErrors.push(...this._validateTypeName(request.$TypeName));

        return allErrors;
    }

    private _validateTypeName(typeName: string) {
        const errors: TypeValidationErrors[] = [];

        if (
            typeName === null ||
            typeName === undefined ||
            !Object.values(ItemType).includes(typeName as ItemType)
        ) {
            errors.push(TypeValidationErrors.NO_SEARCH_CRITERIA);
        }

        return errors;
    }
}
