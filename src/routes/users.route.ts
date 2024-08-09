import { Request, Response, Router } from 'express';
import { UserRepository } from '../repositories/users/UserRepository.ts';
import { UserValidation } from '../validation/user/UserValidation.ts';
import { Status } from '../enums/Status.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';
import { UserService } from '../services/user/UserService.ts';
import { IUserService } from '../services/user/IUserService.ts';
import { FindUserValidation } from '../validation/user/FindUserRequestValidation.ts';
import { CreateUserRequestValidation } from '../validation/user/CreateUserRequestValidation.ts';
import { LoginUserValidation } from '../validation/user/LoginUserValidation.ts';
import { UserFindRequest } from '../models/requests/user/UserFindRequest.ts';
import { UserFindResponse } from '../models/responses/user/UserFindResponse.ts';
import { UserDTO } from '../dto/user/UserDTO.ts';
import { User } from '../models/User.ts';
import { UserDetailsDTO } from '../dto/user/UserDetailsDTO.ts';
import { Client } from '../models/Client.ts';
import { ClientDetailsDTO } from '../dto/client/ClientDetailsDTO.ts';
import { ClientService } from '../services/client/ClientService.ts';
import { AddressService } from '../services/address/AddressService.ts';
import { ClientRepository } from '../repositories/clients/ClientRepository.ts';
import { ClientValidation } from '../validation/client/ClientValidation.ts';
import { CreateClientRequestValidation } from '../validation/client/CreateClientRequestValidation.ts';
import { AddressRepository } from '../repositories/address/AddressRepository.ts';
import { AddressValidation } from '../validation/address/AddressValidation.ts';
import { CreateAddressRequestValidation } from '../validation/address/CreateAddressRequestValidation.ts';
import { ClientUpdateRequest } from '../models/requests/client/ClientUpdateRequest.ts';
import { AddressUpdateRequest } from '../models/requests/address/AddressUpdateRequest.ts';
import { UpdateAddressRequestValidation } from '../validation/address/UpdateAddressRequestValidation.ts';
import { UpdateClientRequestValidation } from '../validation/client/UpdateClientRequestValidation.ts';
import { ClientUpdateResponse } from '../models/responses/client/ClientUpdateResponse.ts';
import { IClientService } from '../services/client/IClientService.ts';
import { IAddressService } from '../services/address/IAddressService.ts';
import { ClientDTO } from '../dto/client/ClientDTO.ts';
import { AddressUpdateResponse } from '../models/responses/address/AddressUpdateResponse.ts';
import { AddressDTO } from '../dto/address/AddressDTO.ts';
import { Address } from '../models/Address.ts';
import { AddressDetailsDTO } from '../dto/address/AddressDetailsDTO.ts';

const clientService: IClientService = new ClientService(
    new ClientRepository(),
    new ClientValidation(
        new CreateClientRequestValidation(),
        new UpdateClientRequestValidation()
    )
);

const addressService: IAddressService = new AddressService(
    new AddressRepository(),
    new AddressValidation(
        new CreateAddressRequestValidation(),
        new UpdateAddressRequestValidation()
    )
);

