import { Request, Response, Router } from 'express';
import { OrderCreateRequest } from '../models/requests/order/OrderCreateRequest.ts';
import { sanitize, trim } from '../helpers/validation.helper.ts';
import { DeliveryType } from '../enums/DeliveryType.ts';
import { IOrderRepository } from '../repositories/orders/IOrderRepository.ts';
import { OrderRepository } from '../repositories/orders/OrderRepository.ts';
import { OrderValidation } from '../validation/order/OrderValidation.ts';
import { CreateOrderRequestValidation } from '../validation/order/CreateOrderRequestValidation.ts';
import { FindOrderRequestValidation } from '../validation/order/FindOrderRequestValidation.ts';
import { ITransactionManager } from '../managers/ITransactionManager.ts';
import { TransactionManager } from '../managers/TransactionManager.ts';
import { IOrderService } from '../services/order/IOrderService.ts';
import { OrderService } from '../services/order/OrderService.ts';
import { OrderCreateResponse } from '../models/responses/order/OrderCreateResponse.ts';
import { OrderDTO } from '../dto/order/OrderDTO.ts';
import { Status } from '../enums/Status.ts';
import { Order } from '../models/Order.ts';
import { OrderDetailsDTO } from '../dto/order/OrderDetailsDTO.ts';
import { OrderItem } from '../models/OrderItem.ts';
import { Client } from '../models/Client.ts';
import { ClientDetailsDTO } from '../dto/client/ClientDetailsDTO.ts';
import { Address } from '../models/Address.ts';
import { AddressDetailsDTO } from '../dto/address/AddressDetailsDTO.ts';
import { OrderFindResponse } from '../models/responses/order/OrderFindResponse.ts';
import { OrderFindDTO } from '../dto/order/OrderFindDTO.ts';
import { OrderFindDetailsDTO } from '../dto/order/OrderFindDetailsDTO.ts';
import { Item } from '../models/Item.ts';
import { OrderItemDTO } from '../dto/order/OrderItemDTO.ts';
import { UpdateOrderRequestValidation } from '../validation/order/UpdateOrderRequestValidation.ts';

const router: Router = Router();

const _orderRepository: IOrderRepository = new OrderRepository();
const _orderValidation: OrderValidation = new OrderValidation(
    new CreateOrderRequestValidation(),
    new FindOrderRequestValidation(),
    new UpdateOrderRequestValidation()
);
const _transactionManager: ITransactionManager = new TransactionManager();

const _orderService: IOrderService = new OrderService(
    _orderRepository,
    _orderValidation,
    _transactionManager
);

