import logger from "../util/logger";
import { Product } from "../model/product.model";

export class ProductBuilder {
    private productId!: string;
    private businessId!: string;
    private inventoryId?: string;
    private name!: string;
    private description?: string;
    private photo?: string;
    private quantityInStock!: number;
    private minimumStockLevel!: number;
    private costPrice!: number;
    private sellPrice!: number;
    private createdAt!: Date;

    public setProductId(productId: string): ProductBuilder {
        this.productId = productId;
        return this;
    }

    public setBusinessId(businessId: string): ProductBuilder {
        this.businessId = businessId;
        return this;
    }

    public setInventoryId(inventoryId: string | undefined): ProductBuilder {
        this.inventoryId = inventoryId;
        return this;
    }

    public setName(name: string): ProductBuilder {
        this.name = name;
        return this;
    }

    public setDescription(description: string | undefined): ProductBuilder {
        this.description = description;
        return this;
    }

    public setPhoto(photo: string | undefined): ProductBuilder {
        this.photo = photo;
        return this;
    }


    public setQuantityInStock(quantityInStock: number): ProductBuilder {
        this.quantityInStock = quantityInStock;
        return this;
    }

    public setMinimumStockLevel(minimumStockLevel: number): ProductBuilder {
        this.minimumStockLevel = minimumStockLevel;
        return this;
    }

    public setCostPrice(costPrice: number): ProductBuilder {
        this.costPrice = costPrice;
        return this;
    }

    public setSellPrice(sellPrice: number): ProductBuilder {
        this.sellPrice = sellPrice;
        return this;
    }

    public setCreatedAt(createdAt: Date): ProductBuilder {
        this.createdAt = createdAt;
        return this;
    }

    build(): Product {
        const requiredProps = [
            this.productId,
            this.businessId,
            this.name,
            this.quantityInStock,
            this.minimumStockLevel,
            this.costPrice,
            this.sellPrice,
            this.createdAt
        ];

        for (const property of requiredProps) {
            if(!property) {
                logger.error("Missing required property, couldn't build a product");
                throw new Error("Missing required property");
            }
        }

        return new Product(
            this.productId,
            this.businessId,
            this.inventoryId,
            this.name,
            this.description,
            this.photo,
            this.quantityInStock,
            this.minimumStockLevel,
            this.costPrice,
            this.sellPrice,
            this.createdAt
        );
    }
}