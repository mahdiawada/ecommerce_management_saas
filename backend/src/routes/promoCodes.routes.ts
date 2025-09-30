import { Router } from "express";
import { PromoCodesController } from "../controllers/promoCodes.controller";
import { PromoCodesService } from "../services/promoCodes.service";
import { PromoCodesRepository } from "../repository/Postgres/promoCodes.repository";

const promoCodesController = new PromoCodesController(new PromoCodesService(new PromoCodesRepository()));
const route = Router();

route.post('/', promoCodesController.createPromoCode.bind(promoCodesController));
route.get('/', promoCodesController.getAllPromoCodes.bind(promoCodesController));
route.get('/:promoCodeId', promoCodesController.getPromoCodeById.bind(promoCodesController));
route.get('/business/:businessId', promoCodesController.getPromoCodesByBusiness.bind(promoCodesController));
route.get('/business/:businessId/active', promoCodesController.getActivePromoCodesByBusiness.bind(promoCodesController));
route.put('/:promoCodeId', promoCodesController.updatePromoCode.bind(promoCodesController));
route.delete('/:promoCodeId', promoCodesController.deletePromoCode.bind(promoCodesController));
route.post('/validate', promoCodesController.validatePromoCode.bind(promoCodesController));
route.post('/:promoCodeId/activate', promoCodesController.activatePromoCode.bind(promoCodesController));
route.post('/:promoCodeId/deactivate', promoCodesController.deactivatePromoCode.bind(promoCodesController));

export default route;

