import { BusinessRepository } from "../repository/Postgres/business.repository";
import { ServiceException } from "../util/exceptions/serviceException";
import bcrypt from "bcrypt";
import { BusinessBuilder } from "../builders/business.builder";
import { generateUUID } from "../util";
import logger from "../util/logger";
import { Business } from "../model/business.model";
import { NotFoundException } from "../util/exceptions/repositoryException";

type CreateBusinessInput = {
	businessName: string;
	ownerName: string;
	email: string;
	phoneNumber: string;
	plainPassword: string;
	whatsappApiKey?: string;
	businessLogo?: string;
};

type UpdateBusinessInput = {
	businessName?: string;
	ownerName?: string;
	email?: string;
	phoneNumber?: string;
    newPlainPassword?: string;
	whatsappApiKey?: string;
	businessLogo?: string;
};

export class BusinessService {
    private businessRepo: BusinessRepository;

    constructor(businessRepo: BusinessRepository) {
        this.businessRepo = businessRepo;
    }

    // create business
    async createBusiness(input: CreateBusinessInput): Promise<string> {
        try{
            const businessName = input.businessName;
            const ownerName = input.ownerName;
            const email = input.email;
            const phoneNumber = input.phoneNumber;
            const plainPassword = input.plainPassword;
            const whatsappApiKey = input.whatsappApiKey;
            const businessLogo = input.businessLogo;  
            
            if (!businessName || !ownerName || !email || !phoneNumber || !plainPassword) {
                throw new ServiceException("Missing required fields");
            }

            const passwordHash = await bcrypt.hash(plainPassword, 10);

            const business = new BusinessBuilder()
            .setBusinessId(generateUUID("business"))
            .setBusinessName(businessName)
            .setOwnerName(ownerName)
            .setEmail(email)
            .setPhoneNumber(phoneNumber)
            .setPasswordHash(passwordHash)
            .setWhatsappApiKey(whatsappApiKey)
            .setBusinessLogo(businessLogo)
            .setCreatedAt(new Date())
            .build();

            await this.businessRepo.create(business);
            logger.info(`Business created ${business.getBusinessId()}`);
            return business.getBusinessId();
        } catch (error) {
            logger.error(`Error creating business ${error} from service`);
            throw new ServiceException("Error creating business from service");
        }
    }

    // get business by 
    async getBusinessById(businessId: string): Promise<Business> {
        try {
            const business = await this.businessRepo.get(businessId);
            if (!business) {
                throw new ServiceException("Business not found");
            }
            return business;
        } catch (error) {
            logger.error(`Error getting business ${error} from service`);
            throw new ServiceException("Error getting business from service");
        }
    }
    // get all businesses
    async getAllBusinesses(): Promise<Business[]> {
        try {
            const businesses = await this.businessRepo.getAll();
            return businesses;
        } catch (error) {
            logger.error(`Error getting all businesses from service`, error as Error);
            throw new ServiceException("Error getting all businesses from service");
        }
    }
    // update business
    async updateBusiness(businessId: string, input: UpdateBusinessInput): Promise<void> {
        try {
            const business = await this.businessRepo.get(businessId);
            if (!business) {
                throw new ServiceException("Business not found");
            }
            // Validate email uniqueness if email is being updated
            if (input.email && input.email !== business.getEmail()) {
                await this.validateEmailUniqueness(input.email, businessId);
            }
            
            let passwordHash = business.getPasswordHash();
            if (input.newPlainPassword) {
                passwordHash = await bcrypt.hash(input.newPlainPassword, 10);
            }
        
            const newBusiness = new BusinessBuilder()
            .setBusinessId(businessId)
            .setBusinessName(input.businessName || business.getBusinessName())
            .setOwnerName(input.ownerName || business.getOwnerName())
            .setEmail(input.email || business.getEmail())
            .setPhoneNumber(input.phoneNumber || business.getPhoneNumber())
            .setWhatsappApiKey(input.whatsappApiKey || business.getWhatsappApiKey())
            .setBusinessLogo(input.businessLogo || business.getBusinessLogo())
            .setPasswordHash(passwordHash)
            .setCreatedAt(business.getCreatedAt())
            .build();
            await this.businessRepo.update(newBusiness);
            logger.info(`Business updated ${businessId}`);
        }
        catch (error) {
            logger.error(`Error updating business ${error} from service`);
            throw new ServiceException("Error updating business from service");
        }
    }

    // delete business
    async deleteBusiness(businessId: string): Promise<void> {
        try {
            await this.businessRepo.delete(businessId);
            logger.info(`Business deleted ${businessId}`);
        }
        catch (error) {
            logger.error(`Error deleting business ${error} from service`);
            throw new ServiceException("Error deleting business from service");
        }
    }

    // upload business logo

    // find business by email
    async findBusinessByEmail(email: string): Promise<Business | null> {
        try {
            const businesses = await this.businessRepo.getAll();
            const business = businesses.find(b => b.getEmail().toLowerCase() === email.toLowerCase());
            return business ? business : null;
        } catch (error) {
            logger.error(`Error finding business by email ${email} from service`, error as Error);
            throw new ServiceException("Error finding business by email from service");
        }
    }

    // validate email uniqueness
    private async validateEmailUniqueness(email: string, excludeBusinessId?: string): Promise<void> {
        const existingBusiness = await this.findBusinessByEmail(email);
        if (existingBusiness && existingBusiness.getBusinessId() !== excludeBusinessId) {
            throw new ServiceException("Email already exists");
        }
    }

}