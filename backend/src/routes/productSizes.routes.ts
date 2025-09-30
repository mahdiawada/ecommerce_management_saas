import { Router } from "express";
import { ProductSizesController } from "../controllers/productSizes.controller";
import { ProductSizesService } from "../services/productSizes.service";
import { ProductSizesRepository } from "../repository/Postgres/productSizes.repository";

const productSizesController = new ProductSizesController(new ProductSizesService(new ProductSizesRepository()));
const route = Router();

route.post('/', productSizesController.createProductSize.bind(productSizesController));
route.get('/', productSizesController.getAllProductSizes.bind(productSizesController));
route.get('/product/:productId', productSizesController.getProductSizesByProduct.bind(productSizesController));
route.get('/:sizeId', productSizesController.getProductSizeById.bind(productSizesController));
route.put('/:sizeId', productSizesController.updateProductSize.bind(productSizesController));
route.delete('/:sizeId', productSizesController.deleteProductSize.bind(productSizesController));

export default route;

