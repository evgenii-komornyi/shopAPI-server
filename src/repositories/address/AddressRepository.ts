import { Connection } from 'mysql2/promise';
import { Address } from '../../models/Address.ts';
import { IAddressRepository } from './IAddressRepository.ts';

export class AddressRepository implements IAddressRepository {
    public async createAddress(address: Address): Promise<Address> {
        throw new Error('Method not implemented.');
    }

    public async createAddressWithConnection(
        connection: Connection,
        address: Address
    ): Promise<Address> {
        const [createdAddress] = await this._insertAddress(address, connection);
        address.id = createdAddress.insertId;

        return address;
    }

    private async _insertAddress(
        address: Address,
        connection: Connection = undefined
    ): Promise<any> {
        return await connection.execute(
            `INSERT INTO Addresses (Country, City, PostalCode, Address, ClientId) VALUES (?, ?, ?, ?, ?)`,
            [
                address.$Country,
                address.$City,
                address.$PostalCode,
                address.$Address,
                address.$ClientId,
            ]
        );
    }
}
