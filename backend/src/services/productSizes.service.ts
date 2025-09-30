import { ProductSizesBuilder } from "../builders/productSizes.builder";
import { ProductSizesRepository } from "../repository/Postgres/productSizes.repository";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/serviceException";
import logger from "../util/logger";
import { ProductSize } from "../model/productSizes.model";
import { NotFoundException } from "../util/exceptions/repositoryException";

type CreateProductSizeInput = {
    productId: string;
    sizeName: string;
};

type UpdateProductSizeInput = {
    sizeName?: string;
};

export class ProductSizesService {
    private productSizesRepo: ProductSizesRepository;

    constructor(productSizesRepo?: ProductSizesRepository) {
        this.productSizesRepo = productSizesRepo || new ProductSizesRepository();
    }

    // create product size
    async createProductSize(input: CreateProductSizeInput): Promise<string> {
        try {
            const { productId, sizeName } = input;

            if (!productId) {
                throw new ServiceException("Product ID is required");
            }
            if (!sizeName || sizeName.trim() === "") {
                throw new ServiceException("Size name is required");
            }

            const productSize = new ProductSizesBuilder()
                .setSizeId(generateUUID("size"))
                .setProductId(productId)
                .setSizeName(sizeName.trim())
                .build();

            await this.productSizesRepo.create(productSize);
            logger.info(`Product size created ${productSize.getSizeId()} for product ${productId}`);
            return productSize.getSizeId();
        } catch (error) {
            logger.error(`Error creating product size for product ${input.productId} from service`, error as Error);
            throw new ServiceException("Error creating product size from service");
        }
    }

    // get product size by id
    async getProductSizeById(sizeId: string): Promise<ProductSize> {
        try {
            const productSize = await this.productSizesRepo.get(sizeId);
            return productSize;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Product size not found: ${sizeId}`);
            }
            logger.error(`Error getting product size ${sizeId} from service`, error as Error);
            throw new ServiceException("Error getting product size from service");
        }
    }

    // get all product sizes
    async getAllProductSizes(): Promise<ProductSize[]> {
        try {
            const productSizes = await this.productSizesRepo.getAll();
            return productSizes;
        } catch (error) {
            logger.error(`Error getting all product sizes from service`, error as Error);
            throw new ServiceException("Error getting all product sizes from service");
        }
    }

    // get product sizes by product
    async getProductSizesByProduct(productId: string): Promise<ProductSize[]> {
        try {
            const allProductSizes = await this.productSizesRepo.getAll();
            const productSizes = allProductSizes.filter(size => size.getProductId() === productId);
            return productSizes;
        } catch (error) {
            logger.error(`Error getting product sizes for product ${productId} from service`, error as Error);
            throw new ServiceException("Error getting product sizes for product from service");
        }
    }

    // update product size
    async updateProductSize(sizeId: string, input: UpdateProductSizeInput): Promise<ProductSize> {
        try {
            const productSize = await this.productSizesRepo.get(sizeId);
            
            const updatedProductSize = new ProductSizesBuilder()
                .setSizeId(sizeId)
                .setProductId(productSize.getProductId())
                .setSizeName(input.sizeName ?? productSize.getSizeName())
                .build();

            await this.productSizesRepo.update(updatedProductSize);
            logger.info(`Product size updated ${sizeId}`);
            
            return updatedProductSize;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Product size not found: ${sizeId}`);
            }
            logger.error(`Error updating product size ${sizeId} from service`, error as Error);
            throw new ServiceException("Error updating product size from service");
        }
    }

    // delete product size
    async deleteProductSize(sizeId: string): Promise<void> {
        try {
            await this.productSizesRepo.delete(sizeId);
            logger.info(`Product size deleted ${sizeId}`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Product size not found: ${sizeId}`);
            }
            logger.error(`Error deleting product size ${sizeId} from service`, error as Error);
            throw new ServiceException("Error deleting product size from service");
        }
    }

    // add multiple sizes to a product
    async addSizesToProduct(productId: string, sizes: string[]): Promise<string[]> {
        try {
            if (!productId) {
                throw new ServiceException("Product ID is required");
            }
            if (!sizes || sizes.length === 0) {
                throw new ServiceException("At least one size is required");
            }

            const createdSizeIds: string[] = [];
            
            for (const sizeName of sizes) {
                if (sizeName && sizeName.trim() !== "") {
                    const sizeId = await this.createProductSize({
                        productId,
                        sizeName: sizeName.trim()
                    });
                    createdSizeIds.push(sizeId);
                }
            }

            logger.info(`Added ${createdSizeIds.length} sizes to product ${productId}`);
            return createdSizeIds;
        } catch (error) {
            logger.error(`Error adding sizes to product ${productId} from service`, error as Error);
            throw new ServiceException("Error adding sizes to product from service");
        }
    }

}
