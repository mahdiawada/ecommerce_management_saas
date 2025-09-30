import { ProductBuilder } from "../builders/product.builder";
import { ProductRepository } from "../repository/Postgres/product.repository";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/serviceException";
import logger from "../util/logger";
import { Product } from "model/product.model";


type createProductInput = {
    businessId: string;
    inventoryId?: string;
    name: string;
    description?: string;
    photo?: string;
    quantityInStock: number;
    minimumStockLevel: number;
    costPrice: number;
    sellPrice: number;
    createdAt: Date;
}

type UpdateProductInput = {
    inventoryId?: string;
    name?: string;
    description?: string;
    photo?: string;
    quantityInStock?: number;
    minimumStockLevel?: number;
    costPrice?: number;
    sellPrice?: number;
};

export class ProductService {
    private productRepo = new ProductRepository();

    constructor(productRepo: ProductRepository) {
        this.productRepo = productRepo;
    }

    // create product
    async createProduct(input: createProductInput): Promise<string> {
        try {
            const businessId = input.businessId;
            const inventoryId = input.inventoryId;
            const name = input.name;
            const description = input.description;
            const photo = input.photo;
            const quantityInStock = input.quantityInStock;
            const minimumStockLevel = input.minimumStockLevel;
            const costPrice = input.costPrice;
            const sellPrice = input.sellPrice;
            const createdAt = input.createdAt;

            if (!businessId || !name || !quantityInStock || !minimumStockLevel || !costPrice || !sellPrice) {
                throw new ServiceException("Missing required fields");
            }

            if (quantityInStock < 0) {
                throw new ServiceException("Quantity in stock cannot be negative");
            }
            if (minimumStockLevel < 0) {
                throw new ServiceException("Minimum stock level cannot be negative");
            }
            if (costPrice < 0) {
                throw new ServiceException("Cost price cannot be negative");
            }
            if (sellPrice < 0) {
                throw new ServiceException("Sell price cannot be negative");
            }

            const product = new ProductBuilder()
                        .setProductId(generateUUID("product"))
                        .setBusinessId(businessId)
                        .setInventoryId(inventoryId)
                        .setName(name)
                        .setDescription(description)
                        .setPhoto(photo)
                        .setQuantityInStock(quantityInStock)
                        .setMinimumStockLevel(minimumStockLevel)
                        .setCostPrice(costPrice)
                        .setSellPrice(sellPrice)
                        .setCreatedAt(createdAt)
                        .build();
            
            await this.productRepo.create(product);
            logger.info(`Product created ${product.getProductId()}`);
            return product.getProductId();
        } catch (error) {
            logger.error(`Error creating product ${error} from service`);
            throw new ServiceException("Error creating product from service");
        }
    } 
    // get
    async getProductById(productId: string): Promise<Product> {
        try {
            const product = await this.productRepo.get(productId);
            if (!product) {
                throw new ServiceException("Product not found");
            }
            return product;
        } catch (error) {
            logger.error(`Error getting product ${productId} from service`, error as Error);
            throw new ServiceException("Error getting product from service");
        }
    }
    // get products by business
    async getProductsByBusiness(businessId: string): Promise<Product[]> {
        try {
            const allProducts = await this.productRepo.getAll();
            const businessProducts = allProducts.filter(product => product.getBusinessId() === businessId);
            return businessProducts;
        } catch (error) {
            logger.error(`Error getting products for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting products for business from service");
        }
    }

    async getProductsByInventory(inventoryId: string): Promise<Product[]> {
        try {
            const allProducts = await this.productRepo.getAll();
            const inventoryProducts = allProducts.filter(product => product.getInventoryId() === inventoryId);
            return inventoryProducts;
        } catch (error) {
            logger.error(`Error getting products for inventory ${inventoryId} from service`, error as Error);
            throw new ServiceException("Error getting products for inventory from service");
        }
    }

    // update
    async updateProduct(productId: string, input: UpdateProductInput): Promise<Product> {
        try {
            const product = await this.productRepo.get(productId);
            
            const updatedProduct = new ProductBuilder()
                .setProductId(productId)
                .setBusinessId(product.getBusinessId())
                .setInventoryId(input.inventoryId ?? product.getInventoryId())
                .setName(input.name ?? product.getName())
                .setDescription(input.description ?? product.getDescription())
                .setPhoto(input.photo ?? product.getPhoto())
                .setQuantityInStock(input.quantityInStock ?? product.getQuantityInStock())
                .setMinimumStockLevel(input.minimumStockLevel ?? product.getMinimumStockLevel())
                .setCostPrice(input.costPrice ?? product.getCostPrice())
                .setSellPrice(input.sellPrice ?? product.getSellPrice())
                .setCreatedAt(product.getCreatedAt())
                .build();

            await this.productRepo.update(updatedProduct);
            logger.info(`Product updated ${productId}`);
            
            return updatedProduct;
        } catch (error) {
            logger.error(`Error updating product ${productId} from service`, error as Error);
            throw new ServiceException("Error updating product from service");
        }
    }
    // delete
    async deleteProduct(productId: string): Promise<void> {
        try {
            await this.productRepo.delete(productId);
            logger.info(`Product deleted ${productId}`);
        } catch (error) {
            logger.error(`Error deleting product ${productId} from service`, error as Error);
            throw new ServiceException("Error deleting product from service");
        }
    }
}