import { UserValidationErrors } from '../../validation/errors/UserValidationErrors.ts';
import { BasicDTO } from '../BasicDTO.ts';
import { UserDetailsDTO } from './UserDetailsDTO.ts';

export class UserDTO extends BasicDTO<UserValidationErrors> {
    private user: UserDetailsDTO;

    public set $user(user: UserDetailsDTO) {
        this.user = user;
    }
}
