export class Inventory {
    private inventoryId: string;
    private businessId: string;
    private name: string;
    constructor(inventoryId: string, businessId: string, name: string) {
        this.inventoryId = inventoryId;
        this.businessId = businessId;
        this.name = name;
    }

    public getInventoryId(): string {
        return this.inventoryId;
    }

    public getBusinessId(): string {
        return this.businessId;
    }

    public getName(): string {
        return this.name;
    }
}