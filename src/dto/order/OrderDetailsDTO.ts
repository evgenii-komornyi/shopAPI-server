import { ClientDetailsDTO } from '../client/ClientDetailsDTO.ts';
import { OrderBasicDTO } from './OrderBasicDTO.ts';

export class OrderDetailsDTO extends OrderBasicDTO {
    private client: ClientDetailsDTO;

    public set $client(client: ClientDetailsDTO) {
        this.client = client;
    }
}
