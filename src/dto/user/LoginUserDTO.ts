import { RegisterUserDTO } from './RegisterUserDTO.ts';

export class LoginUserDTO extends RegisterUserDTO {
    private token: string;

    public set $token(token: string) {
        this.token = token;
    }
}
