import { NextFunction, Request, Response, Router } from 'express';
import { IDeliveryRepository } from '../repositories/delivery/IDeliveryRepository.ts';
import { DeliveryRepository } from '../repositories/delivery/DeliveryRepository.ts';

const router: Router = Router();

const _deliveryRepository: IDeliveryRepository = new DeliveryRepository();

router.get(
    '/:country',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await _deliveryRepository.readDeliveryPriceByCountry(
                req.params.country
            );

            if (data?.Price === undefined || isNaN(Number(data.Price))) {
                return res.status(200).json({
                    data: {
                        error: `We do not work with ${req.params.country}. Please provide a correct country.`,
                    },
                });
            }

            const formattedPrice = Number(data.Price).toFixed(2);

            res.status(200).json({
                data: {
                    country: req.params.country,
                    price: formattedPrice,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
