import { OrderItems } from "../../model/orderItems.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { OrderItemsMapper, PostgresOrderItems } from "../../mappers/Postgres/orderItems.mapper";

const CREATE_ORDERITEMS_TABLE = `
    CREATE TABLE IF NOT EXISTS order_items (
        order_item_id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_size_id VARCHAR(255),
        quantity INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES product(product_id),
        FOREIGN KEY (product_size_id) REFERENCES product_sizes(size_id)
    );
`;

const INSERT_ORDERITEMS = `
    INSERT INTO order_items (
        order_item_id,
        order_id,
        product_id,
        product_size_id,
        quantity
    ) VALUES (
        $1, $2, $3, $4, $5
    ) RETURNING order_item_id;
`;

const GET_ORDERITEMS_BY_ID = `
    SELECT * FROM order_items
    WHERE order_item_id = $1;
`;

const GET_ALL_ORDERITEMS = `
    SELECT * FROM order_items;
`;

const UPDATE_ORDERITEMS = `
    UPDATE order_items
    SET
        product_id = $2,
        product_size_id = $3,
        quantity = $4
    WHERE order_item_id = $1
    RETURNING order_item_id;
`;

const DELETE_ORDERITEMS = `
DELETE FROM order_items
WHERE order_items_id = $1
RETURNING order_items_id;
`;

export class OrderItemsRepository implements IRepository<OrderItems>, Initializable{
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_ORDERITEMS_TABLE);
            logger.info("Items table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating items table:', error as Error);
            throw new FailedToCreateTable('Failed to create items table.', error as Error);
        }
    }
    async create(item: OrderItems): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_ORDERITEMS, [
                item.getOrderItemId(),
                item.getOrderId(),
                item.getProductId(),
                item.getProductSizeId(),
                item.getQuantity()
            ]);
            logger.info("Item Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert item", error);
            throw new InvalidElementException("Failed to insert a item")
        }
    }
    async get(id: id): Promise<OrderItems> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ORDERITEMS_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Item with id ${id} not found`);
            }
            return new OrderItemsMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the item of ${id}`, error);
            throw new NotFoundException(`Failed to get item of id ${id}`)
        }
    }
    async getAll(): Promise<OrderItems[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_ORDERITEMS);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new OrderItemsMapper();
            return result.rows.map( (item: PostgresOrderItems) => mapper.map(item) );
        } catch (error) {
            logger.error("Failed to get all items ");
            throw new Error("Failed to get all items");
        }
    }
    async update(item: OrderItems): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_ORDERITEMS, [
                item.getOrderItemId(),
                item.getProductId(),
                item.getProductSizeId(),
                item.getQuantity(),
            ]);
            logger.info('Item Updated');
        } catch (error) {
            logger.error(`Failed to update item of id ${item.getOrderItemId()}`, error as Error);
            throw new InvalidElementException(`Failed to update item of id ${item.getOrderItemId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_ORDERITEMS, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Item with id ${id} not found`);
            } 
            logger.info(`Item of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete item of id ${id}`, error as Error);
            throw new Error(`Failed to delete item of id ${id}`);
        }
    }
    
}