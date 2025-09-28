export class Business {
    private businessId: string;
    private businessName: string;
    private businessLogo?: string;
    private ownerName: string;
    private email: string;
    private phoneNumber: string;
    private passwordHash: string;
    private whatsappApiKey?: string;
    private createdAt?: Date;
    constructor(
        business_id: string,
        businessName: string,
        ownerName: string,
        email: string,
        phoneNumber: string,
        passwordHash: string,
        createdAt?: Date,
        businessLogo?: string,
        whatsappApiKey?: string,
        ) {
        this.businessId = business_id;
        this.businessName = businessName;
        this.businessLogo = businessLogo;
        this.ownerName = ownerName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.whatsappApiKey = whatsappApiKey;
        this.createdAt = createdAt;
    }

    getBusinessId(): string {
        return this.businessId;
    }

    getBusinessName(): string {
        return this.businessName;
    }

    getBusinessLogo(): string | undefined {
        return this.businessLogo;
    }

    getOwnerName(): string {
        return this.ownerName;
    }

    getEmail(): string {
        return this.email;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getWhatsappApiKey(): string | undefined {
        return this.whatsappApiKey;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
}

