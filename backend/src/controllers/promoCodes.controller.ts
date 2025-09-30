import { NextFunction, Request, Response } from "express";
import { PromoCodesService } from "../services/promoCodes.service";
import { ApiException } from "../util/exceptions/ApiException";

export class PromoCodesController {
	constructor(private readonly promoCodesService: PromoCodesService) {}

	public async createPromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = req.body;
			if (!payload) {
				throw new Error("Promo code payload is required");
			}
			const promoCodeId = await this.promoCodesService.createPromoCode(payload);
			res.status(201).json({ promoCodeId });
		} catch (error) {
			next(new ApiException(400, "Error creating promo code", error as Error));
		}
	}

	public async getPromoCodeById(req: Request, res: Response, next: NextFunction) {
		try {
			const { promoCodeId } = req.params;
			if (!promoCodeId) {
				throw new Error("Promo code id is required");
			}
			const promoCode = await this.promoCodesService.getPromoCodeById(promoCodeId);
			res.status(200).json(promoCode);
		} catch (error) {
			next(new ApiException(400, "Error getting promo code by id", error as Error));
		}
	}

	public async getAllPromoCodes(req: Request, res: Response, next: NextFunction) {
		try {
			const promoCodes = await this.promoCodesService.getAllPromoCodes();
			res.status(200).json(promoCodes);
		} catch (error) {
			next(new ApiException(400, "Error getting all promo codes", error as Error));
		}
	}

	public async getPromoCodesByBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const { businessId } = req.params;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			const promoCodes = await this.promoCodesService.getPromoCodesByBusiness(businessId);
			res.status(200).json(promoCodes);
		} catch (error) {
			next(new ApiException(400, "Error getting promo codes for business", error as Error));
		}
	}

	public async getActivePromoCodesByBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const { businessId } = req.params;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			const promoCodes = await this.promoCodesService.getActivePromoCodesByBusiness(businessId);
			res.status(200).json(promoCodes);
		} catch (error) {
			next(new ApiException(400, "Error getting active promo codes for business", error as Error));
		}
	}

	public async updatePromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const { promoCodeId } = req.params;
			if (!promoCodeId) {
				throw new Error("Promo code id is required");
			}
			const payload = req.body;
			const updatedPromoCode = await this.promoCodesService.updatePromoCode(promoCodeId, payload);
			res.status(200).json(updatedPromoCode);
		} catch (error) {
			next(new ApiException(400, "Error updating promo code", error as Error));
		}
	}

	public async deletePromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const { promoCodeId } = req.params;
			if (!promoCodeId) {
				throw new Error("Promo code id is required");
			}
			await this.promoCodesService.deletePromoCode(promoCodeId);
			res.status(204).send();
		} catch (error) {
			next(new ApiException(400, "Error deleting promo code", error as Error));
		}
	}

	public async validatePromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const { promocode, businessId, orderTotal } = req.body;
			if (!promocode || !businessId || orderTotal === undefined) {
				throw new Error("Promocode, businessId, and orderTotal are required");
			}
			const result = await this.promoCodesService.validatePromoCode(promocode, businessId, Number(orderTotal));
			res.status(200).json(result);
		} catch (error) {
			next(new ApiException(400, "Error validating promo code", error as Error));
		}
	}

	public async activatePromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const { promoCodeId } = req.params;
			if (!promoCodeId) {
				throw new Error("Promo code id is required");
			}
			const updatedPromoCode = await this.promoCodesService.activatePromoCode(promoCodeId);
			res.status(200).json(updatedPromoCode);
		} catch (error) {
			next(new ApiException(400, "Error activating promo code", error as Error));
		}
	}

	public async deactivatePromoCode(req: Request, res: Response, next: NextFunction) {
		try {
			const { promoCodeId } = req.params;
			if (!promoCodeId) {
				throw new Error("Promo code id is required");
			}
			const updatedPromoCode = await this.promoCodesService.deactivatePromoCode(promoCodeId);
			res.status(200).json(updatedPromoCode);
		} catch (error) {
			next(new ApiException(400, "Error deactivating promo code", error as Error));
		}
	}
}

