import { Customer } from "../../model/customer.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { CustomerMapper, PostgresCustomer } from "../../mappers/Postgres/customer.mapper";

const CREATE_CUSTOMER_TABLE = `
    CREATE TABLE IF NOT EXISTS customer (
        customer_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        instagram_username VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(255) NOT NULL,
        birthday VARCHAR(255),
        cod_risk_flag BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (business_id) REFERENCES business(business_id)
    );
`;

const INSERT_CUSTOMER = `
    INSERT INTO customer (
        customer_id,
        business_id,
        customer_name,
        phone_number,
        email,
        instagram_username,
        address,
        city,
        birthday,
        cod_risk_flag
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING customer_id;
`;

const GET_CUSTOMER_BY_ID = `
    SELECT * FROM customer
    WHERE customer_id = $1;
`;

const GET_ALL_CUSTOMER = `
    SELECT * FROM customer;
`;

const UPDATE_CUSTOMER = `
    UPDATE CUSTOMER
    SET
        customer_name = $2,
        phone_number = $3,
        email = $4,
        instagram_username = $5,
        address = $6,
        city = $7,
        birthday = $8,
        cod_risk_flag = $9
    WHERE customer_id = $1
    RETURNING customer_id;
`;

const DELETE_CUSTOMER = `
DELETE FROM customer
WHERE customer_id = $1
RETURNING customer_id;
`;

export class CustomerRepository implements IRepository<Customer>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_CUSTOMER_TABLE);
            logger.info("Customer table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating customer table:', error as Error);
            throw new FailedToCreateTable('Failed to create customer table.', error as Error);
        }
    }
    async create(customer: Customer): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_CUSTOMER, [
                customer.getCustomerId(),
                customer.getBusinessId(),
                customer.getFullName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getInstagramUsername(),
                customer.getAddress(),
                customer.getCity(),
                customer.getBirthday(),
                customer.getCodRiskFlag()
            ]);
            logger.info("Customer Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert customer", error);
            throw new InvalidElementException("Failed to insert a customer")
        }
    }
    async get(id: id): Promise<Customer> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_CUSTOMER_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Customer with id ${id} not found`);
            }
            return new CustomerMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the customer of ${id}`, error);
            throw new NotFoundException(`Failed to get customer of id ${id}`)
        }
    }
    async getAll(): Promise<Customer[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_CUSTOMER);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new CustomerMapper();
            return result.rows.map( (customer: PostgresCustomer) => mapper.map(customer) );
        } catch (error) {
            logger.error("Failed to get all customers ");
            throw new Error("Failed to get all customers");
        }
    }
    async update(customer: Customer): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_CUSTOMER, [
                customer.getCustomerId(),
                customer.getFullName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getInstagramUsername(),
                customer.getAddress(),
                customer.getCity(),
                customer.getBirthday(),
                customer.getCodRiskFlag()
            ]);
            logger.info('Customer Updated');
        } catch (error) {
            logger.error(`Failed to update customer of id ${customer.getCustomerId()}`, error as Error);
            throw new InvalidElementException(`Failed to update customer of id ${customer.getCustomerId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_CUSTOMER, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Customer with id ${id} not found`);
            } 
            logger.info(`Customer of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete customer of id ${id}`, error as Error);
            throw new Error(`Failed to delete customer of id ${id}`);
        }
    }
    
}