import { PromoCodes } from "../../model/promoCodes.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { PostgresPromoCodes, PromoCodesMapper } from "../../mappers/Postgres/promoCodes.mapper";

const CREATE_PROMOCODES_TABLE = `
    CREATE TABLE IF NOT EXISTS promocodes (
        promo_code_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        promo_code VARCHAR(255) NOT NULL,
        discount_percentage INT NOT NULL,
        is_active BOOLEAN NOT NULL,
        FOREIGN KEY (business_id) REFERENCES business(business_id)
    );
`;

const INSERT_PROMOCODES = `
    INSERT INTO promocodes (
        promo_code_id,
        business_id,
        promo_code,
        discount_percentage,
        is_active
    ) VALUES (
        $1, $2, $3, $4, $5
    ) RETURNING promo_code_id;
`;

const GET_PROMOCODES_BY_ID = `
    SELECT * FROM promocodes
    WHERE promo_code_id = $1;
`;

const GET_ALL_PROMOCODES = `
    SELECT * FROM promocodes;
`;

const UPDATE_PROMOCODES = `
    UPDATE promocodes
    SET
        promo_code = $2,
        discount_percentage = $3,
        is_active = $4
    WHERE promo_code_id = $1
    RETURNING promo_code_id;
`;

const DELETE_PROMOCODES = `
DELETE FROM promocodes
WHERE promo_code_id = $1
RETURNING promo_code_id;
`;


export class PromoCodesRepository implements IRepository<PromoCodes>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_PROMOCODES_TABLE);
            logger.info("Promo codes table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating promo codes table:', error as Error);
            throw new FailedToCreateTable('Failed to create promo codes table.', error as Error);
        }
    }
    async create(promocode: PromoCodes): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_PROMOCODES, [
                promocode.getPromoCodeId(),
                promocode.getBusinessId(),
                promocode.getPromocode(),
                promocode.getDiscountPercentage(),
                promocode.getIsActive()
            ]);
            logger.info("Promo code Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert promo code", error);
            throw new InvalidElementException("Failed to insert a promo code");
        }
    }
    async get(id: id): Promise<PromoCodes> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_PROMOCODES_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Promo code with id ${id} not found`);
            }
            return new PromoCodesMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the promo code of ${id}`, error);
            throw new NotFoundException(`Failed to get promo code of id ${id}`)
        }
    }
    async getAll(): Promise<PromoCodes[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_PROMOCODES);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new PromoCodesMapper();
            return result.rows.map( (promocode: PostgresPromoCodes) => mapper.map(promocode) );
        } catch (error) {
            logger.error("Failed to get all promo code ");
            throw new Error("Failed to get all promo code");
        }
    }
    async update(promocode: PromoCodes): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_PROMOCODES, [
                promocode.getPromoCodeId(),
                promocode.getPromocode(),
                promocode.getDiscountPercentage(),
                promocode.getIsActive()
            ]);
            logger.info('Promo code Updated');
        } catch (error) {
            logger.error(`Failed to update promo code of id ${promocode.getPromoCodeId()}`, error as Error);
            throw new InvalidElementException(`Failed to update promo code of id ${promocode.getPromoCodeId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_PROMOCODES, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Promo code with id ${id} not found`);
            } 
            logger.info(`Promo code of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete promo code of id ${id}`, error as Error);
            throw new Error(`Failed to delete promo code of id ${id}`);
        }
    }
    
}