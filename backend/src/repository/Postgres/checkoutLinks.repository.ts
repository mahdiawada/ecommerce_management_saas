import { CheckoutLinks } from "../../model/checkoutLinks.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { FailedToCreateTable, InvalidElementException, NotFoundException } from "../../util/exceptions/repositoryException";
import { CheckoutLinksMapper, PostgresCheckoutLinks } from "../../mappers/Postgres/checkoutLinks.mapper";


const CREATE_CHECKOUTLINKS_TABLE = `
    CREATE TABLE IF NOT EXISTS checkout_links (
        link_id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        unique_token VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
    );
`;

const INSERT_CHECKOUTLINKS = `
    INSERT INTO checkout_links (
        link_id,
        order_id,
        unique_token,
        is_active,
        created_at
    ) VALUES (
        $1, $2, $3, $4, $5
    )  RETURNING link_id;
`;

const GET_CHECKOUTLINKS_BY_ID = `
    SELECT * FROM checkout_links
    WHERE link_id = $1;
`;

const GET_ALL_CHECKOUTLINKS = `
    SELECT * FROM checkout_links;
`;

const UPDATE_CHECKOUTLINKS = `
    UPDATE checkout_links
    SET
        is_active = $2,
    WHERE link_id = $1
    RETURNING link_id;
`;

const DELETE_CHECKOUTLINKS = `
DELETE FROM checkout_links
WHERE link_id = $1
RETURNING link_id;
`;


export class CheckoutLinksRepository implements IRepository<CheckoutLinks>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_CHECKOUTLINKS_TABLE);
            logger.info("Checkout links table initialized.");
        } catch (error : unknown) {
            logger.error('Error creating checkout links table:', error as Error);
            throw new FailedToCreateTable('Failed to create checkout links table.', error as Error);
        }
    }
    async create(checkoutlink: CheckoutLinks): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(INSERT_CHECKOUTLINKS, [
                checkoutlink.getLinkId(),
                checkoutlink.getOrderId(),
                checkoutlink.getUniqueToken(),
                checkoutlink.getIsActive(),
                checkoutlink.getCreatedAt(),
            ]);
            logger.info("Link Inserted");
            return result.rows[0].id;
        } catch (error) {
            logger.error("Failed to insert link", error);
            throw new InvalidElementException("Failed to insert a link")
        }
    }
    async get(id: id): Promise<CheckoutLinks> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_CHECKOUTLINKS_BY_ID, [id]);
            if(result.rows.length === 0) {
                throw new NotFoundException(`Link with id ${id} not found`);
            }
            return new CheckoutLinksMapper().map(result.rows[0]);
        } catch (error) {
            logger.error(`Failed to get the link of ${id}`, error);
            throw new NotFoundException(`Failed to get link of id ${id}`)
        }
    }
    async getAll(): Promise<CheckoutLinks[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(GET_ALL_CHECKOUTLINKS);
            if(result.rows.length == 0) {
                return [];
            }
            const mapper = new CheckoutLinksMapper();
            return result.rows.map( (link: PostgresCheckoutLinks) => mapper.map(link) );
        } catch (error) {
            logger.error("Failed to get all links ");
            throw new Error("Failed to get all links");
        }
    }
    async update(link: CheckoutLinks): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_CHECKOUTLINKS, [
                link.getIsActive(),
            ]);
            logger.info('Link Updated');
        } catch (error) {
            logger.error(`Failed to update link of id ${link.getLinkId()}`, error as Error);
            throw new InvalidElementException(`Failed to update link of id ${link.getLinkId()}`);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(DELETE_CHECKOUTLINKS, [id]);
            if(result.rowCount === 0){
                throw new NotFoundException(`Link with id ${id} not found`);
            } 
            logger.info(`Link of id ${id} is deleted successfully`);
        } catch (error) {
            logger.error(`Failed to delete link of id ${id}`, error as Error);
            throw new Error(`Failed to delete link of id ${id}`);
        }
    }
    
}