import { createConnection, Connection } from 'mysql2/promise';
import { config } from '../configs/config.ts';
import { ITransactionManager } from './ITransactionManager.ts';

export class TransactionManager implements ITransactionManager {
    private connection: Connection;

    public async startTransaction(): Promise<void> {
        this.connection = await createConnection(config.development.db);
        await this.connection.beginTransaction();
    }

    public async commit(): Promise<void> {
        if (this.connection) {
            await this.connection.commit();
            await this.connection.end();
        }
    }

    public async rollback(): Promise<void> {
        if (this.connection) {
            await this.connection.rollback();
            await this.connection.end();
        }
    }

    public getConnection(): Connection {
        if (!this.connection) {
            throw new Error('Transaction has not been started');
        }
        return this.connection;
    }
}
