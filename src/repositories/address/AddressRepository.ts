import { Connection } from 'mysql2/promise';
import { Address } from '../../models/Address.ts';
import { IAddressRepository } from './IAddressRepository.ts';
import { executeQuery } from '../../db/dbConnection.db.ts';

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

    public async updateAddress(address: Address): Promise<Address> {
        await executeQuery(`UPDATE Addresses SET Address=? WHERE Id=?`, [
            address.$Address,
            address.$Id,
        ]);
        address = await this._getAddressFromDB(address);

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

    private async _getAddressFromDB(address: Address): Promise<Address> {
        const [updatedAddress] = await executeQuery(
            `SELECT ClientId, Country, City, PostalCode, Address FROM Addresses WHERE Id=?`,
            [address.$Id]
        );
        address.clientId = updatedAddress.ClientId;
        address.country = updatedAddress.Country;
        address.city = updatedAddress.City;
        address.postalCode = updatedAddress.PostalCode;
        address.address = updatedAddress.Address;

        return address;
    }
}
