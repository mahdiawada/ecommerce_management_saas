import { Inventory } from "../../model/inventory.model";
import { IMapper } from "../IMapper";
import { InventoryBuilder } from "../../builders/inventory.builder";

export interface PostgresInventory {
    inventory_id: string;
    business_id: string;
    inventory_name: string;
}

export class InventoryMapper implements IMapper<PostgresInventory, Inventory> {
    map(data: PostgresInventory): Inventory {
        return new InventoryBuilder()
            .setInventoryId(data.inventory_id)
            .setBusinessId(data.business_id)
            .setName(data.inventory_name)
            .build();
    }

    reverseMap(data: Inventory): PostgresInventory {
        return {
            inventory_id: data.getInventoryId(),
            business_id: data.getBusinessId(),
            inventory_name: data.getName()
        };
    }
}