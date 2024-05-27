import {
    readAllTypes,
    readTypesByTypeName,
} from '../repositories/types.repository';

export const getAllTypes = async (_, res, next) => {
    try {
        const types = await readAllTypes();

        res.json(types.length > 0 ? types.map(type => generateDTO(type)) : []);
    } catch (err) {
        console.error(`Error while reading types`, err.message);
        next(err);
    }
};

export const getCollectionByType = async (req, res, next) => {
    try {
        const collection = await readTypesByTypeName(req.params.typeName);

        res.json(
            collection.length > 0
                ? collection.map(item => ({
                      ...generateDTO(item),
                      ...generateItemDTO(item),
                  }))
                : []
        );
    } catch (err) {
        console.error('Error while reading item by type', err.message);
        next(err);
    }
};

const generateDTO = type => ({
    typeId: type.Id,
    typeName: type.Name,
    fileName: type.FileName,
    typeDescription: type.Description,
});

const generateItemDTO = item => ({
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
