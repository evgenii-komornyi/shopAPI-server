import { NextFunction, Request, Response } from 'express';
import {
    readAllTypes,
    readTypesByTypeName,
} from '../repositories/types.repository.ts';
import { TypeFindRequest } from '../models/requests/type/TypeFindRequest.ts';
import { TypeValidation } from '../validation/type/TypeValidation.ts';
import { FindTypeRequestValidation } from '../validation/type/FindTypeRequestValidation.ts';
import { TypeValidationErrors } from '../validation/errors/TypeValidationErrors.ts';

const _validator: TypeValidation = new TypeValidation(
    new FindTypeRequestValidation()
);

export const getAllTypes = async (
    _,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const types = await readAllTypes();

        res.status(200).json(
            types.length > 0 ? types.map(type => _generateDTO(type)) : []
        );
    } catch (err) {
        console.error(`Error while reading types`, err.message);
        next(err);
    }
};

export const getCollectionByType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const typeFindRequest: TypeFindRequest = new TypeFindRequest();
    typeFindRequest.typeName = req.params.typeName;

    const validationErrors: TypeValidationErrors[] =
        _validator.$FindTypeRequestValidation.validate(typeFindRequest);
    if (validationErrors.length === 0) {
        try {
            const collection = await readTypesByTypeName(
                typeFindRequest.$TypeName
            );

            res.status(200).json(
                collection.length > 0
                    ? collection.map(item => ({
                          ..._generateDTO(item),
                          ..._generateItemDTO(item),
                      }))
                    : []
            );
        } catch (err) {
            console.error('Error while reading item by type', err.message);
            next(err);
        }
    } else {
        res.status(400).json({ error: 'Bad request. Check inputs.' });
    }
};

const _generateDTO = type => ({
    typeId: type.Id,
    typeName: type.Name,
    fileName: type.FileName,
    typeDescription: type.Description,
});

const _generateItemDTO = item => ({
    itemId: item.ItemId,
    itemName: item.ItemName,
    type: item.Type,
    regularPrice: item.Price,
    actualPrice: Number(
        item.Price - (item.Price * item.Discount) / 100
    ).toFixed(2),
    discount: item.Discount,
    description: item.Description,
    isInStock: Boolean(item.IsInStock),
    ...(item.IsAvailable !== undefined && {
        isAvailable: Boolean(item.IsAvailable),
    }),
    sex: item.Sex,
    fileName: item.FileName,
});
