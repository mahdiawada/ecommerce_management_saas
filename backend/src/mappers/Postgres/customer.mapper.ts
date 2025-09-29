import { Customer } from "../../model/customer.model";
import { IMapper } from "../IMapper";
import { CustomerBuilder } from "../../builders/customer.builder";

export interface PostgresCustomer {
    customer_id: string;
    business_id: string;
    customer_name: string;
    phone_number?: string;
    email?: string;
    instagram_username?: string;
    address: string;
    city: string;
    birthday?: string;
    cod_risk_flag: boolean;
}

export class CustomerMapper implements IMapper<PostgresCustomer, Customer> {
    map(data: PostgresCustomer): Customer {
        const builder = new CustomerBuilder()
            .setCustomerId(data.customer_id)
            .setBusinessId(data.business_id)
            .setFullName(data.customer_name)
            .setAddress(data.address)
            .setCity(data.city)
            .setCodRiskFlag(data.cod_risk_flag);

        if (data.phone_number) {
            builder.setPhoneNumber(data.phone_number);
        }

        if (data.email) {
            builder.setEmail(data.email);
        }

        if (data.instagram_username) {
            builder.setInstagramUsername(data.instagram_username);
        }
        if (data.birthday) {
            builder.setBirthday(data.birthday);
        }

        return builder.build();
    }

    reverseMap(data: Customer): PostgresCustomer {
        return {
            customer_id: data.getCustomerId(),
            business_id: data.getBusinessId(),
            customer_name: data.getFullName(),
            phone_number: data.getPhoneNumber(),
            email: data.getEmail(),
            instagram_username: data.getInstagramUsername(),
            address: data.getAddress(),
            city: data.getCity(),
            birthday: data.getBirthday(),
            cod_risk_flag: data.getCodRiskFlag()
        };
    }
}