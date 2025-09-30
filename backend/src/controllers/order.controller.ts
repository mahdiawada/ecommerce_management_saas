import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { ApiException } from "../util/exceptions/ApiException";

export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    public async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body;
            if (!payload) {
                throw new Error("Order payload is required");
            }

            const orderId = await this.orderService.createOrder(payload);
            res.status(201).json({ orderId });
        } catch (error) {
            next(new ApiException(400, "Error creating order", error as Error));
        }
    }

    public async getOrderById(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                throw new Error("Order id is required");
            }

            const order = await this.orderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiException(400, "Error getting order by id", error as Error));
        }
    }

    public async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            next(new ApiException(400, "Error getting all orders", error as Error));
        }
    }

    public async updateOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                throw new Error("Order id is required");
            }

            const payload = req.body;
            const order = await this.orderService.updateOrder(orderId, payload);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiException(400, "Error updating order", error as Error));
        }
    }

    public async deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                throw new Error("Order id is required");
            }

            await this.orderService.deleteOrder(orderId);
            res.status(204).send();
        } catch (error) {
            next(new ApiException(400, "Error deleting order", error as Error));
        }
    }

    public async getOrderItems(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                throw new Error("Order id is required");
            }

            const items = await this.orderService.getOrderItems(orderId);
            res.status(200).json(items);
        } catch (error) {
            next(new ApiException(400, "Error getting order items", error as Error));
        }
    }

    public async addOrderItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                throw new Error("Order id is required");
            }

            const payload = req.body;
            if (!payload) {
                throw new Error("Order item payload is required");
            }

            await this.orderService.addItem(orderId, payload);
            res.status(201).json({ message: "Order item added successfully" });
        } catch (error) {
            next(new ApiException(400, "Error adding order item", error as Error));
        }
    }

    public async removeOrderItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderItemId } = req.params;
            if (!orderItemId) {
                throw new Error("Order item id is required");
            }

            await this.orderService.removeItem(orderItemId);
            res.status(204).send();
        } catch (error) {
            next(new ApiException(400, "Error removing order item", error as Error));
        }
    }
}


