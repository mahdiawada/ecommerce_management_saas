import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repository/Postgres/order.repository";
import { OrderItemsRepository } from "../repository/Postgres/orderItems.repository";
import { ProductRepository } from "../repository/Postgres/product.repository";

const orderController = new OrderController(new OrderService(new OrderRepository(), new OrderItemsRepository(), new ProductRepository()));
const route = Router();

route.post('/', orderController.createOrder.bind(orderController));
route.get('/', orderController.getAllOrders.bind(orderController));

route.get('/:orderId/items', orderController.getOrderItems.bind(orderController));
route.post('/:orderId/items', orderController.addOrderItem.bind(orderController));
route.delete('/items/:orderItemId', orderController.removeOrderItem.bind(orderController));

route.get('/:orderId', orderController.getOrderById.bind(orderController));
route.put('/:orderId', orderController.updateOrder.bind(orderController));
route.delete('/:orderId', orderController.deleteOrder.bind(orderController));

export default route;


