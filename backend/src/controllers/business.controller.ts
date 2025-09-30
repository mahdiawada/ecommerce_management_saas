import { NextFunction, Request, Response } from "express";
import { BusinessService } from "../services/business.service";
import { ApiException } from "../util/exceptions/ApiException";

export class BusinessController {
    constructor(private readonly businessService: BusinessService) {}
    // create business 
    public async createBusiness(req: Request, res: Response, next: NextFunction) {
        try {
            const business = req.body;
            if (!business) {
                throw new Error("Business is required");
            }
            const createdBusiness = await this.businessService.createBusiness(business);
            res.status(201).json(createdBusiness);
        } catch (error) {
            next(new ApiException(400, "Error creating business", error as Error));
        }
    }
    // get business by id
    public async getBusinessById(req: Request, res: Response, next: NextFunction) {
        try {
            const businessId = req.params.businessId;
            const business = await this.businessService.getBusinessById(businessId);
            res.status(200).json(business);
        } catch (error) {
            next(new ApiException(400, "Error getting business by id", error as Error));
        }
    }
    // get all businesses
    public async getAllBusinesses(req: Request, res: Response, next: NextFunction) {
        try {
            const businesses = await this.businessService.getAllBusinesses();
            res.status(200).json(businesses);
        } catch (error) {
            next(new ApiException(400, "Error getting all businesses", error as Error));
        }
    }
    // update business
	public async updateBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const businessId = req.params.businessId;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			const updatePayload = req.body;
			await this.businessService.updateBusiness(businessId, updatePayload);
			res.status(200).json({ message: "Business updated successfully" });
		} catch (error) {
			next(new ApiException(400, "Error updating business", error as Error));
		}
	}
	// delete business
	public async deleteBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const businessId = req.params.businessId;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			await this.businessService.deleteBusiness(businessId);
			res.status(204).send();
		} catch (error) {
			next(new ApiException(400, "Error deleting business", error as Error));
		}
	}
}
