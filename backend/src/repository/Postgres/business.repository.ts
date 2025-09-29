import logger from "../../util/logger";
import { Business } from "../../model/business.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { ConnectionManager } from "./ConnectionManager";
import { BusinessMapper, PostgresBusiness } from "../../mappers/Postgres/business.mapper";

const CREATE_BUSINESS_TABLE = `
    CREATE TABLE IF NOT EXISTS business (
        business_id VARCHAR(255) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        business_logo VARCHAR(255),
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(50) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        whatsapp_api_key VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;

const INSERT_BUSINESS = `
    INSERT INTO business (
        business_id,
        business_name,
        business_logo,
        owner_name,
        email,
        phone_number,
        password_hash,
        whatsapp_api_key,
        created_at
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING business_id;
`;

const GET_BUSINESS_BY_ID = `
    SELECT * FROM business
    WHERE business_id = $1;
`;

const GET_ALL_BUSINESSES = `
    SELECT * FROM business;
`;

const UPDATE_BUSINESS = `
    UPDATE business
    SET
        business_name = $2,
        business_logo = $3,
        owner_name = $4,
        email = $5,
        phone_number = $6,
        password_hash = $7,
        whatsapp_api_key = $8
    WHERE business_id = $1
    RETURNING business_id;
`;

const DELETE_BUSINESS = `
DELETE FROM business
WHERE business_id = $1
RETURNING business_id;
`;

export class BusinessRepository implements IRepository<Business>, Initializable {

    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_BUSINESS_TABLE);
            logger.info("Business table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating business table:', error as Error);
            throw new FailedToCreateTable('Failed to create business table.', error as Error);
        }
    }

    async create(business: Business): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_BUSINESS, [
                business.getBusinessId(),
                business.getBusinessName(),
                business.getBusinessLogo(),
                business.getOwnerName(),
                business.getEmail(),
                business.getPhoneNumber(),
                business.getPasswordHash(),
                business.getWhatsappApiKey(),
                business.getCreatedAt()
            ]);
            logger.info("Business Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert business", error);
            throw new InvalidElementException("Failed to insert a business")
        }
    }
    async get(id: id): Promise<Business> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_BUSINESS_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Business with id ${id} not found`);
            }
            return new BusinessMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the business of ${id}`, error);
            throw new NotFoundException(`Failed to get business of id ${id}`)
        }
    }
    async getAll(): Promise<Business[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_BUSINESSES);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new BusinessMapper();
            return result.rows.map( (business: PostgresBusiness) => mapper.map(business) );
        } catch (error) {
            logger.error("Failed to get all businesses ");
            throw new Error("Failed to get all businesses");
        }
    }
    async update(business: Business): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_BUSINESS, [
                business.getBusinessId(),
                business.getBusinessName(),
                business.getBusinessLogo(),
                business.getOwnerName(),
                business.getEmail(),
                business.getPhoneNumber(),
                business.getPasswordHash(),
                business.getWhatsappApiKey()
            ]);
            logger.info('Business Updated');
        } catch (error) {
            logger.error(`Failed to update business of id ${business.getBusinessId()}`, error as Error);
            throw new InvalidElementException(`Failed to update business of id ${business.getBusinessId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_BUSINESS, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Business with id ${id} not found`);
            } 
            logger.info(`Business of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete business of id ${id}`, error as Error);
            throw new Error(`Failed to delete business of id ${id}`);
        }
    }

}

export async function createBusinessRepository(): Promise<BusinessRepository>{
    const businessRepo = new BusinessRepository();
    return businessRepo;
}