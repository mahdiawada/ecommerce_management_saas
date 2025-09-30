import { Inventory } from "../../model/inventory.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { InventoryMapper, PostgresInventory } from "../../mappers/Postgres/inventory.mapper";
import { Product } from "model/product.model";
import { PostgresProduct, ProductMapper } from "../../mappers/Postgres/product.mapper";


const CREATE_INVENTORY_TABLE = `
    CREATE TABLE IF NOT EXISTS inventory (
        inventory_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        inventory_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (business_id) REFERENCES business(business_id)
    );
`;

const INSERT_INVENTORY = `
    INSERT INTO inventory (
        inventory_id,
        business_id,
        inventory_name
    ) VALUES (
        $1, $2, $3
    ) RETURNING inventory_id;
`;

const GET_INVENTORY_BY_ID = `
    SELECT * FROM inventory
    WHERE inventory_id = $1;
`;

const GET_ALL_INVENTORY = `
    SELECT * FROM inventory;
`;

const UPDATE_INVENTORY = `
    UPDATE INVENTORY
    SET
        inventory_name = $2
    WHERE inventory_id = $1
    RETURNING inventory_id;
`;

const DELETE_INVENTORY = `
DELETE FROM inventory
WHERE inventory_id = $1
RETURNING inventory_id;
`;

const GET_PRODUCTS_BY_INVENTORY_ID = `
    SELECT * FROM product
    WHERE inventory_id = $1;
`;


export class InventoryRepository implements IRepository<Inventory>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_INVENTORY_TABLE);
            logger.info("Inventory table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating Inventory table:', error as Error);
            throw new FailedToCreateTable('Failed to create Inventory table.', error as Error);
        }
    }
    async create(inventory: Inventory): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_INVENTORY, [
                inventory.getInventoryId(),
                inventory.getBusinessId(),
                inventory.getName(),
            ]);
            logger.info("Inventory Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert inventory", error);
            throw new InvalidElementException("Failed to insert a inventory")
        }
    }
    async get(id: id): Promise<Inventory> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_INVENTORY_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Inventory with id ${id} not found`);
            }
            return new InventoryMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the inventory of ${id}`, error);
            throw new NotFoundException(`Failed to get inventory of id ${id}`)
        }
    }
    async getAll(): Promise<Inventory[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_INVENTORY);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new InventoryMapper();
            return result.rows.map( (inventory: PostgresInventory) => mapper.map(inventory) );
        } catch (error) {
            logger.error("Failed to get all inventory ");
            throw new Error("Failed to get all inventory");
        }
    }


    async getProductsByInventoryId(inventoryId: string): Promise<Product[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_PRODUCTS_BY_INVENTORY_ID, [inventoryId]);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new ProductMapper();
            return result.rows.map( (product: PostgresProduct) => mapper.map(product) );
        } catch (error) {
            logger.error(`Failed to get products for inventory ${inventoryId}`, error);
            throw new Error(`Failed to get products for inventory ${inventoryId}`);
        }
    }


    async update(inventory: Inventory): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_INVENTORY, [
                inventory.getInventoryId(),
                inventory.getName(),
            ]);
            logger.info('Inventory Updated');
        } catch (error) {
            logger.error(`Failed to update inventory of id ${inventory.getInventoryId()}`, error as Error);
            throw new InvalidElementException(`Failed to update inventory of id ${inventory.getInventoryId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_INVENTORY, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Inventory with id ${id} not found`);
            } 
            logger.info(`Inventory of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete inventory of id ${id}`, error as Error);
            throw new Error(`Failed to delete inventory of id ${id}`);
        }
    }
    
    
}