router.post('/', async (req: Request, res: Response) => {
    const { email, firstName, lastName, phoneNumber } = req.body.client;
    const { deliveryType, deliveryComment, deliveryPrice, deliveryCountry } =
        req.body.orderInfo;

    const orderCreateRequest: OrderCreateRequest = new OrderCreateRequest();
    orderCreateRequest.userId = +sanitize(trim(String(req.body.userId)));
    orderCreateRequest.email = sanitize(trim(email));
    orderCreateRequest.firstName = sanitize(trim(firstName));
    orderCreateRequest.lastName = sanitize(trim(lastName));
    orderCreateRequest.phoneNumber = sanitize(trim(phoneNumber));
    orderCreateRequest.deliveryType = sanitize(trim(deliveryType));
    orderCreateRequest.deliveryComment = sanitize(trim(deliveryComment));
    orderCreateRequest.orderItems = _generateOrderItems(req.body.cart);

    if (deliveryType === DeliveryType.COURIER) {
        const { country, city, postalCode, address } = req.body.address;

        orderCreateRequest.country = sanitize(trim(country));
        orderCreateRequest.city = sanitize(trim(city));
        orderCreateRequest.postalCode = sanitize(trim(postalCode));
        orderCreateRequest.address = sanitize(trim(address));
        orderCreateRequest.deliveryPrice = sanitize(trim(deliveryPrice));
        orderCreateRequest.deliveryCountry = sanitize(trim(deliveryCountry));
    }

    try {
        const orderResponse: OrderCreateResponse =
            await _orderService.createOrder(orderCreateRequest);

        res.status(200).json({
            data: { ..._generateOrderDTO(orderResponse) },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

router.get('/:orderId', async (req: Request, res: Response) => {
    try {
        const response: OrderFindResponse = await _orderService.readOrder(
            req.body.userId,
            +req.params.orderId
        );

        res.status(200).json({
            data: { ..._generateOrderFindDTO(response) },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json('External server error.');
    }
});

const _generateOrderFindDTO = (response: OrderFindResponse): OrderFindDTO => {
    const orderFindDTO: OrderFindDTO = new OrderFindDTO();

    if (response.hasValidationErrors() || response.hasDatabaseErrors()) {
        orderFindDTO.$status = Status.FAILED;
        orderFindDTO.$validationErrors = response.$ValidationsErrors;
        orderFindDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        orderFindDTO.$order = _generateOrderFindDetailsDTO(
            response.$FoundOrder
        );
        orderFindDTO.$status = Status.SUCCESS;
    }

    return orderFindDTO;
};

const _generateOrderFindDetailsDTO = (order: Order): OrderFindDetailsDTO => {
    const orderFindDetailsDTO: OrderFindDetailsDTO = new OrderFindDetailsDTO();
    orderFindDetailsDTO.$id = order.$Id;
    orderFindDetailsDTO.$orderStatus = order.$Status;
    orderFindDetailsDTO.$uOrderId = order.$UOrderId;
    orderFindDetailsDTO.$deliveryType = order.$DeliveryType;
    orderFindDetailsDTO.$deliveryComment = order.$DeliveryComment;
    orderFindDetailsDTO.$orderDate = order.$OrderDate;
    orderFindDetailsDTO.$orderItems = _generateOrderItemsDTO(order.$OrderItems);

    return orderFindDetailsDTO;
};

const _generateOrderItemsDTO = (
    items: OrderItem[] | Item[]
): OrderItemDTO[] => {
    const orderItemsDTO: OrderItemDTO[] = [];

    items.forEach(item => {
        const orderItemDTO: OrderItemDTO = new OrderItemDTO();
        orderItemDTO.$id = item.$Id;
        orderItemDTO.$itemName = item.$ItemName;
        orderItemDTO.$itemPrice = item.$ItemPrice;
        orderItemDTO.$sex = item.Sex;
        orderItemDTO.$type = item.Type;
        orderItemDTO.$fileName = item.FileName;
        orderItemDTO.$quantity = item.Quantity;

        orderItemsDTO.push(orderItemDTO);
    });

    return orderItemsDTO;
};

const _generateOrderItems = (cart: any[]): OrderItem[] => {
    const orderItems: OrderItem[] = cart
        ? cart.map(item => {
              const orderItem: OrderItem = new OrderItem();
              orderItem.id = item.itemId;
              orderItem.quantity = item.quantity;
              orderItem.actualPrice = +item.actualPrice;

              return orderItem;
          })
        : [];

    return orderItems;
};

const _generateOrderDTO = (response: OrderCreateResponse): OrderDTO => {
    const orderDTO: OrderDTO = new OrderDTO();

    if (response.hasValidationErrors() || response.hasDatabaseErrors()) {
        orderDTO.$status = Status.FAILED;
        orderDTO.$validationErrors = response.$ValidationsErrors;
        orderDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        orderDTO.$order = _generateOrderDetailsDTO(response.$CreatedOrder);
        orderDTO.$status = Status.SUCCESS;
    }

    return orderDTO;
};

const _generateOrderDetailsDTO = (order: Order): OrderDetailsDTO => {
    const orderDetailsDTO: OrderDetailsDTO = new OrderDetailsDTO();
    orderDetailsDTO.$id = order.$Id;
    orderDetailsDTO.$orderStatus = order.$Status;
    orderDetailsDTO.$orderDate = order.$OrderDate;
    orderDetailsDTO.$deliveryType = order.$DeliveryType;
    orderDetailsDTO.$deliveryComment = order.$DeliveryComment;
    orderDetailsDTO.$uOrderId = order.$UOrderId;
    orderDetailsDTO.$client = _generateClientDetailsDTO(order.$Client);

    return orderDetailsDTO;
};

const _generateClientDetailsDTO = (client: Client): ClientDetailsDTO => {
    const clientDetailsDTO: ClientDetailsDTO = new ClientDetailsDTO();
    clientDetailsDTO.$id = client.$Id;
    clientDetailsDTO.$email = client.$Email;
    clientDetailsDTO.$firstName = client.$FirstName;
    clientDetailsDTO.$lastName = client.$LastName;
    clientDetailsDTO.$phoneNumber = client.$PhoneNumber;
    clientDetailsDTO.$uClientId = client.$UClientId;
    clientDetailsDTO.$address = _generateAddressDetailsDTO(client.$Address);

    return clientDetailsDTO;
};

const _generateAddressDetailsDTO = (address: Address): AddressDetailsDTO => {
    const addressDetailsDTO: AddressDetailsDTO = new AddressDetailsDTO();
    addressDetailsDTO.$country = address.$Country;
    addressDetailsDTO.$city = address.$City;
    addressDetailsDTO.$postalCode = address.$PostalCode;
    addressDetailsDTO.$address = address.$Address;

    return addressDetailsDTO;
};

export default router;
