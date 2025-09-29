import { Business } from "../../model/business.model";
import { IMapper } from "../IMapper";
import { BusinessBuilder } from "../../builders/business.builder";

export interface PostgresBusiness {
    business_id: string;
    business_name: string;
    business_logo?: string;
    owner_name: string;
    email: string;
    phone_number: string;
    password_hash: string;
    whatsapp_api_key?: string;
    created_at?: Date;
}

export class BusinessMapper implements IMapper<PostgresBusiness, Business> {
    map(data: PostgresBusiness): Business {
        const builder = new BusinessBuilder()
                .setBusinessId(data.business_id)
                .setBusinessName(data.business_name)
                .setOwnerName(data.owner_name)
                .setEmail(data.email)
                .setPhoneNumber(data.phone_number)
                .setPasswordHash(data.password_hash)
                .setCreatedAt(data.created_at)
                .setBusinessLogo(data.business_logo) 
                .setWhatsappApiKey(data.whatsapp_api_key);

        return builder.build();
    }
    reverseMap(data: Business): PostgresBusiness {
        return {
            business_id: data.getBusinessId(),
            business_name: data.getBusinessName(),
            business_logo: data.getBusinessLogo(),
            owner_name: data.getOwnerName(),
            email: data.getEmail(),
            phone_number: data.getPhoneNumber(),
            password_hash: data.getPasswordHash(),
            whatsapp_api_key: data.getWhatsappApiKey(),
            created_at: data.getCreatedAt(),
        }
    }

}