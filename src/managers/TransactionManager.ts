import { createConnection, Connection } from 'mysql2/promise';
import { config } from '../configs/config.ts';
import { ITransactionManager } from './ITransactionManager.ts';

export class TransactionManager implements ITransactionManager {
    private connection: Connection | null = null;

    public async startTransaction(): Promise<void> {
        if (this.connection) {
            throw new Error('Transaction already started');
        }

        this.connection = await createConnection(config.development.db);
        await this.connection.beginTransaction();
    }

    public async commit(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.commit();
            } catch (err) {
                await this.rollback(); // In case commit fails, ensure rollback
                throw err;
            } finally {
                await this.closeConnection();
            }
        }
    }

    public async rollback(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.rollback();
            } catch (err) {
                console.error('Error during rollback:', err);
            } finally {
                await this.closeConnection();
            }
        }
    }

    public getConnection(): Connection {
        if (!this.connection) {
            throw new Error('Transaction has not been started');
        }
        return this.connection;
    }

    private async closeConnection(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.end();
            } catch (err) {
                console.error('Error closing connection:', err);
            } finally {
                this.connection = null;
            }
        }
    }
}
