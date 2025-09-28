export class Order {
    private orderId: string;
    private businessId: string;
    private customerId: string;
    private orderNumber: string;
    private orderStatus: string;
    private orderSource: string;
    private paymentMethod: string;
    private totalPrice: number;
    private promoCodeId?: string;
    private createdAt: Date;

    constructor(
        orderId: string,
        orderNumber: string,
        businessId: string,
        customerId: string,
        orderStatus: string,
        orderSource: string,
        paymentMethod: string,
        totalPrice: number,
        promoCodeId: string | undefined,
        createdAt: Date
    ) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.businessId = businessId;
        this.customerId = customerId;
        this.orderStatus = orderStatus;
        this.orderSource = orderSource;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.promoCodeId = promoCodeId;
        this.createdAt = createdAt;
    }

    public getOrderId(): string {
        return this.orderId;
    }

    public getOrderNumber(): string {
        return this.orderNumber;
    }

    public getBusinessId(): string {
        return this.businessId;
    }

    public getCustomerId(): string {
        return this.customerId;
    }

    public getOrderStatus(): string {
        return this.orderStatus;
    }

    public getOrderSource(): string {
        return this.orderSource;
    }

    public getPaymentMethod(): string {
        return this.paymentMethod;
    }

    public getTotalPrice(): number {
        return this.totalPrice;
    }

    public getPromoCodeId(): string | undefined {
        return this.promoCodeId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}