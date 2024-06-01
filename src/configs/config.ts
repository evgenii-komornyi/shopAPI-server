import { IConfig } from './IConfig.ts';
import dotenv from 'dotenv';

dotenv.config();

export const config: IConfig = {
    production: {
        db: {
            host: process.env.PROD_DB_HOST,
            user: process.env.PROD_DB_USERNAME,
            password: process.env.PROD_DB_PASSWORD,
            database: process.env.PROD_DB_DATABASE,
            connectTimeout: 60000,
        },
    },
    development: {
        db: {
            host: process.env.DEV_DB_HOST,
            user: process.env.DEV_DB_USERNAME,
            password: process.env.DEV_DB_PASSWORD,
            database: process.env.DEV_DB_DATABASE,
            connectTimeout: 60000,
        },
    },
};
