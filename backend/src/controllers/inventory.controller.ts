import { NextFunction, Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { ApiException } from "../util/exceptions/ApiException";

export class InventoryController {
	constructor(private readonly inventoryService: InventoryService) {}

	public async createInventory(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = req.body;
			if (!payload) {
				throw new Error("Inventory payload is required");
			}
			const inventoryId = await this.inventoryService.createInventory(payload);
			res.status(201).json({ inventoryId });
		} catch (error) {
			next(new ApiException(400, "Error creating inventory", error as Error));
		}
	}

	public async getInventoryById(req: Request, res: Response, next: NextFunction) {
		try {
			const { inventoryId } = req.params;
			if (!inventoryId) {
				throw new Error("Inventory id is required");
			}
			const inventory = await this.inventoryService.getInventoryById(inventoryId);
			res.status(200).json(inventory);
		} catch (error) {
			next(new ApiException(400, "Error getting inventory by id", error as Error));
		}
	}

	public async getAllInventories(req: Request, res: Response, next: NextFunction) {
		try {
			const inventories = await this.inventoryService.getAllInventories();
			res.status(200).json(inventories);
		} catch (error) {
			next(new ApiException(400, "Error getting all inventories", error as Error));
		}
	}

	public async getInventoriesByBusiness(req: Request, res: Response, next: NextFunction) {
		try {
			const { businessId } = req.params;
			if (!businessId) {
				throw new Error("Business id is required");
			}
			const inventories = await this.inventoryService.getInventoriesByBusiness(businessId);
			res.status(200).json(inventories);
		} catch (error) {
			next(new ApiException(400, "Error getting inventories for business", error as Error));
		}
	}

	public async updateInventory(req: Request, res: Response, next: NextFunction) {
		try {
			const { inventoryId } = req.params;
			if (!inventoryId) {
				throw new Error("Inventory id is required");
			}
			const payload = req.body;
			const updatedInventory = await this.inventoryService.updateInventory(inventoryId, payload);
			res.status(200).json(updatedInventory);
		} catch (error) {
			next(new ApiException(400, "Error updating inventory", error as Error));
		}
	}

	public async deleteInventory(req: Request, res: Response, next: NextFunction) {
		try {
			const { inventoryId } = req.params;
			if (!inventoryId) {
				throw new Error("Inventory id is required");
			}
			await this.inventoryService.deleteInventory(inventoryId);
			res.status(204).send();
		} catch (error) {
			next(new ApiException(400, "Error deleting inventory", error as Error));
		}
	}
}

