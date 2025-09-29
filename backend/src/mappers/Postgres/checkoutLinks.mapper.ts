import { CheckoutLinks } from "../../model/checkoutLinks.model";
import { IMapper } from "../IMapper";
import { CheckoutLinksBuilder } from "../../builders/checkoutLinks.builder";

export interface PostgresCheckoutLinks {
    link_id: string;
    order_id: string;
    unique_token: string;
    is_active: boolean;
    created_at: Date;
}

export class CheckoutLinksMapper implements IMapper<PostgresCheckoutLinks, CheckoutLinks> {
    map(data: PostgresCheckoutLinks): CheckoutLinks {
        return new CheckoutLinksBuilder()
            .setLinkId(data.link_id)
            .setOrderId(data.order_id)
            .setUniqueToken(data.unique_token)
            .setIsActive(data.is_active)
            .setCreatedAt(data.created_at)
            .build();
    }

    reverseMap(data: CheckoutLinks): PostgresCheckoutLinks {
        return {
            link_id: data.getLinkId(),
            order_id: data.getOrderId(),
            unique_token: data.getUniqueToken(),
            is_active: data.getIsActive(),
            created_at: data.getCreatedAt(),
        };
    }
}