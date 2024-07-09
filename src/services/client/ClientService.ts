import generateUniqueId from 'generate-unique-id';
import { handleException } from '../../middlewares/ErrorHandlers.ts';
import { Client } from '../../models/Client.ts';
import { ClientCreateRequest } from '../../models/requests/client/ClientCreateRequest.ts';
import { ClientCreateResponse } from '../../models/responses/client/ClientCreateResponse.ts';
import { IClientRepository } from '../../repositories/clients/IClientRepository.ts';
import { ClientValidation } from '../../validation/client/ClientValidation.ts';
import { ClientValidationErrors } from '../../validation/errors/ClientValidationErrors.ts';
import { IClientService } from './IClientService.ts';
import { Connection } from 'mysql2/promise';

export class ClientService implements IClientService {
    private readonly _repository: IClientRepository;
    private readonly _validation: ClientValidation;

    constructor(repository: IClientRepository, validation: ClientValidation) {
        this._repository = repository;
        this._validation = validation;
    }

    public async linkClientWithUser(
        clientRequest: ClientCreateRequest
    ): Promise<ClientCreateResponse> {
        const response: ClientCreateResponse = new ClientCreateResponse();
        const validationErrors: ClientValidationErrors[] =
            this._validation.$CreateClientRequestValidation.validate(
                clientRequest
            );
        let databaseErrors: string[] = [];

        if (validationErrors.length !== 0) {
            response.validationErrors = validationErrors;
        } else {
            const currentDateTime = new Date();
            const client: Client = new Client(clientRequest.$Email);
            client.userId = clientRequest.$UserId;
            client.firstName = clientRequest.$FirstName;
            client.lastName = clientRequest.$LastName;
            client.phoneNumber = clientRequest.$PhoneNumber;
            client.creationDate = currentDateTime;
            client.updateDate = currentDateTime;
            client.uClientId = generateUniqueId({
                length: 16,
                useLetters: false,
                useNumbers: true,
            });

            try {
                const createdClient: Client =
                    await this._repository.createClient(client);
                response.createdClient = createdClient;
            } catch (error) {
                databaseErrors = handleException(error);

                response.databaseErrors = databaseErrors;
            }
        }

        return response;
    }

    public async linkClientWithUserWithConnection(
        connection: Connection,
        client: Client
    ): Promise<Client> {
        try {
            return await this._repository.createClientWithConnection(
                connection,
                client
            );
        } catch (error) {
            throw error;
        }
    }

    public get $Validation(): ClientValidation {
        return this._validation;
    }
}
