import logger from "../util/logger";
import { CheckoutLinks } from "../model/checkoutLinks.model";

export class CheckoutLinksBuilder {
    private linkId!: string;
    private orderId!: string;
    private uniqueToken!: string;
    private isActive!: boolean;
    private createdAt!: Date;

    public setLinkId(linkId: string): CheckoutLinksBuilder {
        this.linkId = linkId;
        return this;
    }

    public setOrderId(orderId: string): CheckoutLinksBuilder {
        this.orderId = orderId;
        return this;
    }

    public setUniqueToken(uniqueToken: string): CheckoutLinksBuilder {
        this.uniqueToken = uniqueToken;
        return this;
    }

    public setIsActive(isActive: boolean): CheckoutLinksBuilder {
        this.isActive = isActive;
        return this;
    }

    public setCreatedAt(createdAt: Date): CheckoutLinksBuilder {
        this.createdAt = createdAt;
        return this;
    }


    build(): CheckoutLinks {
        const requiredProps = [
            this.linkId,
            this.orderId,
            this.uniqueToken,
            this.isActive,
            this.createdAt,
        ];

        for (const property of requiredProps) {
            if(!property) {
                logger.error("Missing required property, couldn't build a checkout link");
                throw new Error("Missing required property");
            }
        }

        return new CheckoutLinks(
            this.linkId,
            this.orderId,
            this.uniqueToken,
            this.isActive,
            this.createdAt,
        );
    }
}