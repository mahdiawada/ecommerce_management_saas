import logger from "../util/logger";
import { OrderItems } from "../model/orderItems.model";

export class OrderItemsBuilder {
    private orderItemId!: string;
    private orderId!: string;
    private productId!: string;
    private quantity!: number;
    private productSizeId?: string;

    public setOrderItemId(orderItemId: string): OrderItemsBuilder {
        this.orderItemId = orderItemId;
        return this;
    }

    public setOrderId(orderId: string): OrderItemsBuilder {
        this.orderId = orderId;
        return this;
    }

    public setProductId(productId: string): OrderItemsBuilder {
        this.productId = productId;
        return this;
    }

    public setQuantity(quantity: number): OrderItemsBuilder {
        this.quantity = quantity;
        return this;
    }

    public setProductSizeId(productSizeId: string | undefined): OrderItemsBuilder {
        this.productSizeId = productSizeId;
        return this;
    }

    build(): OrderItems {
        const requiredProps = [
            this.orderItemId,
            this.orderId,
            this.productId,
            this.quantity,
        ];

        for (const property of requiredProps) {
            if(property === null) {
                logger.error("Missing required property, couldn't build an order item");
                throw new Error("Missing required property");
            }
        }

        return new OrderItems(
            this.orderItemId,
            this.orderId,
            this.productId,
            this.quantity,
            this.productSizeId
        );
    }
}