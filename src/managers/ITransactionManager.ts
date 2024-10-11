import { Connection } from 'mysql2/promise';

export interface ITransactionManager {
    startTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    getConnection(): Connection;
}
