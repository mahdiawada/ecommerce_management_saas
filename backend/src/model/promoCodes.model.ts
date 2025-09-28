export class PromoCodes {
    private promoCodeId: string;
    private businessId: string;
    private promocode: string;
    private discountPercentage: number;
    private is_active: boolean;

    constructor(
        promoCodeId: string,
        businessId: string,
        promocode: string,
        discountPercentage: number,
        is_active: boolean
    ) {
        this.promoCodeId = promoCodeId;
        this.businessId = businessId;
        this.promocode = promocode;
        this.discountPercentage = discountPercentage;
        this.is_active = is_active;
    }

    getPromoCodeId(): string {
        return this.promoCodeId;
    }

    getBusinessId(): string {
        return this.businessId;
    }

    getPromocode(): string {
        return this.promocode;
    }

    getDiscountPercentage(): number {
        return this.discountPercentage;
    }

    getIsActive(): boolean {
        return this.is_active;
    }
}