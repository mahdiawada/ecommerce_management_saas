import { InventoryBuilder } from "../builders/inventory.builder";
import { InventoryRepository } from "../repository/Postgres/inventory.repository";
import { generateUUID } from "../util";
import { ServiceException } from "../util/exceptions/serviceException";
import { Inventory } from "../model/inventory.model";
import logger from "../util/logger";
import { Product } from "../model/product.model";

type CreateInventoryInput = {
    businessId: string;
    name: string;
};

type UpdateInventoryInput = {
    name?: string;
};


export class InventoryService {
    private inventoryRepo: InventoryRepository;

    constructor(inventoryRepo: InventoryRepository) {
        this.inventoryRepo = inventoryRepo;
    }

    // create inventory
    async createInventory(input: CreateInventoryInput): Promise<string> {
        try {
            const { businessId, name } = input;
            
            if (!businessId) {
                throw new ServiceException("Business ID is required");
            }
            if (!name || name.trim() === "") {
                throw new ServiceException("Inventory name is required");
            }

            const inventory = new InventoryBuilder()
                .setInventoryId(generateUUID("inventory"))
                .setBusinessId(businessId)
                .setName(name)
                .build();

            await this.inventoryRepo.create(inventory);
            logger.info(`Inventory created ${inventory.getInventoryId()} for business ${businessId}`);
            return inventory.getInventoryId();
        } catch (error) {
            logger.error(`Error creating inventory for business ${input.businessId}`, error as Error);
            throw new ServiceException("Error creating inventory from service");
        }
    }

    // get inventory by id
    async getInventoryById(inventoryId: string): Promise<Inventory> {
        try {
            const inventory = await this.inventoryRepo.get(inventoryId);
            return inventory;
        } catch (error) {
            logger.error(`Error getting inventory ${inventoryId} from service`, error as Error);
            throw new ServiceException("Error getting inventory from service");
        }
    }

    // get all inventories for a business
    async getInventoriesByBusiness(businessId: string): Promise<Inventory[]> {
        try {
            const allInventories = await this.inventoryRepo.getAll();
            const businessInventories = allInventories.filter(inv => inv.getBusinessId() === businessId);
            return businessInventories;
        } catch (error) {
            logger.error(`Error getting inventories for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting inventories from service");
        }
    }

    // get all inventories
    async getAllInventories(): Promise<Inventory[]> {
        try {
            const inventories = await this.inventoryRepo.getAll();
            return inventories;
        } catch (error) {
            logger.error(`Error getting all inventories from service`, error as Error);
            throw new ServiceException("Error getting all inventories from service");
        }
    }

    // async getProductsInInventory(inventoryId: string): Promise<Product[]> {
    //     try {
    //         // First verify inventory exists
    //         await this.inventoryRepo.get(inventoryId);
            
    //         // Get products for this inventory
    //         const allProducts = await this.productRepo.getAll();
    //         const inventoryProducts = allProducts.filter(product => 
    //             product.getInventoryId() === inventoryId
    //         );
            
    //         return inventoryProducts;
    //     } catch (error) {
    //         logger.error(`Error getting products for inventory ${inventoryId} from service`, error as Error);
    //         throw new ServiceException("Error getting products for inventory from service");
    //     }
    // }

    // update inventory
    async updateInventory(inventoryId: string, input: UpdateInventoryInput): Promise<Inventory> {
        try {
            const inventory = await this.inventoryRepo.get(inventoryId);
            
            const updatedInventory = new InventoryBuilder()
                .setInventoryId(inventoryId)
                .setBusinessId(inventory.getBusinessId())
                .setName(input.name ?? inventory.getName())
                .build();

            await this.inventoryRepo.update(updatedInventory);
            logger.info(`Inventory updated ${inventoryId}`);
            
            return updatedInventory;
        } catch (error) {
            logger.error(`Error updating inventory ${inventoryId} from service`, error as Error);
            throw new ServiceException("Error updating inventory from service");
        }
    }

    // delete inventory
    async deleteInventory(inventoryId: string): Promise<void> {
        try {
            await this.inventoryRepo.delete(inventoryId);
            logger.info(`Inventory deleted ${inventoryId}`);
        } catch (error) {
            logger.error(`Error deleting inventory ${inventoryId} from service`, error as Error);
            throw new ServiceException("Error deleting inventory from service");
        }
    }

}
