import { Connection } from 'mysql2/promise';
import { Client } from '../../models/Client.ts';

export interface IClientRepository {
    createClient(client: Client): Promise<Client>;
    createClientWithConnection(
        connection: Connection,
        client: Client
    ): Promise<Client>;
}
