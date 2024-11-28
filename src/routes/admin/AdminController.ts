import { Request, Response, Router } from 'express';
import { JWTVerification } from '../../middlewares/JWTVerification.ts';
import { OrderFindResponse } from '../../models/responses/order/OrderFindResponse.ts';
import { IAdminOrderService } from '../../services/admin/IAdminOrderService.ts';
import { AdminOrderService } from '../../services/admin/AdminOrderService.ts';
import { IAdminOrderRepository } from '../../repositories/admin/IAdminOrderRepository.ts';
import { AdminOrderRepository } from '../../repositories/admin/AdminOrderRepository.ts';
import { ITransactionManager } from '../../managers/ITransactionManager.ts';
import { TransactionManager } from '../../managers/TransactionManager.ts';
import { OrderFindDetailsDTO } from '../../dto/order/OrderFindDetailsDTO.ts';
import { Order } from '../../models/Order.ts';
import { Status } from '../../enums/Status.ts';
import { OrderFindDTO } from '../../dto/order/OrderFindDTO.ts';
import { OrdersDTO } from '../../dto/admin/OrdersDTO.ts';
import { OrderUpdateResponse } from '../../models/responses/order/OrderUpdateResponse.ts';
import { OrderValidation } from '../../validation/order/OrderValidation.ts';
import { CreateOrderRequestValidation } from '../../validation/order/CreateOrderRequestValidation.ts';
import { FindOrderRequestValidation } from '../../validation/order/FindOrderRequestValidation.ts';
import { UpdateOrderRequestValidation } from '../../validation/order/UpdateOrderRequestValidation.ts';
import { OrderUpdateRequest } from '../../models/requests/order/OrderUpdateRequest.ts';
import { sanitize, trim } from '../../helpers/validation.helper.ts';
import { OrderUpdateDTO } from '../../dto/order/OrderUpdateDTO.ts';
import { OrderUpdateDetailsDTO } from '../../dto/order/OrderUpdateDetailsDTO.ts';
import { OrderStatusResponse } from '../../models/responses/order-status/OrderStatusResponse.ts';
import { OrderStatusesDTO } from '../../dto/order-status/OrderStatusesDTO.ts';
import { OrderStatusDetailsDTO } from '../../dto/order-status/OrderStatusDetailsDTO.ts';
import { OrderStatus } from '../../models/OrderStatus.ts';
import { Client } from '../../models/Client.ts';
import { ClientDetailsDTO } from '../../dto/client/ClientDetailsDTO.ts';
import { Address } from '../../models/Address.ts';
import { AddressDetailsDTO } from '../../dto/address/AddressDetailsDTO.ts';
import { OrderItem } from '../../models/OrderItem.ts';
import { Item } from '../../models/Item.ts';
import { OrderItemDTO } from '../../dto/order/OrderItemDTO.ts';

const router: Router = Router();

const _jwtVerification: JWTVerification = new JWTVerification();
const _adminOrderRepository: IAdminOrderRepository = new AdminOrderRepository();
const _transactionManager: ITransactionManager = new TransactionManager();
const _orderValidation: OrderValidation = new OrderValidation(
    new CreateOrderRequestValidation(),
    new FindOrderRequestValidation(),
    new UpdateOrderRequestValidation()
);

const _adminOrderService: IAdminOrderService = new AdminOrderService(
    _adminOrderRepository,
    _transactionManager,
    _orderValidation
);

