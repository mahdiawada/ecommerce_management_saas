import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { InventoryService } from "../services/inventory.service";
import { InventoryRepository } from "../repository/Postgres/inventory.repository";

const inventoryController = new InventoryController(new InventoryService(new InventoryRepository()));
const route = Router();

route.route('/:inventoryId')
    .get(inventoryController.getInventoryById.bind(inventoryController))
    .put(inventoryController.updateInventory.bind(inventoryController))
    .delete(inventoryController.deleteInventory.bind(inventoryController));

route.route('/')
    .get(inventoryController.getAllInventories.bind(inventoryController))
    .post(inventoryController.createInventory.bind(inventoryController));

route.route('/business/:businessId')
    .get(inventoryController.getInventoriesByBusiness.bind(inventoryController));

export default route;