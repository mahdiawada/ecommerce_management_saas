import { NextFunction, Request, Response } from "express";
import { ProductSizesService } from "../services/productSizes.service";
import { ApiException } from "../util/exceptions/ApiException";

export class ProductSizesController {
	constructor(private readonly productSizesService: ProductSizesService) {}

	public async createProductSize(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = req.body;
			if (!payload) {
				throw new Error("Product size payload is required");
			}
			const sizeId = await this.productSizesService.createProductSize(payload);
			res.status(201).json({ sizeId });
		} catch (error) {
			next(new ApiException(400, "Error creating product size", error as Error));
		}
	}

	public async getProductSizeById(req: Request, res: Response, next: NextFunction) {
		try {
			const { sizeId } = req.params;
			if (!sizeId) {
				throw new Error("Size id is required");
			}
			const productSize = await this.productSizesService.getProductSizeById(sizeId);
			res.status(200).json(productSize);
		} catch (error) {
			next(new ApiException(400, "Error getting product size by id", error as Error));
		}
	}

	public async getAllProductSizes(req: Request, res: Response, next: NextFunction) {
		try {
			const productSizes = await this.productSizesService.getAllProductSizes();
			res.status(200).json(productSizes);
		} catch (error) {
			next(new ApiException(400, "Error getting all product sizes", error as Error));
		}
	}

	public async getProductSizesByProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			if (!productId) {
				throw new Error("Product id is required");
			}
			const productSizes = await this.productSizesService.getProductSizesByProduct(productId);
			res.status(200).json(productSizes);
		} catch (error) {
			next(new ApiException(400, "Error getting product sizes for product", error as Error));
		}
	}

	public async updateProductSize(req: Request, res: Response, next: NextFunction) {
		try {
			const { sizeId } = req.params;
			if (!sizeId) {
				throw new Error("Size id is required");
			}
			const payload = req.body;
			const updatedProductSize = await this.productSizesService.updateProductSize(sizeId, payload);
			res.status(200).json(updatedProductSize);
		} catch (error) {
			next(new ApiException(400, "Error updating product size", error as Error));
		}
	}

	public async deleteProductSize(req: Request, res: Response, next: NextFunction) {
		try {
			const { sizeId } = req.params;
			if (!sizeId) {
				throw new Error("Size id is required");
			}
			await this.productSizesService.deleteProductSize(sizeId);
			res.status(204).send();
		} catch (error) {
			next(new ApiException(400, "Error deleting product size", error as Error));
		}
	}
}

