import logger from "../util/logger";
import { Order } from "../model/order.model";

export class OrderBuilder {
    private orderId!: string;
    private orderNumber!: string;
    private businessId!: string;
    private customerId!: string;
    private orderStatus!: string;
    private orderSource!: string;
    private paymentMethod!: string;
    private totalPrice!: number;
    private promoCodeId?: string;
    private createdAt!: Date;

    public setOrderId(orderId: string): OrderBuilder {
        this.orderId = orderId;
        return this;
    }

    public setOrderNumber(orderNumber: string): OrderBuilder {
        this.orderNumber = orderNumber;
        return this;
    }

    public setBusinessId(businessId: string): OrderBuilder {
        this.businessId = businessId;
        return this;
    }

    public setCustomerId(customerId: string): OrderBuilder {
        this.customerId = customerId;
        return this;
    }

    public setOrderStatus(orderStatus: string): OrderBuilder {
        this.orderStatus = orderStatus;
        return this;
    }

    public setOrderSource(orderSource: string): OrderBuilder {
        this.orderSource = orderSource;
        return this;
    }

    public setPaymentMethod(paymentMethod: string): OrderBuilder {
        this.paymentMethod = paymentMethod;
        return this;
    }

    public setPromoCodeId(promoCodeId: string | undefined): OrderBuilder {
        this.promoCodeId = promoCodeId;
        return this;
    }

    public setTotalPrice(totalPrice: number): OrderBuilder {
        this.totalPrice = totalPrice;
        return this;
    }

    public setCreatedAt(createdAt: Date): OrderBuilder {
        this.createdAt = createdAt;
        return this;
    }

    build(): Order {
        const requiredProps = [
            this.orderId,
            this.orderNumber,
            this.businessId,
            this.customerId,
            this.orderStatus,
            this.orderSource,
            this.paymentMethod,
            this.totalPrice,
            this.createdAt
        ];

        for (const property of requiredProps) {
            if(!property) {
                logger.error("Missing required property, couldn't build an order");
                throw new Error("Missing required property");
            }
        }

        return new Order(
            this.orderId,
            this.orderNumber,
            this.businessId,
            this.customerId,
            this.orderStatus,
            this.orderSource,
            this.paymentMethod,
            this.totalPrice,
            this.promoCodeId,
            this.createdAt
        );
    }
}