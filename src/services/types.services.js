import {
    readAllTypes,
    readTypesByTypeName,
} from '../repositories/types.repository.js';

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
                      ...generateFishDTO(item),
                  }))
                : []
        );
    } catch (err) {
        console.error('Error while reading fish by type', err.message);
        next(err);
    }
};

const generateDTO = type => ({
    typeId: type.Id,
    typeName: type.Name,
    fileName: type.FileName,
    typeDescription: type.Description,
});

const generateFishDTO = fish => ({
    fishId: fish.FishId,
    fishName: fish.FishName,
    type: fish.Type,
    regularPrice: fish.Price,
    actualPrice: Number(
        fish.Price - (fish.Price * fish.Discount) / 100
    ).toFixed(2),
    discount: fish.Discount,
    description: fish.Description,
    isInStock: Boolean(fish.IsInStock),
    ...(fish.IsAvailable !== undefined && {
        isAvailable: Boolean(fish.IsAvailable),
    }),
    sex: fish.Sex,
    fileName: fish.FileName,
});
