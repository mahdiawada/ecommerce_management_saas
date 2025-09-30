import { PromoCodeBuilder } from "../builders/promoCodes.builder";
import { PromoCodesRepository } from "../repository/Postgres/promoCodes.repository";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/serviceException";
import logger from "../util/logger";
import { PromoCodes } from "../model/promoCodes.model";
import { NotFoundException } from "../util/exceptions/repositoryException";

type CreatePromoCodeInput = {
    businessId: string;
    promocode: string;
    discountPercentage: number;
    isActive?: boolean;
};

type UpdatePromoCodeInput = {
    promocode?: string;
    discountPercentage?: number;
    isActive?: boolean;
};

type PromoCodeValidationResult = {
    isValid: boolean;
    discountPercentage?: number;
    error?: string;
};

export class PromoCodesService {
    private promoCodesRepo: PromoCodesRepository;

    constructor(promoCodesRepo?: PromoCodesRepository) {
        this.promoCodesRepo = promoCodesRepo || new PromoCodesRepository();
    }

    // create promo code
    async createPromoCode(input: CreatePromoCodeInput): Promise<string> {
        try {
            const { businessId, promocode, discountPercentage, isActive = true } = input;

            if (!businessId) {
                throw new ServiceException("Business ID is required");
            }
            if (!promocode || promocode.trim() === "") {
                throw new ServiceException("Promo code is required");
            }
            if (discountPercentage < 0 || discountPercentage > 100) {
                throw new ServiceException("Discount percentage must be between 0 and 100");
            }

            // Check if promo code already exists for this business
            await this.validatePromoCodeUniqueness(promocode.trim(), businessId);

            const promoCode = new PromoCodeBuilder()
                .setPromoCodeId(generateUUID("promo"))
                .setBusinessId(businessId)
                .setPromocode(promocode.trim().toUpperCase())
                .setDiscountPercentage(discountPercentage)
                .setIsActive(isActive)
                .build();

            await this.promoCodesRepo.create(promoCode);
            logger.info(`Promo code created ${promoCode.getPromoCodeId()} for business ${businessId}`);
            return promoCode.getPromoCodeId();
        } catch (error) {
            logger.error(`Error creating promo code for business ${input.businessId} from service`, error as Error);
            throw new ServiceException("Error creating promo code from service");
        }
    }

    // get promo code by id
    async getPromoCodeById(promoCodeId: string): Promise<PromoCodes> {
        try {
            const promoCode = await this.promoCodesRepo.get(promoCodeId);
            return promoCode;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Promo code not found: ${promoCodeId}`);
            }
            logger.error(`Error getting promo code ${promoCodeId} from service`, error as Error);
            throw new ServiceException("Error getting promo code from service");
        }
    }

    // get all promo codes
    async getAllPromoCodes(): Promise<PromoCodes[]> {
        try {
            const promoCodes = await this.promoCodesRepo.getAll();
            return promoCodes;
        } catch (error) {
            logger.error(`Error getting all promo codes from service`, error as Error);
            throw new ServiceException("Error getting all promo codes from service");
        }
    }

    // get promo codes by business
    async getPromoCodesByBusiness(businessId: string): Promise<PromoCodes[]> {
        try {
            const allPromoCodes = await this.promoCodesRepo.getAll();
            const businessPromoCodes = allPromoCodes.filter(promo => promo.getBusinessId() === businessId);
            return businessPromoCodes;
        } catch (error) {
            logger.error(`Error getting promo codes for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting promo codes for business from service");
        }
    }

