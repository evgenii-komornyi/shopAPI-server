import { Connection } from 'mysql2/promise';
import { Address } from '../../models/Address.ts';

export interface IAddressRepository {
    createAddress(address: Address): Promise<Address>;
    createAddressWithConnection(
        connection: Connection,
        address: Address
    ): Promise<Address>;
    updateAddress(address: Address): Promise<Address>;
}
