export class ProductSize {
    private sizeId: string;
    private productId: string;
    private sizeName: string;
    constructor(
        sizeId: string,
        productId: string,
        sizeName: string
    ) {
        this.sizeId = sizeId;
        this.productId = productId;
        this.sizeName = sizeName;
    }
    getSizeId(): string {
        return this.sizeId;
    }

    getProductId(): string {
        return this.productId;
    }

    getSizeName(): string {
        return this.sizeName;
    }
}