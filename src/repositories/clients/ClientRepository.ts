import { Connection } from 'mysql2/promise';
import { executeQuery } from '../../db/dbConnection.db.ts';
import { Client } from '../../models/Client.ts';
import { IClientRepository } from './IClientRepository.ts';

export class ClientRepository implements IClientRepository {
    public async createClientWithConnection(
        connection: Connection,
        client: Client
    ): Promise<Client> {
        const [createdClient] = await this._insertClient(client, connection);
        client.id = createdClient.insertId;

        return client;
    }

    public async createClient(client: Client): Promise<Client> {
        const createdClient = await this._insertClient(client);
        client.id = createdClient.insertId;

        return client;
    }

    private async _insertClient(
        client: Client,
        connection: Connection = undefined
    ): Promise<any> {
        return await connection.execute(
            `INSERT INTO Clients (Email, FirstName, LastName, PhoneNumber, CreationDate, UpdateDate, UClientId, UserId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                client.$Email,
                client.$FirstName,
                client.$LastName,
                client.$PhoneNumber,
                client.$CreationDate,
                client.$UpdateDate,
                client.$UClientId,
                client.$UserId,
            ]
        );
    }
}
