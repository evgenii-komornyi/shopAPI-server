import { ClientValidationErrors } from '../../../validation/errors/ClientValidationErrors.ts';
import { Client } from '../../Client.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class ClientUpdateResponse extends BasicResponse<ClientValidationErrors> {
    private UpdatedClient: Client;

    public get $UpdatedClient(): Client {
        return this.UpdatedClient;
    }

    public set updatedClient(client: Client) {
        this.UpdatedClient = client;
    }
}
