import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ApiException } from "../util/exceptions/ApiException";

export class ProductController {
	constructor(private readonly productService: ProductService) {}

	public async createProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = req.body;
			if (!payload) {
				throw new Error("Product payload is required");
			}
			const productId = await this.productService.createProduct(payload);
			res.status(201).json({ productId });
		} catch (error) {
			next(new ApiException(400, "Error creating product", error as Error));
		}
	}

	public async getProductById(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			if (!productId) {
				throw new Error("Product id is required");
			}
			const product = await this.productService.getProductById(productId);
			res.status(200).json(product);
		} catch (error) {
			next(new ApiException(400, "Error getting product by id", error as Error));
		}
	}

	public async getProductsByBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const { businessId } = req.params;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			const products = await this.productService.getProductsByBusiness(businessId);
			res.status(200).json(products);
		} catch (error) {
			next(new ApiException(400, "Error getting products for business", error as Error));
		}
	}

	public async getProductsByInventory(req: Request, res: Response, next: NextFunction) {
		try {
			const { inventoryId } = req.params;
			if (!inventoryId) {
				throw new Error("Inventory id is required");
			}
			const products = await this.productService.getProductsByInventory(inventoryId);
			res.status(200).json(products);
		} catch (error) {
			next(new ApiException(400, "Error getting products for inventory", error as Error));
		}
	}

	public async updateProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			if (!productId) {
				throw new Error("Product id is required");
			}
			const payload = req.body;
			const updatedProduct = await this.productService.updateProduct(productId, payload);
			res.status(200).json(updatedProduct);
		} catch (error) {
			next(new ApiException(400, "Error updating product", error as Error));
		}
	}

	public async deleteProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			if (!productId) {
				throw new Error("Product id is required");
			}
			await this.productService.deleteProduct(productId);
			res.status(204).send();
		} catch (error) {
			next(new ApiException(400, "Error deleting product", error as Error));
		}
	}
}

