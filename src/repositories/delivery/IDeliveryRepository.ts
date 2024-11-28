export interface IDeliveryRepository {
    readDeliveryPriceByCountry(country: string): Promise<any>;
}
