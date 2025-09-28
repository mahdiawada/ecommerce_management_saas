export class CheckoutLinks {
    private linkId: string;
    private orderId: string;
    private uniqueToken: string;
    private isActive: boolean;
    private createdAt: Date;

    constructor(
        linkId: string,
        orderId: string,
        uniqueToken: string,
        isActive: boolean,
        createdAt: Date,
    ) {
        this.linkId = linkId;
        this.orderId = orderId;
        this.uniqueToken = uniqueToken;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public getLinkId(): string {
        return this.linkId;
    }

    public getOrderId(): string {
        return this.orderId;
    }

    public getUniqueToken(): string {
        return this.uniqueToken;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

}