import logger from "../util/logger";
import { Customer } from "../model/customer.model";

export class CustomerBuilder {
    private customerId!: string;
    private businessId!: string;
    private fullName!: string;
    private phoneNumber!: string;
    private email?: string;
    private instagramUsername?: string;
    private address!: string;
    private city!: string;
    private birthday?: string;
    private codRiskFlag!: boolean;

    public setCustomerId(customerId: string): CustomerBuilder {
        this.customerId = customerId;
        return this;
    }

    public setBusinessId(businessId: string): CustomerBuilder {
        this.businessId = businessId;
        return this;
    }

    public setFullName(fullName: string): CustomerBuilder {
        this.fullName = fullName;
        return this;
    }

    public setPhoneNumber(phoneNumber: string): CustomerBuilder {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public setEmail(email: string | undefined): CustomerBuilder {
        this.email = email;
        return this;
    }

    public setInstagramUsername(instagramUsername: string | undefined): CustomerBuilder {
        this.instagramUsername = instagramUsername;
        return this;
    }

    public setAddress(address: string): CustomerBuilder {
        this.address = address;
        return this;
    }

    public setCity(city: string): CustomerBuilder {
        this.city = city;
        return this;
    }

    public setBirthday(birthday: string | undefined): CustomerBuilder {
        this.birthday = birthday;
        return this;
    }

    public setCodRiskFlag(codRiskFlag: boolean): CustomerBuilder {
        this.codRiskFlag = codRiskFlag;
        return this;
    }

    build(): Customer {
        const requiredProps = [
            this.customerId,
            this.businessId,
            this.fullName,
            this.phoneNumber,
            this.city,
            this.codRiskFlag
        ];

        for (const property of requiredProps) {
            if(property === null) {
                logger.error("Missing required property, couldn't build a customer");
                throw new Error("Missing required property");
            }
        }

        return new Customer(
            this.customerId,
            this.businessId,
            this.fullName,
            this.phoneNumber,
            this.email,
            this.instagramUsername,
            this.address,
            this.city,
            this.birthday,
            this.codRiskFlag
        );
    }
}