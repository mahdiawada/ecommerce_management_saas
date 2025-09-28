export class Product {
    private productId: string;
    private businessId: string;
    private inventoryId?: string;
    private name: string;
    private description?: string;
    private photo?: string;
    private quantityInStock: number;
    private minimumStockLevel: number;
    private costPrice: number;
    private sellPrice: number;
    private createdAt: Date;
    
    constructor(
        productId: string,
        businessId: string,
        inventoryId: string | undefined,
        name: string,
        description: string | undefined,
        photo: string | undefined,
        quantityInStock: number,
        minimumStockLevel: number,
        costPrice: number,
        sellPrice: number,
        createdAt: Date
    ) {
        this.productId = productId;
        this.businessId = businessId;
        this.inventoryId = inventoryId;
        this.name = name;
        this.description = description;
        this.photo = photo;
        this.quantityInStock = quantityInStock;
        this.minimumStockLevel = minimumStockLevel;
        this.costPrice = costPrice;
        this.sellPrice = sellPrice;
        this.createdAt = createdAt;
    }

    public getProductId(): string {
        return this.productId;
    }

    public getBusinessId(): string {
        return this.businessId;
    }

    public getInventoryId(): string | undefined{
        return this.inventoryId;
    }


    public getName(): string {
        return this.name;
    }

    public getDescription(): string | undefined{
        return this.description;
    }

    public getPhoto(): string | undefined {
        return this.photo;
    }


    public getQuantityInStock(): number {
        return this.quantityInStock;
    }

    public getMinimumStockLevel(): number {
        return this.minimumStockLevel;
    }

    public getCostPrice(): number {
        return this.costPrice;
    }

    public getSellPrice(): number {
        return this.sellPrice;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}