    // get active promo codes by business
    async getActivePromoCodesByBusiness(businessId: string): Promise<PromoCodes[]> {
        try {
            const allPromoCodes = await this.promoCodesRepo.getAll();
            const activePromoCodes = allPromoCodes.filter(promo => 
                promo.getBusinessId() === businessId && promo.getIsActive()
            );
            return activePromoCodes;
        } catch (error) {
            logger.error(`Error getting active promo codes for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting active promo codes for business from service");
        }
    }

    // update promo code
    async updatePromoCode(promoCodeId: string, input: UpdatePromoCodeInput): Promise<PromoCodes> {
        try {
            const promoCode = await this.promoCodesRepo.get(promoCodeId);
            
            // Validate discount percentage if provided
            if (input.discountPercentage !== undefined) {
                if (input.discountPercentage < 0 || input.discountPercentage > 100) {
                    throw new ServiceException("Discount percentage must be between 0 and 100");
                }
            }

            // Check promo code uniqueness if code is being updated
            if (input.promocode && input.promocode !== promoCode.getPromocode()) {
                await this.validatePromoCodeUniqueness(input.promocode.trim(), promoCode.getBusinessId(), promoCodeId);
            }

            const updatedPromoCode = new PromoCodeBuilder()
                .setPromoCodeId(promoCodeId)
                .setBusinessId(promoCode.getBusinessId())
                .setPromocode(input.promocode ? input.promocode.trim().toUpperCase() : promoCode.getPromocode())
                .setDiscountPercentage(input.discountPercentage ?? promoCode.getDiscountPercentage())
                .setIsActive(input.isActive ?? promoCode.getIsActive())
                .build();

            await this.promoCodesRepo.update(updatedPromoCode);
            logger.info(`Promo code updated ${promoCodeId}`);
            
            return updatedPromoCode;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Promo code not found: ${promoCodeId}`);
            }
            logger.error(`Error updating promo code ${promoCodeId} from service`, error as Error);
            throw new ServiceException("Error updating promo code from service");
        }
    }

    // delete promo code
    async deletePromoCode(promoCodeId: string): Promise<void> {
        try {
            await this.promoCodesRepo.delete(promoCodeId);
            logger.info(`Promo code deleted ${promoCodeId}`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Promo code not found: ${promoCodeId}`);
            }
            logger.error(`Error deleting promo code ${promoCodeId} from service`, error as Error);
            throw new ServiceException("Error deleting promo code from service");
        }
    }

    // validate promo code
    async validatePromoCode(promoCode: string, businessId: string, orderTotal: number): Promise<PromoCodeValidationResult> {
        try {
            const allPromoCodes = await this.promoCodesRepo.getAll();
            const validPromoCode = allPromoCodes.find(promo => 
                promo.getPromocode().toUpperCase() === promoCode.toUpperCase() &&
                promo.getBusinessId() === businessId &&
                promo.getIsActive()
            );

            if (!validPromoCode) {
                return {
                    isValid: false,
                    error: "Invalid or inactive promo code"
                };
            }

            const discountAmount = (orderTotal * validPromoCode.getDiscountPercentage()) / 100;
            
            return {
                isValid: true,
                discountPercentage: validPromoCode.getDiscountPercentage()
            };
        } catch (error) {
            logger.error(`Error validating promo code ${promoCode} from service`, error as Error);
            throw new ServiceException("Error validating promo code from service");
        }
    }

    // activate promo code
    async activatePromoCode(promoCodeId: string): Promise<PromoCodes> {
        try {
            const promoCode = await this.promoCodesRepo.get(promoCodeId);
            
            const updatedPromoCode = new PromoCodeBuilder()
                .setPromoCodeId(promoCodeId)
                .setBusinessId(promoCode.getBusinessId())
                .setPromocode(promoCode.getPromocode())
                .setDiscountPercentage(promoCode.getDiscountPercentage())
                .setIsActive(true)
                .build();

            await this.promoCodesRepo.update(updatedPromoCode);
            logger.info(`Promo code activated ${promoCodeId}`);
            
            return updatedPromoCode;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Promo code not found: ${promoCodeId}`);
            }
            logger.error(`Error activating promo code ${promoCodeId} from service`, error as Error);
            throw new ServiceException("Error activating promo code from service");
        }
    }

    // deactivate promo code
    async deactivatePromoCode(promoCodeId: string): Promise<PromoCodes> {
        try {
            const promoCode = await this.promoCodesRepo.get(promoCodeId);
            
            const updatedPromoCode = new PromoCodeBuilder()
                .setPromoCodeId(promoCodeId)
                .setBusinessId(promoCode.getBusinessId())
                .setPromocode(promoCode.getPromocode())
                .setDiscountPercentage(promoCode.getDiscountPercentage())
                .setIsActive(false)
                .build();

            await this.promoCodesRepo.update(updatedPromoCode);
            logger.info(`Promo code deactivated ${promoCodeId}`);
            
            return updatedPromoCode;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Promo code not found: ${promoCodeId}`);
            }
            logger.error(`Error deactivating promo code ${promoCodeId} from service`, error as Error);
            throw new ServiceException("Error deactivating promo code from service");
        }
    }

    // check if promo code exists
    async promoCodeExists(promoCode: string, businessId: string): Promise<boolean> {
        try {
            const allPromoCodes = await this.promoCodesRepo.getAll();
            return allPromoCodes.some(promo => 
                promo.getPromocode().toUpperCase() === promoCode.toUpperCase() &&
                promo.getBusinessId() === businessId
            );
        } catch (error) {
            logger.error(`Error checking if promo code exists ${promoCode} from service`, error as Error);
            throw new ServiceException("Error checking if promo code exists from service");
        }
    }

    // validate promo code uniqueness
    private async validatePromoCodeUniqueness(promoCode: string, businessId: string, excludePromoCodeId?: string): Promise<void> {
        const exists = await this.promoCodeExists(promoCode, businessId);
        if (exists) {
            // If updating, check if it's the same promo code
            if (excludePromoCodeId) {
                const existingPromoCode = await this.getPromoCodeById(excludePromoCodeId);
                if (existingPromoCode.getPromocode().toUpperCase() !== promoCode.toUpperCase()) {
                    throw new ServiceException("Promo code already exists for this business");
                }
            } else {
                throw new ServiceException("Promo code already exists for this business");
            }
        }
    }
}
