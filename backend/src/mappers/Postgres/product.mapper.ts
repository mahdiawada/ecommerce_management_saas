import { Product } from "../../model/product.model";
import { IMapper } from "../IMapper";
import { ProductBuilder } from "../../builders/product.builder";

export interface PostgresProduct {
    product_id: string;
    business_id: string;
    inventory_id?: string;
    name: string;
    description?: string;
    photo?: string;
    quantity_in_stock: number;
    minimum_stock_level: number;
    cost_price: number;
    sell_price: number;
    created_at: Date;
}

export class ProductMapper implements IMapper<PostgresProduct, Product> {
    map(data: PostgresProduct): Product {
        const builder = new ProductBuilder()
            .setProductId(data.product_id)
            .setBusinessId(data.business_id)
            .setInventoryId(data.inventory_id)
            .setName(data.name)
            .setQuantityInStock(data.quantity_in_stock)
            .setMinimumStockLevel(data.minimum_stock_level)
            .setCostPrice(data.cost_price)
            .setSellPrice(data.sell_price)
            .setCreatedAt(data.created_at);

        if (data.description) {
            builder.setDescription(data.description);
        }
        if (data.photo) {
            builder.setPhoto(data.photo);
        }
        return builder.build();
    }

    reverseMap(data: Product): PostgresProduct {
        return {
            product_id: data.getProductId(),
            business_id: data.getBusinessId(),
            inventory_id: data.getInventoryId(),
            name: data.getName(),
            description: data.getDescription(),
            photo: data.getPhoto(),
            quantity_in_stock: data.getQuantityInStock(),
            minimum_stock_level: data.getMinimumStockLevel(),
            cost_price: data.getCostPrice(),
            sell_price: data.getSellPrice(),
            created_at: data.getCreatedAt()
        };
    }
}