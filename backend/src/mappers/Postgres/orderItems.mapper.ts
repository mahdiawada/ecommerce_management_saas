import { OrderItems } from "../../model/orderItems.model";
import { IMapper } from "../IMapper";
import { OrderItemsBuilder } from "../../builders/orderItems.builder";

export interface PostgresOrderItems {
    order_item_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    product_size_id?: string;
}

export class OrderItemsMapper implements IMapper<PostgresOrderItems, OrderItems> {
    map(data: PostgresOrderItems): OrderItems {
        return new OrderItemsBuilder()
            .setOrderItemId(data.order_item_id)
            .setOrderId(data.order_id)
            .setProductId(data.product_id)
            .setQuantity(data.quantity)
            .setProductSizeId(data.product_size_id)
            .build();
    }

    reverseMap(data: OrderItems): PostgresOrderItems {
        return {
            order_item_id: data.getOrderItemId(),
            order_id: data.getOrderId(),
            product_id: data.getProductId(),
            quantity: data.getQuantity(),
            product_size_id: data.getProductSizeId()
        };
    }
}