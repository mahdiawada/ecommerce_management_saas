export class Customer {
    private customerId: string;
    private businessId: string;
    private fullName: string;
    private phoneNumber: string;
    private email?: string;
    private instagramUsername?: string;
    private address: string;
    private city: string;
    private birthday?: string;
    private codRiskFlag: boolean;
    
    constructor(
        customerId: string,
        businessId: string,
        fullName: string,
        phoneNumber: string,
        email: string | undefined,
        instagramUsername: string | undefined,
        address: string,
        city: string,
        birthday: string | undefined,
        codRiskFlag: boolean
    ) {
        this.customerId = customerId;
        this.businessId = businessId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.instagramUsername = instagramUsername;
        this.address = address;
        this.city = city;
        this.birthday = birthday;
        this.codRiskFlag = codRiskFlag;
    }

    getCustomerId(): string {
        return this.customerId;
    }

    getBusinessId(): string {
        return this.businessId;
    }

    getFullName(): string {
        return this.fullName;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getEmail(): string | undefined {
        return this.email;
    }

    getInstagramUsername(): string | undefined{
        return this.instagramUsername;
    }

    getAddress(): string {
        return this.address;
    }

    getCity(): string {
        return this.city;
    }

    getBirthday(): string | undefined {
        return this.birthday;
    }

    getCodRiskFlag(): boolean {
        return this.codRiskFlag;
    }
}