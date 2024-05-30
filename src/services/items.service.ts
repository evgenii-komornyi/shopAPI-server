import { NextFunction, Request, Response } from 'express';
import { readItemFiles } from '../repositories/files.repository.ts';
import { readAllItems, readItemById } from '../repositories/item.repository.ts';
import { ItemFindRequest } from '../models/requests/item/ItemFindRequest.ts';
import { ItemValidation } from '../validation/item/ItemValidation.ts';
import { FindItemRequestValidation } from '../validation/item/FindItemRequestValidation.ts';
import { ItemValidationErrors } from '../validation/errors/ItemValidationErrors.ts';

const _validator: ItemValidation = new ItemValidation(
    new FindItemRequestValidation()
);

export const getAllItems = async (_, res: Response, next: NextFunction) => {
    try {
        const items = await readAllItems();

        res.status(200).json(
            items.length > 0 ? items.map(item => _generateDTO(item)) : []
        );
    } catch (err) {
        console.error(`Error while reading items`, err.message);
        next(err);
    }
};

export const getItemById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id: itemId } = req.params;

    const itemFindRequest: ItemFindRequest = new ItemFindRequest();
    itemFindRequest.itemId = itemId;

    const validationErrors: ItemValidationErrors[] =
        _validator.$FindOrderRequestValidation.validate(itemFindRequest);

    if (validationErrors.length === 0) {
        try {
            const item = await readItemById(itemId);
            const files = await readItemFiles(itemId);

            res.status(200).json(
                item.length > 0 ? _generateDTO(item[0], files) : {}
            );
        } catch (err) {
            console.error(`Error while reading item`, err.message);
            next(err);
        }
    } else {
        res.status(400).json({ error: 'Bad request. Check inputs.' });
    }
};

const _generateDTO = (item, files = []) => ({
    itemId: item.Id,
    itemName: item.Name,
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
    files: files.map(file => _generateFileDTO(file)),
});

const _generateFileDTO = file => ({
    fileId: file.Id,
    fileName: file.FileName,
});
