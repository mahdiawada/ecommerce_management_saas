import { ProductSize } from "../model/productSizes.model";

export class ProductSizesBuilder {
    private sizeId!: string;
    private productId!: string;
    private sizeName!: string;

    public setSizeId(sizeId: string): this {
        this.sizeId = sizeId;
        return this;
    }

    public setProductId(productId: string): this {
        this.productId = productId;
        return this;
    }

    public setSizeName(sizeName: string): this {
        this.sizeName = sizeName;
        return this;
    }

     build() {
            const requiredProps = [
                this.sizeId,
                this.productId,
                this.sizeName,
            ];
    
            for (const property of requiredProps) {
                if (property === undefined || property === null) {
                    throw new Error("Missing required property, couldn't build a promo code");
                }
            }
    
            return new ProductSize(
                this.sizeId,
                this.productId,
                this.sizeName,
            );
        }
}