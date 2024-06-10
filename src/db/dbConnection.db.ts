import {
    createConnection,
    Connection,
    QueryResult,
    ResultSetHeader,
} from 'mysql2/promise.js';
import { config } from '../configs/config.ts';

export const closeConnection = async (
    connection: Connection
): Promise<void> => {
    if (connection) return await connection.end();
};

export const startTransaction = async (
    connection: Connection
): Promise<void> => {
    if (connection) return await connection.beginTransaction();
};

export const commit = async (connection: Connection): Promise<void> => {
    if (connection) return await connection.commit();
};

export const rollback = async (connection: Connection): Promise<void> => {
    if (connection) return await connection.rollback();
};

export const executeQuery = async (sql: string, params: any[] = []) => {
    let connection;

    try {
        connection = await createConnection(config.development.db);

        const [results] = await connection.execute(sql, params);

        return results;
    } catch (error) {
        throw new Error(error.sqlState);
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (error) {
                console.error('Disconnection error:', error);
            }
        }
    }
};
