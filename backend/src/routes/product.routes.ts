import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repository/Postgres/product.repository";

const productController = new ProductController(new ProductService(new ProductRepository()));
const route = Router();

route.post('/', productController.createProduct.bind(productController));
route.get('/business/:businessId', productController.getProductsByBusiness.bind(productController));
route.get('/inventory/:inventoryId', productController.getProductsByInventory.bind(productController));
route.get('/:productId', productController.getProductById.bind(productController));
route.put('/:productId', productController.updateProduct.bind(productController));
route.delete('/:productId', productController.deleteProduct.bind(productController));

export default route;

