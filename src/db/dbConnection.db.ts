import { createConnection } from 'mysql2/promise.js';
import { config } from './config.ts';

export const closeConnection = async connection => {
    if (connection) return await connection.end();
};

export const startTransaction = async connection => {
    if (connection) return await connection.beginTransaction();
};

export const commit = async connection => {
    if (connection) return await connection.commit();
};

export const rollback = async connection => {
    if (connection) return await connection.rollback();
};

export const executeQuery = async (sql, params = []) => {
    let connection;

    try {
        connection = await createConnection(config.db);

        const [results] = await connection.execute(sql, params);

        return results;
    } catch (error) {
        console.error('Query error:', error);
        return null;
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
