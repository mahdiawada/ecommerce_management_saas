import { ProductSize } from "../../model/productSizes.model";
import { IMapper } from "../IMapper";
import { ProductSizesBuilder } from "../../builders/productSizes.builder";

export interface PostgresProductSizes {
    size_id: string;
    product_id: string;
    size_name: string;
}

export class ProductSizesMapper implements IMapper<PostgresProductSizes, ProductSize> {
    map(data: PostgresProductSizes): ProductSize {
        return new ProductSizesBuilder()
            .setSizeId(data.size_id)
            .setProductId(data.product_id)
            .setSizeName(data.size_name)
            .build();
    }

    reverseMap(data: ProductSize): PostgresProductSizes {
        return {
            size_id: data.getSizeId(),
            product_id: data.getProductId(),
            size_name: data.getSizeName(),
        };
    }
}