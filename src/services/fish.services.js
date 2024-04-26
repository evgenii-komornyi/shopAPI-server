import { readFishFiles } from '../repositories/files.repository.js';
import { readAllFish, readFishById } from '../repositories/fish.repository.js';

export const getAllFish = async (_, res, next) => {
    try {
        const fish = await readAllFish();

        res.json(fish.length > 0 ? fish.map(fish => generateDTO(fish)) : []);
    } catch (err) {
        console.error(`Error while reading fish`, err.message);
        next(err);
    }
};

export const getFishById = async (req, res, next) => {
    const { id: fishId } = req.params;
    try {
        const fish = await readFishById(fishId);
        const files = await readFishFiles(fishId);

        res.json(fish.length > 0 ? generateDTO(fish[0], files) : {});
    } catch (err) {
        console.error(`Error while reading fish`, err.message);
        next(err);
    }
};

const generateDTO = (fish, files = []) => ({
    fishId: fish.Id,
    fishName: fish.Name,
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
    files: files.map(file => generateFileDTO(file)),
});

const generateFileDTO = file => ({
    fileId: file.Id,
    fileName: file.FileName,
});
