import { Router } from "express";
import businessRoutes from "./business.routes";
import inventoryRoutes from "./inventory.routes";
import productRoutes from "./product.routes";
import productSizesRoutes from "./productSizes.routes";
import promoCodesRoutes from "./promoCodes.routes";
import customerRoutes from "./customer.routes";
import orderRoutes from "./order.routes";

const routes = Router();

routes.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

routes.use('/business', businessRoutes);
routes.use('/inventory', inventoryRoutes);
routes.use('/products', productRoutes);
routes.use('/product-sizes', productSizesRoutes);
routes.use('/promo-codes', promoCodesRoutes);
routes.use('/customers', customerRoutes);
routes.use('/orders', orderRoutes);

export default routes