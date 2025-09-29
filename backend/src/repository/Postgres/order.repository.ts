import { Order } from "../../model/order.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { OrderMapper, PostgresOrder } from "../../mappers/Postgres/order.mapper";

const CREATE_ORDER_TABLE = `
    CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        customer_id VARCHAR(255) NOT NULL,
        order_number VARCHAR(255) NOT NULL,
        order_status VARCHAR(255) NOT NULL,
        order_source VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        total_price INT NOT NULL,
        promo_code_id VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (business_id) REFERENCES business(business_id),
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    );
`;

const INSERT_ORDER = `
    INSERT INTO orders (
        order_id,
        business_id,
        customer_id,
        order_number,
        order_status,
        order_source,
        payment_method,
        total_price,
        promo_code_id,
        created_at
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING order_id;
`;

const GET_ORDER_BY_ID = `
    SELECT * FROM orders
    WHERE order_id = $1;
`;

const GET_ALL_ORDER = `
    SELECT * FROM orders;
`;

const UPDATE_ORDER = `
    UPDATE ORDERS
    SET
        order_number = $2,
        order_status = $3,
        order_source = $4,
        payment_method = $5,
        total_price = $6,
        promo_code_id = $7
    WHERE order_id = $1
    RETURNING order_id;
`;

const DELETE_ORDER = `
DELETE FROM orders
WHERE order_id = $1
RETURNING order_id;
`;

export class OrderRepository implements IRepository<Order>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_ORDER_TABLE);
            logger.info("Order table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating order table:', error as Error);
            throw new FailedToCreateTable('Failed to create order table.', error as Error);
        }
    }
    async create(order: Order): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_ORDER, [
                order.getOrderId(),
                order.getBusinessId(),
                order.getCustomerId(),
                order.getOrderNumber(),
                order.getOrderStatus(),
                order.getOrderSource(),
                order.getPaymentMethod(),
                order.getTotalPrice(),
                order.getPromoCodeId(),
                order.getCreatedAt()
            ]);
            logger.info("Order Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert order", error);
            throw new InvalidElementException("Failed to insert a order")
        }
    }
    async get(id: id): Promise<Order> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ORDER_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Order with id ${id} not found`);
            }
            return new OrderMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the order of ${id}`, error);
            throw new NotFoundException(`Failed to get order of id ${id}`)
        }
    }
    async getAll(): Promise<Order[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_ORDER);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new OrderMapper();
            return result.rows.map( (order: PostgresOrder) => mapper.map(order) );
        } catch (error) {
            logger.error("Failed to get all orders ");
            throw new Error("Failed to get all orders");
        }
    }
    async update(order: Order): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_ORDER, [
                order.getOrderId(),
                order.getOrderNumber(),
                order.getOrderStatus(),
                order.getOrderSource(),
                order.getPaymentMethod(),
                order.getTotalPrice(),
                order.getPromoCodeId(),
            ]);
            logger.info('Order Updated');
        } catch (error) {
            logger.error(`Failed to update order of id ${order.getOrderId()}`, error as Error);
            throw new InvalidElementException(`Failed to update order of id ${order.getOrderId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_ORDER, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Order with id ${id} not found`);
            } 
            logger.info(`Order of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete order of id ${id}`, error as Error);
            throw new Error(`Failed to delete order of id ${id}`);
        }
    }
    
}