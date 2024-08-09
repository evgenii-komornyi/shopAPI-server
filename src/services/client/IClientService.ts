import { Connection } from 'mysql2/promise';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { ClientCreateResponse } from '../../models/responses/client/ClientCreateResponse.ts';
import { ClientValidation } from '../../validation/client/ClientValidation.ts';
import { Client } from '../../models/Client.ts';
import { ClientUpdateResponse } from '../../models/responses/client/ClientUpdateResponse.ts';
import { ClientUpdateRequest } from '../../models/requests/client/ClientUpdateRequest.ts';

export interface IClientService {
    linkClientWithUser(
        request: ClientCreateRequest
    ): Promise<ClientCreateResponse>;
    linkClientWithUserWithConnection(
        connection: Connection,
        client: Client
    ): Promise<Client>;
    updateClient(request: ClientUpdateRequest): Promise<ClientUpdateResponse>;
    get $Validation(): ClientValidation;
}
