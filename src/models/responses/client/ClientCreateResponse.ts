import { ClientValidationErrors } from '../../../validation/errors/ClientValidationErrors.ts';
import { Client } from '../../Client.ts';
import { BasicResponse } from '../BasicResponse.ts';

export class ClientCreateResponse extends BasicResponse<ClientValidationErrors> {
    private CreatedClient: Client;

    public set createdClient(client: Client) {
        this.CreatedClient = client;
    }

    public get $CreatedClient(): Client {
        return this.CreatedClient;
    }
}
