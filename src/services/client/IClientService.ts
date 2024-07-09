import { Connection } from 'mysql2/promise';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { ClientCreateResponse } from '../../models/responses/client/ClientCreateResponse.ts';
import { ClientValidation } from '../../validation/client/ClientValidation.ts';
import { Client } from '../../models/Client.ts';

export interface IClientService {
    linkClientWithUser(
        request: ClientCreateRequest
    ): Promise<ClientCreateResponse>;
    linkClientWithUserWithConnection(
        connection: Connection,
        client: Client
    ): Promise<Client>;
    get $Validation(): ClientValidation;
}
