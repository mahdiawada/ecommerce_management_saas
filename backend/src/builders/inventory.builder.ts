import logger from "../util/logger";
import { Inventory } from "../model/inventory.model";

export class InventoryBuilder {
    private inventoryId!: string;
    private businessId!: string;
    private name!: string;

    public setInventoryId(inventoryId: string): InventoryBuilder {
        this.inventoryId = inventoryId;
        return this;
    }

    public setBusinessId(businessId: string): InventoryBuilder {
        this.businessId = businessId;
        return this;
    }

    public setName(name: string): InventoryBuilder {
        this.name = name;
        return this;
    }

    build(): Inventory {
        const requiredProps = [
            this.inventoryId,
            this.businessId,
            this.name,
        ];

        for (const property of requiredProps) {
            if(!property) {
                logger.error("Missing required property, couldn't build an inventory");
                throw new Error("Missing required property");
            }
        }

        return new Inventory(
            this.inventoryId,
            this.businessId,
            this.name
        );
    }
}