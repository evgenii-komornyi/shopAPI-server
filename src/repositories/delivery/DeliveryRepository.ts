import { executeQuery } from '../../db/dbConnection.db.ts';
import { IDeliveryRepository } from './IDeliveryRepository.ts';

export class DeliveryRepository implements IDeliveryRepository {
    public async readDeliveryPriceByCountry(country: string): Promise<any> {
        const [data] = await executeQuery(
            `SELECT Price
                FROM Delivery
            WHERE Country='${country}';`
        );

        return data;
    }
}
