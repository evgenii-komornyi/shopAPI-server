import { ClientDetailsDTO } from '../client/ClientDetailsDTO.ts';

export class UserDetailsDTO {
    protected id: number;
    protected email: string;
    protected createdAt: Date;
    protected updatedAt: Date;
    protected lastLoginAt: Date | null;
    protected isActive: boolean;
    protected isVerified: boolean;
    protected uUserId: string;
    protected client: ClientDetailsDTO;
    protected token: string;

    public set $id(id: number) {
        this.id = id;
    }

    public set $email(email: string) {
        this.email = email;
    }

    public set $createAt(createdAt: Date) {
        this.createdAt = createdAt;
    }

    public set $updateAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    public set $lastLoginAt(lastLoginAt: Date) {
        this.lastLoginAt = lastLoginAt;
    }

    public set $isActive(isActive: boolean) {
        this.isActive = isActive;
    }

    public set $isVerified(isVerified: boolean) {
        this.isVerified = isVerified;
    }

    public set $uUserId(uUserId: string) {
        this.uUserId = uUserId;
    }

    public set $client(client: ClientDetailsDTO) {
        this.client = client;
    }

    public set $token(token: string) {
        this.token = token;
    }
}
