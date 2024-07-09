import { ClientValidationErrors } from '../../validation/errors/ClientValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { ClientDetailsDTO } from './ClientDetailsDTO.ts';

export class ClientDTO extends BasicDTO<ClientValidationErrors> {
    private client: ClientDetailsDTO;

    public set $client(client: ClientDetailsDTO) {
        this.client = client;
    }
}