router.get(
    '/orders/:id',
    _jwtVerification.verifyAdmin,
    async (req: Request, res: Response) => {
        try {
            const orderResponse: OrderFindResponse =
                await _adminOrderService.readOrderById(+req.params.id);

            res.status(200).json({
                data: _generateFindOrderDTO(orderResponse),
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json('External server error.');
        }
    }
);

router.get(
    '/orders',
    _jwtVerification.verifyAdmin,
    async (req: Request, res: Response) => {
        try {
            const orderResponse: OrderFindResponse =
                await _adminOrderService.readOrders();

            res.status(200).json({
                data: _generateOrdersDTO(orderResponse),
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json('External server error.');
        }
    }
);

router.patch(
    '/orders/:id',
    _jwtVerification.verifyAdmin,
    async (req: Request, res: Response) => {
        const { statusId } = req.body;
        const { id } = req.params;

        const request: OrderUpdateRequest = new OrderUpdateRequest();
        request.orderId = +sanitize(trim(String(id)));
        request.statusId = +sanitize(trim(String(statusId)));

        try {
            const updateResponse: OrderUpdateResponse =
                await _adminOrderService.updateOrderStatus(request);

            res.status(200).json({
                data: _generateOrderUpdateDTO(updateResponse),
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json('External server error.');
        }
    }
);

router.get(
    '/statuses',
    _jwtVerification.verifyAdmin,
    async (req: Request, res: Response) => {
        try {
            const response: OrderStatusResponse =
                await _adminOrderService.readOrderStatuses();

            res.status(200).json({
                data: _generateStatusesDTO(response),
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json('External server error.');
        }
    }
);

const _generateStatusesDTO = (
    response: OrderStatusResponse
): OrderStatusesDTO => {
    const statusesDTO: OrderStatusesDTO = new OrderStatusesDTO();

    if (response.hasDatabaseErrors()) {
        statusesDTO.$status = Status.FAILED;
        statusesDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        statusesDTO.$status = Status.SUCCESS;
        statusesDTO.$statuses = response.$OrderStatuses.map(status =>
            _generateOrderStatusDetailsDTO(status)
        );
    }

    return statusesDTO;
};

const _generateOrderStatusDetailsDTO = (
    status: OrderStatus
): OrderStatusDetailsDTO => {
    const statusDTO: OrderStatusDetailsDTO = new OrderStatusDetailsDTO();
    statusDTO.$id = status.$Id;
    statusDTO.$status = status.$Status;

    return statusDTO;
};

const _generateOrdersDTO = (response: OrderFindResponse): OrdersDTO => {
    const ordersDTO: OrdersDTO = new OrdersDTO();

    if (response.hasDatabaseErrors()) {
        ordersDTO.$status = Status.FAILED;
        ordersDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        ordersDTO.$orders = response.$FoundOrders.map(orderItem =>
            _generateFindOrderDetailsDTO(orderItem)
        );

        ordersDTO.$status = Status.SUCCESS;
    }

    return ordersDTO;
};

const _generateOrderUpdateDTO = (
    response: OrderUpdateResponse
): OrderUpdateDTO => {
    const orderUpdateDTO: OrderUpdateDTO = new OrderUpdateDTO();

    if (response.hasValidationErrors() || response.hasDatabaseErrors()) {
        orderUpdateDTO.$status = Status.FAILED;
        orderUpdateDTO.$validationErrors = response.$ValidationsErrors;
        orderUpdateDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        orderUpdateDTO.$order = _generateOrderUpdateDetailsDTO(
            response.$UpdatedOrder
        );
        orderUpdateDTO.$status = Status.SUCCESS;
    }

    return orderUpdateDTO;
};

const _generateFindOrderDTO = (response: OrderFindResponse): OrderFindDTO => {
    const orderFindDTO: OrderFindDTO = new OrderFindDTO();

    if (response.hasValidationErrors() || response.hasDatabaseErrors()) {
        orderFindDTO.$status = Status.FAILED;
        orderFindDTO.$validationErrors = response.$ValidationsErrors;
        orderFindDTO.$databaseErrors = response.$DatabaseErrors;
    } else {
        orderFindDTO.$order = _generateFindOrderDetailsDTO(
            response.$FoundOrder
        );
        orderFindDTO.$status = Status.SUCCESS;
    }

    return orderFindDTO;
};

const _generateFindOrderDetailsDTO = (order: Order): OrderFindDetailsDTO => {
    const orderFindDetailsDTO: OrderFindDetailsDTO = new OrderFindDetailsDTO();

    const deliveryPrice: string = order.$DeliveryPrice;

    orderFindDetailsDTO.$id = order.$Id;
    orderFindDetailsDTO.$orderStatusId = order.$StatusId;
    orderFindDetailsDTO.$orderStatus = order.$Status;
    orderFindDetailsDTO.$uOrderId = order.$UOrderId;
    orderFindDetailsDTO.$deliveryPrice = deliveryPrice;
    orderFindDetailsDTO.$deliveryType = order.$DeliveryType;
    orderFindDetailsDTO.$deliveryComment = order.$DeliveryComment;
    orderFindDetailsDTO.$orderDate = order.$OrderDate;
    orderFindDetailsDTO.$clientId = order.$ClientId;
    orderFindDetailsDTO.$addressId = order.$DeliveryAddressId;

    const client: Client = order.$Client;
    const orderItems: OrderItem[] | Item[] = order.$OrderItems;

    if (client) {
        orderFindDetailsDTO.$client = _generateClientDetailsDTO(client);
    }

    if (orderItems && orderItems.length > 0) {
        orderFindDetailsDTO.$orderItems = orderItems.map(item =>
            _generateOrderItemDTO(item)
        );
        orderFindDetailsDTO.$totalPrice = _calculateTotalPrice(
            orderItems,
            deliveryPrice
        );
    }

    return orderFindDetailsDTO;
};

const _generateOrderUpdateDetailsDTO = (
    order: Order
): OrderUpdateDetailsDTO => {
    const orderUpdateDetailsDTO: OrderUpdateDetailsDTO =
        new OrderUpdateDetailsDTO();

    orderUpdateDetailsDTO.$id = order.$Id;
    orderUpdateDetailsDTO.$orderStatusId = order.$StatusId;
    orderUpdateDetailsDTO.$orderStatus = order.$Status;
    orderUpdateDetailsDTO.$uOrderId = order.$UOrderId;
    orderUpdateDetailsDTO.$deliveryPrice = order.$DeliveryPrice;
    orderUpdateDetailsDTO.$deliveryType = order.$DeliveryType;
    orderUpdateDetailsDTO.$deliveryComment = order.$DeliveryComment;
    orderUpdateDetailsDTO.$orderDate = order.$OrderDate;
    orderUpdateDetailsDTO.$clientId = order.$ClientId;
    orderUpdateDetailsDTO.$addressId = order.$DeliveryAddressId;

    return orderUpdateDetailsDTO;
};

const _generateClientDetailsDTO = (client: Client): ClientDetailsDTO => {
    const clientDetailsDTO: ClientDetailsDTO = new ClientDetailsDTO();
    clientDetailsDTO.$id = client.$Id;
    clientDetailsDTO.$email = client.$Email;
    clientDetailsDTO.$firstName = client.$FirstName;
    clientDetailsDTO.$lastName = client.$LastName;
    clientDetailsDTO.$phoneNumber = client.$PhoneNumber;

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

const _generateOrderItemDTO = (item: Item): OrderItemDTO => {
    const orderItemDTO: OrderItemDTO = new OrderItemDTO();
    orderItemDTO.$id = item.$Id;
    orderItemDTO.$itemName = item.$ItemName;
    orderItemDTO.$type = item.$Type;
    orderItemDTO.$fileName = item.$FileName;
    orderItemDTO.$itemPrice = item.$ItemPrice;
    orderItemDTO.$quantity = item.$Quantity;
    orderItemDTO.$sex = item.$Sex;

    return orderItemDTO;
};

const _calculateTotalPrice = (
    orderItems: (Item | OrderItem)[],
    deliveryPrice: string
): number => {
    const itemsTotalPrice = orderItems.reduce((acc, item) => {
        if ('$ItemPrice' in item) {
            return acc + item.$ItemPrice * item.$Quantity;
        }
    }, 0);

    return itemsTotalPrice + Number(deliveryPrice);
};

export default router;
