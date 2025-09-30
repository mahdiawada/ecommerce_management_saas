import { Router } from "express";
import { BusinessController } from "../controllers/business.controller";
import { BusinessService } from "../services/business.service";
import { BusinessRepository } from "../repository/Postgres/business.repository";

const businessController = new BusinessController(new BusinessService(new BusinessRepository()));
const route = Router();

route.route('/:businessId')
    .get(businessController.getBusinessById.bind(businessController))
    .put(businessController.updateBusiness.bind(businessController))
    .delete(businessController.deleteBusiness.bind(businessController));

route.route('/')
    .get(businessController.getAllBusinesses.bind(businessController))
    .post(businessController.createBusiness.bind(businessController));

export default route;