import { createConnection } from 'mysql2/promise.js';
import { config } from './config.js';

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
