import { Product } from "../../model/product.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { PostgresProduct, ProductMapper } from "../../mappers/Postgres/product.mapper";

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE IF NOT EXISTS product (
        product_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        inventory_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        photo VARCHAR(250),
        quantity_in_stock INT NOT NULL,
        minimum_stock_level INT NOT NULL,
        cost_price INT NOT NULL,
        sell_price INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (business_id) REFERENCES business(business_id),
        FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
    );
`;

const INSERT_PRODUCT = `
    INSERT INTO product (
        product_id,
        business_id,
        inventory_id,
        name,
        description,
        photo,
        quantity_in_stock,
        minimum_stock_level,
        cost_price,
        sell_price,
        created_at
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING product_id;
`;

const GET_PRODUCT_BY_ID = `
    SELECT * FROM product
    WHERE product_id = $1;
`;

const GET_ALL_PRODUCT = `
    SELECT * FROM product;
`;

const UPDATE_PRODUCT = `
    UPDATE PRODUCT
    SET
        name = $2,
        description = $3,
        photo = $4,
        quantity_in_stock = $5,
        minimum_stock_level = $6,
        cost_price = $7,
        sell_price = $8
    WHERE product_id = $1
    RETURNING product_id;
`;

const DELETE_PRODUCT = `
DELETE FROM product
WHERE product_id = $1
RETURNING product_id;
`;


export class ProductRepository implements IRepository<Product>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_PRODUCT_TABLE);
            logger.info("Product table initialized.");
        } catch (error) {
            logger.error('Error creating product table:', error as Error);
            throw new FailedToCreateTable('Failed to create product table.', error as Error);
        }
    }
    async create(product: Product): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_PRODUCT, [
                product.getProductId(),
                product.getBusinessId(),
                product.getInventoryId(),
                product.getName(),
                product.getDescription(),
                product.getPhoto(),
                product.getQuantityInStock(),
                product.getMinimumStockLevel(),
                product.getCostPrice(),
                product.getSellPrice(),
                product.getCreatedAt()
            ]);
            logger.info("Product Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert product", error);
            throw new InvalidElementException("Failed to insert a product")
        }
    }
    async get(id: id): Promise<Product> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_PRODUCT_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            return new ProductMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the product of ${id}`, error);
            throw new NotFoundException(`Failed to get product of id ${id}`)
        }
    }
    async getAll(): Promise<Product[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_PRODUCT);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new ProductMapper();
            return result.rows.map( (product: PostgresProduct) => mapper.map(product) );
        } catch (error) {
            logger.error("Failed to get all products ");
            throw new Error("Failed to get all products");
        }
    }
    async update(product: Product): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_PRODUCT, [
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPhoto(),
                product.getQuantityInStock(),
                product.getMinimumStockLevel(),
                product.getCostPrice(),
                product.getSellPrice()
            ]);
            logger.info('Product Updated');
        } catch (error) {
            logger.error(`Failed to update product of id ${product.getProductId()}`, error as Error);
            throw new InvalidElementException(`Failed to update product of id ${product.getProductId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_PRODUCT, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Product with id ${id} not found`);
            } 
            logger.info(`Product of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete product of id ${id}`, error as Error);
            throw new Error(`Failed to delete product of id ${id}`);
        }
    }
    
}