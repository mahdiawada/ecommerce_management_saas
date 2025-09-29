import { Order } from "../../model/order.model";
import { IMapper } from "../IMapper";
import { OrderBuilder } from "../../builders/order.builder";

export interface PostgresOrder {
    order_id: string;
    order_number: string;
    business_id: string;
    customer_id: string;
    order_status: string;
    order_source: string;
    payment_method: string;
    total_price: number;
    promo_code_id?: string;
    created_at: Date;
}

export class OrderMapper implements IMapper<PostgresOrder, Order> {
    map(data: PostgresOrder): Order {
        const builder = new OrderBuilder()
            .setOrderId(data.order_id)
            .setOrderNumber(data.order_number)
            .setBusinessId(data.business_id)
            .setCustomerId(data.customer_id)
            .setOrderStatus(data.order_status)
            .setOrderSource(data.order_source)
            .setPaymentMethod(data.payment_method)
            .setTotalPrice(data.total_price)
            .setCreatedAt(data.created_at)
            .setPromoCodeId(data.promo_code_id)
            
        return builder.build();
    }

    reverseMap(data: Order): PostgresOrder {
        return {
            order_id: data.getOrderId(),
            order_number: data.getOrderNumber(),
            business_id: data.getBusinessId(),
            customer_id: data.getCustomerId(),
            order_status: data.getOrderStatus(),
            order_source: data.getOrderSource(),
            payment_method: data.getPaymentMethod(),
            total_price: data.getTotalPrice(),
            promo_code_id: data.getPromoCodeId(),
            created_at: data.getCreatedAt()
        };
    }
}