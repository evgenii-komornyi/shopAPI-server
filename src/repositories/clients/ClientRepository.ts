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

    public async updateClient(client: Client): Promise<Client> {
        await executeQuery(
            `UPDATE Clients SET FirstName=?, LastName=?, PhoneNumber=?, UpdateDate=? WHERE Id=?`,
            [
                client.$FirstName,
                client.$LastName,
                client.$PhoneNumber,
                client.$UpdateDate,
                client.$Id,
            ]
        );
        client = await this._getClientFromDB(client);

        return client;
    }

    private async _insertClient(
        client: Client,
        connection: Connection = undefined
    ): Promise<any> {
        const queryWithParams = {
            query: `INSERT INTO Clients (Email, FirstName, LastName, PhoneNumber, CreationDate, UpdateDate, UClientId, UserId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                client.$Email,
                client.$FirstName,
                client.$LastName,
                client.$PhoneNumber,
                client.$CreationDate,
                client.$UpdateDate,
                client.$UClientId,
                client.$UserId,
            ],
        };

        return connection
            ? await connection.execute(
                  queryWithParams.query,
                  queryWithParams.params
              )
            : await executeQuery(queryWithParams.query, queryWithParams.params);
    }

    private async _getClientFromDB(client: Client): Promise<Client> {
        const [updatedClient] = await executeQuery(
            `SELECT Email, FirstName, LastName, PhoneNumber, CreationDate, UpdateDate, UClientId, UserId FROM Clients WHERE Id=?`,
            [client.$Id]
        );
        client.email = updatedClient.Email;
        client.firstName = updatedClient.FirstName;
        client.lastName = updatedClient.LastName;
        client.phoneNumber = updatedClient.PhoneNumber;
        client.creationDate = updatedClient.CreationDate;
        client.updateDate = updatedClient.UpdateDate;
        client.userId = updatedClient.UserId;
        client.uClientId = updatedClient.UClientId;

        return client;
    }
}
