import { PromoCodes } from "../model/promoCodes.model";

export class PromoCodeBuilder {
    private promoCodeId!: string;
    private businessId!: string;
    private promocode!: string;
    private discountPercentage!: number;
    private is_active!: boolean;

    setPromoCodeId(promoCodeId: string): PromoCodeBuilder {
        this.promoCodeId = promoCodeId;
        return this;
    }

    setBusinessId(businessId: string): PromoCodeBuilder {
        this.businessId = businessId;
        return this;
    }

    setPromocode(promocode: string): PromoCodeBuilder {
        this.promocode = promocode;
        return this;
    }

    setDiscountPercentage(discountPercentage: number): PromoCodeBuilder {
        this.discountPercentage = discountPercentage;
        return this;
    }

    setIsActive(is_active: boolean): PromoCodeBuilder {
        this.is_active = is_active;
        return this;
    }

    build() {
        const requiredProps = [
            this.promoCodeId,
            this.businessId,
            this.promocode,
            this.discountPercentage,
            this.is_active,
        ];

        for (const property of requiredProps) {
            if (property === undefined || property === null) {
                throw new Error("Missing required property, couldn't build a promo code");
            }
        }

        return new PromoCodes(
            this.promoCodeId,
            this.businessId,
            this.promocode,
            this.discountPercentage,
            this.is_active
        );
    }
}