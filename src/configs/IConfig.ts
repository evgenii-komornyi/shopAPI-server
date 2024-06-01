import { IEnvironmentConfig } from './IEnvironmentConfig.ts';

export interface IConfig {
    production: IEnvironmentConfig;
    development: IEnvironmentConfig;
}
