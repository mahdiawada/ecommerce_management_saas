import { ProductSize } from "../../model/productSizes.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { PostgresProductSizes, ProductSizesMapper } from "../../mappers/Postgres/productSizes.mapper";

const CREATE_PRODUCTSIZES_TABLE = `
    CREATE TABLE IF NOT EXISTS product_sizes (
        size_id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        size_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES product(product_id)
    );
`;

const INSERT_PRODUCTSIZES = `
    INSERT INTO product_sizes (
        size_id,
        product_id,
        size_name
    ) VALUES (
        $1, $2, $3
    ) RETURNING size_id;
`;

const GET_PRODUCTSIZES_BY_ID = `
    SELECT * FROM product_sizes
    WHERE size_id = $1;
`;

const GET_ALL_PRODUCTSIZES = `
    SELECT * FROM product_sizes;
`;

const UPDATE_PRODUCTSIZES = `
    UPDATE product_sizes
    SET
        size_name = $2
    WHERE size_id = $1
    RETURNING size_id;
`;

const DELETE_PRODUCTSIZES = `
DELETE FROM product_sizes
WHERE size_id = $1
RETURNING size_id;
`;

export class ProductSizesRepository implements IRepository<ProductSize>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_PRODUCTSIZES_TABLE);
            logger.info("Product sizes table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating product sizes table:', error as Error);
            throw new FailedToCreateTable('Failed to create product sizes table.', error as Error);
        }
    }
    async create(productSize: ProductSize): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_PRODUCTSIZES, [
                productSize.getSizeId(),
                productSize.getProductId(),
                productSize.getSizeName()
            ]);
            logger.info("Size Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert size", error);
            throw new InvalidElementException("Failed to insert a size")
        }
    }
    async get(id: id): Promise<ProductSize> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_PRODUCTSIZES_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Size with id ${id} not found`);
            }
            return new ProductSizesMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the size of ${id}`, error);
            throw new NotFoundException(`Failed to get size of id ${id}`)
        }
    }
    async getAll(): Promise<ProductSize[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_PRODUCTSIZES);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new ProductSizesMapper();
            return result.rows.map( (productsize: PostgresProductSizes) => mapper.map(productsize) );
        } catch (error) {
            logger.error("Failed to get all sizes ");
            throw new Error("Failed to get all sizes");
        }
    }
    async update(productSize: ProductSize): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_PRODUCTSIZES, [
                productSize.getSizeName()
            ]);
            logger.info('Size Updated');
        } catch (error) {
            logger.error(`Failed to update size of id ${productSize.getSizeId()}`, error as Error);
            throw new InvalidElementException(`Failed to update customer of id ${productSize.getSizeId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_PRODUCTSIZES, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Size with id ${id} not found`);
            } 
            logger.info(`Size of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete size of id ${id}`, error as Error);
            throw new Error(`Failed to delete size of id ${id}`);
        }
    }
    
}