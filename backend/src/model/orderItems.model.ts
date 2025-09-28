export class OrderItems {
    private orderItemId: string;
    private orderId: string;
    private productId: string;
    private productSizeId?: string;
    private quantity: number;

    constructor(
        orderItemId: string,
        orderId: string,
        productId: string,
        quantity: number,
        productSizeId?: string
    ) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.productSizeId = productSizeId;
    }

    public getOrderItemId(): string {
        return this.orderItemId;
    }

    public getOrderId(): string {
        return this.orderId;
    }

    public getProductId(): string {
        return this.productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getProductSizeId(): string | undefined{
        return this.productSizeId;
    }
}