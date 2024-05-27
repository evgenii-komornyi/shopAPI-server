import { readItemFiles } from '../repositories/files.repository';
import { readAllItems, readItemById } from '../repositories/item.repository';

export const getAllItems = async (_, res, next) => {
    try {
        const items = await readAllItems();

        res.json(items.length > 0 ? items.map(item => generateDTO(item)) : []);
    } catch (err) {
        console.error(`Error while reading items`, err.message);
        next(err);
    }
};

export const getItemById = async (req, res, next) => {
    const { id: itemId } = req.params;
    try {
        const item = await readItemById(itemId);
        const files = await readItemFiles(itemId);

        res.json(item.length > 0 ? generateDTO(item[0], files) : {});
    } catch (err) {
        console.error(`Error while reading item`, err.message);
        next(err);
    }
};

const generateDTO = (item, files = []) => ({
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
    files: files.map(file => generateFileDTO(file)),
});

const generateFileDTO = file => ({
    fileId: file.Id,
    fileName: file.FileName,
});
