import logger from "../util/logger";
import { Business } from "../model/business.model";

export class BusinessBuilder {
    private businessId!: string;
    private businessName!: string;
    private businessLogo?: string;
    private ownerName!: string;
    private email!: string;
    private phoneNumber!: string;
    private passwordHash!: string;
    private whatsappApiKey?: string;
    private createdAt?: Date;

    public setBusinessId(businessId: string): BusinessBuilder {
        this.businessId = businessId;
        return this;
    }

    public setBusinessName(businessName: string): BusinessBuilder {
        this.businessName = businessName;
        return this;
    }

    public setBusinessLogo(businessLogo: string | undefined): BusinessBuilder {
        this.businessLogo = businessLogo;
        return this;
    }

    public setOwnerName(ownerName: string): BusinessBuilder {
        this.ownerName = ownerName;
        return this;
    }

    public setEmail(email: string): BusinessBuilder {
        this.email = email;
        return this;
    }

    public setPhoneNumber(phoneNumber: string): BusinessBuilder {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public setPasswordHash(passwordHash: string): BusinessBuilder {
        this.passwordHash = passwordHash;
        return this;
    }

    public setWhatsappApiKey(whatsappApiKey: string | undefined): BusinessBuilder {
        this.whatsappApiKey = whatsappApiKey;
        return this;
    }

    public setCreatedAt(createdAt: Date | undefined): BusinessBuilder {
        this.createdAt = createdAt;
        return this;
    }

    build(): Business {

        const requiredProps = [
            this.businessId,
            this.businessName,
            this.ownerName,
            this.email,
            this.phoneNumber,
            this.passwordHash,
        ];

        for (const property of requiredProps) {
            if(property === null) {
                logger.error("Missing required property, couldn't build a business account");
                throw new Error("Missing required property");
            }
        }
 
        return new Business(
            this.businessId,
            this.businessName,
            this.ownerName,
            this.email,
            this.phoneNumber,
            this.passwordHash,
            this.createdAt,
            this.businessLogo,
            this.whatsappApiKey,
        )
    }
}