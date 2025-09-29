import { PromoCodes } from "../../model/promoCodes.model";
import { IMapper } from "../IMapper";
import { PromoCodeBuilder } from "../../builders/promoCodes.builder";

export interface PostgresPromoCodes {
    promo_code_id: string;
    business_id: string;
    promo_code: string;
    discount_percentage: number;
    is_active: boolean;  
}

export class PromoCodesMapper implements IMapper<PostgresPromoCodes, PromoCodes>{
    map(data: PostgresPromoCodes): PromoCodes {
        return new PromoCodeBuilder()
        .setPromoCodeId(data.promo_code_id)
        .setBusinessId(data.promo_code_id)
        .setPromocode(data.promo_code)
        .setDiscountPercentage(data.discount_percentage)
        .setIsActive(data.is_active)
        .build();
    }
    reverseMap(data: PromoCodes): PostgresPromoCodes {
        throw new Error("Method not implemented.");
    }

}