const userService: IUserService = new UserService(
    new UserRepository(),
    clientService,
    addressService,
    new UserValidation(
        new CreateUserRequestValidation(),
        new LoginUserValidation(),
        new FindUserValidation()
    )
);

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const userFindRequest: UserFindRequest = new UserFindRequest();
    userFindRequest.userId = +sanitize(trim(String(req.body.userId)));

    try {
        const userResponse: UserFindResponse = await userService.getUserById(
            userFindRequest
        );

        return res.status(200).json({
            data: { ..._generateUserDTO(userResponse) },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

router.patch('/client/:id', async (req: Request, res: Response) => {
    const { firstName, lastName, phoneNumber } = req.body;
    const { id } = req.params;

    const updateRequest: ClientUpdateRequest = new ClientUpdateRequest();
    updateRequest.id = +sanitize(trim(String(id)));
    updateRequest.firstName = sanitize(trim(firstName));
    updateRequest.lastName = sanitize(trim(lastName));
    updateRequest.phoneNumber = sanitize(trim(phoneNumber));

    const clientResponse: ClientUpdateResponse =
        await clientService.updateClient(updateRequest);

    if (clientResponse) {
        return res.status(200).json({
            data: _generateClientDTO(clientResponse),
        });
    }
});

router.patch('/address/:id', async (req: Request, res: Response) => {
    const { address } = req.body;
    const { id } = req.params;

    const updateRequest: AddressUpdateRequest = new AddressUpdateRequest();
    updateRequest.id = +sanitize(trim(String(id)));
    updateRequest.address = sanitize(trim(address));

    const addressResponse: AddressUpdateResponse =
        await addressService.updateAddress(updateRequest);

    if (addressResponse) {
        return res.status(200).json({
            data: _generateAddressDTO(addressResponse),
        });
    }
});

const _generateUserDTO = (userResponse: UserFindResponse): UserDTO => {
    const userDTO: UserDTO = new UserDTO();

    if (
        userResponse.hasValidationErrors() ||
        userResponse.hasDatabaseErrors()
    ) {
        userDTO.$status = Status.FAILED;
        userDTO.$validationErrors = userResponse.$ValidationsErrors;
        userDTO.$databaseErrors = userResponse.$DatabaseErrors;
    } else {
        userDTO.$status = Status.SUCCESS;
        userDTO.$user = _generateUserDetailsDTO(userResponse.$FoundUser);
    }

    return userDTO;
};

const _generateUserDetailsDTO = (
    user: User,
    token: string | undefined = undefined
): UserDetailsDTO => {
    const userDetailsDTO = new UserDetailsDTO();

    if (token) {
        userDetailsDTO.$token = token;
    }

    userDetailsDTO.$id = user.$Id;
    userDetailsDTO.$email = user.$Email;
    userDetailsDTO.$createAt = user.$CreatedAt;
    userDetailsDTO.$updateAt = user.$UpdatedAt;
    userDetailsDTO.$lastLoginAt = user.$LastLoginAt;
    userDetailsDTO.$isActive = user.$IsActive;
    userDetailsDTO.$isVerified = user.$IsVerified;
    userDetailsDTO.$uUserId = user.$UUserId;
    userDetailsDTO.$client = _generateClientDetailsDTO(user.$Client);

    return userDetailsDTO;
};

const _generateClientDetailsDTO = (client: Client): ClientDetailsDTO => {
    const clientDetailsDTO: ClientDetailsDTO = new ClientDetailsDTO();
    clientDetailsDTO.$id = client.$Id;
    clientDetailsDTO.$email = client.$Email;
    clientDetailsDTO.$firstName = client.$FirstName;
    clientDetailsDTO.$lastName = client.$LastName;
    clientDetailsDTO.$phoneNumber = client.$PhoneNumber;
    clientDetailsDTO.$creationDate = client.$CreationDate;
    clientDetailsDTO.$updateDate = client.$UpdateDate;
    clientDetailsDTO.$uClientId = client.$UClientId;
    clientDetailsDTO.$userId = client.$UserId;
    if (client.$Address) {
        clientDetailsDTO.$address = _generateAddressDetailsDTO(client.$Address);
    }

    return clientDetailsDTO;
};

const _generateAddressDetailsDTO = (address: Address): AddressDetailsDTO => {
    const addressDetailsDTO: AddressDetailsDTO = new AddressDetailsDTO();
    addressDetailsDTO.$id = address.$Id;
    addressDetailsDTO.$country = address.$Country;
    addressDetailsDTO.$city = address.$City;
    addressDetailsDTO.$postalCode = address.$PostalCode;
    addressDetailsDTO.$address = address.$Address;
    addressDetailsDTO.$clientId = address.$ClientId;

    return addressDetailsDTO;
};

const _generateAddressDTO = (
    addressResponse: AddressUpdateResponse
): AddressDTO => {
    const addressDTO: AddressDTO = new AddressDTO();

    if (
        addressResponse.hasValidationErrors() ||
        addressResponse.hasDatabaseErrors()
    ) {
        addressDTO.$status = Status.FAILED;
        addressDTO.$validationErrors = addressResponse.$ValidationsErrors;
        addressDTO.$databaseErrors = addressResponse.$DatabaseErrors;
    } else {
        addressDTO.$status = Status.SUCCESS;
        addressDTO.$address = _generateAddressDetailsDTO(
            addressResponse.$UpdatedAddress
        );
    }

    return addressDTO;
};

const _generateClientDTO = (
    clientResponse: ClientUpdateResponse
): ClientDTO => {
    const clientDTO: ClientDTO = new ClientDTO();

    if (
        clientResponse.hasValidationErrors() ||
        clientResponse.hasDatabaseErrors()
    ) {
        clientDTO.$status = Status.FAILED;
        clientDTO.$validationErrors = clientResponse.$ValidationsErrors;
        clientDTO.$databaseErrors = clientResponse.$DatabaseErrors;
    } else {
        clientDTO.$status = Status.SUCCESS;
        clientDTO.$client = _generateClientDetailsDTO(
            clientResponse.$UpdatedClient
        );
    }

    return clientDTO;
};

export default router;
