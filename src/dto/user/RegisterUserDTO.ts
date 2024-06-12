import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';

export class RegisterUserDTO extends BasicDTO<UserValidationErrors> {
    protected id: number;
    protected email: string;
    protected createdAt: Date;
    protected updatedAt: Date;
    protected lastLoginAt: Date | null;
    protected isActive: boolean;
    protected isVerified: boolean;
    protected uUserId: string;

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
}
