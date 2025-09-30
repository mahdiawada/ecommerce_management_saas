import { CustomerBuilder } from "../builders/customer.builder";
import { CustomerRepository } from "../repository/Postgres/customer.repository";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/serviceException";
import logger from "../util/logger";
import { Customer } from "../model/customer.model";
import { NotFoundException } from "../util/exceptions/repositoryException";

type CreateCustomerInput = {
    businessId: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    instagramUsername?: string;
    address: string;
    city: string;
    birthday?: string;
    codRiskFlag?: boolean;
};

type UpdateCustomerInput = {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    instagramUsername?: string;
    address?: string;
    city?: string;
    birthday?: string;
    codRiskFlag?: boolean;
};

type CustomerSpending = {
    totalSpent: number;
    totalOrders: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
};

export class CustomerService {
    private customerRepo: CustomerRepository;

    constructor(customerRepo?: CustomerRepository) {
        this.customerRepo = customerRepo || new CustomerRepository();
    }

    // create customer
    async createCustomer(input: CreateCustomerInput): Promise<string> {
        try {
            const { 
                businessId, 
                fullName, 
                phoneNumber, 
                email, 
                instagramUsername, 
                address, 
                city, 
                birthday, 
                codRiskFlag = false 
            } = input;

            if (!businessId) {
                throw new ServiceException("Business ID is required");
            }
            if (!fullName || fullName.trim() === "") {
                throw new ServiceException("Full name is required");
            }
            if (!phoneNumber || phoneNumber.trim() === "") {
                throw new ServiceException("Phone number is required");
            }
            if (!address || address.trim() === "") {
                throw new ServiceException("Address is required");
            }
            if (!city || city.trim() === "") {
                throw new ServiceException("City is required");
            }

            // Validate email format if provided
            if (email && !this.isValidEmail(email)) {
                throw new ServiceException("Invalid email format");
            }

            // Check email uniqueness if provided
            if (email) {
                await this.validateEmailUniqueness(email);
            }

            const customer = new CustomerBuilder()
                .setCustomerId(generateUUID("customer"))
                .setBusinessId(businessId)
                .setFullName(fullName.trim())
                .setPhoneNumber(phoneNumber.trim())
                .setEmail(email)
                .setInstagramUsername(instagramUsername)
                .setAddress(address.trim())
                .setCity(city.trim())
                .setBirthday(birthday)
                .setCodRiskFlag(codRiskFlag)
                .build();

            await this.customerRepo.create(customer);
            logger.info(`Customer created ${customer.getCustomerId()} for business ${businessId}`);
            return customer.getCustomerId();
        } catch (error) {
            logger.error(`Error creating customer for business ${input.businessId} from service`, error as Error);
            throw new ServiceException("Error creating customer from service");
        }
    }

    // get customer by id
    async getCustomerById(customerId: string): Promise<Customer> {
        try {
            const customer = await this.customerRepo.get(customerId);
            return customer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Customer not found: ${customerId}`);
            }
            logger.error(`Error getting customer ${customerId} from service`, error as Error);
            throw new ServiceException("Error getting customer from service");
        }
    }

    // get all customers
    async getAllCustomers(): Promise<Customer[]> {
        try {
            const customers = await this.customerRepo.getAll();
            return customers;
        } catch (error) {
            logger.error(`Error getting all customers from service`, error as Error);
            throw new ServiceException("Error getting all customers from service");
        }
    }

    // get customers by business
    async getCustomersByBusiness(businessId: string): Promise<Customer[]> {
        try {
            const allCustomers = await this.customerRepo.getAll();
            const businessCustomers = allCustomers.filter(customer => customer.getBusinessId() === businessId);
            return businessCustomers;
        } catch (error) {
            logger.error(`Error getting customers for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting customers for business from service");
        }
    }

    // get customers by COD risk level
    async getCODRiskCustomers(businessId: string): Promise<Customer[]> {
        try {
            const allCustomers = await this.customerRepo.getAll();
            const riskCustomers = allCustomers.filter(customer => 
                customer.getBusinessId() === businessId && customer.getCodRiskFlag()
            );
            return riskCustomers;
        } catch (error) {
            logger.error(`Error getting COD risk customers for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error getting COD risk customers from service");
        }
    }

    // search customers by name or phone
    async searchCustomers(businessId: string, searchTerm: string): Promise<Customer[]> {
        try {
            const allCustomers = await this.customerRepo.getAll();
            const searchLower = searchTerm.toLowerCase();
            const filteredCustomers = allCustomers.filter(customer => 
                customer.getBusinessId() === businessId && (
                    customer.getFullName().toLowerCase().includes(searchLower) ||
                    customer.getPhoneNumber().includes(searchTerm) ||
                    (customer.getEmail() && customer.getEmail()!.toLowerCase().includes(searchLower)) ||
                    (customer.getInstagramUsername() && customer.getInstagramUsername()!.toLowerCase().includes(searchLower))
                )
            );
            return filteredCustomers;
        } catch (error) {
            logger.error(`Error searching customers for business ${businessId} from service`, error as Error);
            throw new ServiceException("Error searching customers from service");
        }
    }

    // update customer
    async updateCustomer(customerId: string, input: UpdateCustomerInput): Promise<Customer> {
        try {
            const customer = await this.customerRepo.get(customerId);
            
            // Validate email format if provided
            if (input.email && !this.isValidEmail(input.email)) {
                throw new ServiceException("Invalid email format");
            }

            // Check email uniqueness if email is being updated
            if (input.email && input.email !== customer.getEmail()) {
                await this.validateEmailUniqueness(input.email, customerId);
            }

            const updatedCustomer = new CustomerBuilder()
                .setCustomerId(customerId)
                .setBusinessId(customer.getBusinessId())
                .setFullName(input.fullName ?? customer.getFullName())
                .setPhoneNumber(input.phoneNumber ?? customer.getPhoneNumber())
                .setEmail(input.email ?? customer.getEmail())
                .setInstagramUsername(input.instagramUsername ?? customer.getInstagramUsername())
                .setAddress(input.address ?? customer.getAddress())
                .setCity(input.city ?? customer.getCity())
                .setBirthday(input.birthday ?? customer.getBirthday())
                .setCodRiskFlag(input.codRiskFlag ?? customer.getCodRiskFlag())
                .build();

            await this.customerRepo.update(updatedCustomer);
            logger.info(`Customer updated ${customerId}`);
            
            return updatedCustomer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Customer not found: ${customerId}`);
            }
            logger.error(`Error updating customer ${customerId} from service`, error as Error);
            throw new ServiceException("Error updating customer from service");
        }
    }

    // delete customer
    async deleteCustomer(customerId: string): Promise<void> {
        try {
            await this.customerRepo.delete(customerId);
            logger.info(`Customer deleted ${customerId}`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Customer not found: ${customerId}`);
            }
            logger.error(`Error deleting customer ${customerId} from service`, error as Error);
            throw new ServiceException("Error deleting customer from service");
        }
    }

    // flag customer as COD risk
    async flagCODRisk(customerId: string, reason?: string): Promise<Customer> {
        try {
            const customer = await this.customerRepo.get(customerId);
            
            const updatedCustomer = new CustomerBuilder()
                .setCustomerId(customerId)
                .setBusinessId(customer.getBusinessId())
                .setFullName(customer.getFullName())
                .setPhoneNumber(customer.getPhoneNumber())
                .setEmail(customer.getEmail())
                .setInstagramUsername(customer.getInstagramUsername())
                .setAddress(customer.getAddress())
                .setCity(customer.getCity())
                .setBirthday(customer.getBirthday())
                .setCodRiskFlag(true)
                .build();

            await this.customerRepo.update(updatedCustomer);
            logger.info(`Customer ${customerId} flagged as COD risk. Reason: ${reason || 'Not specified'}`);
            
            return updatedCustomer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Customer not found: ${customerId}`);
            }
            logger.error(`Error flagging customer ${customerId} as COD risk from service`, error as Error);
            throw new ServiceException("Error flagging customer as COD risk from service");
        }
    }

    // remove COD risk flag
    async removeCODRiskFlag(customerId: string): Promise<Customer> {
        try {
            const customer = await this.customerRepo.get(customerId);
            
            const updatedCustomer = new CustomerBuilder()
                .setCustomerId(customerId)
                .setBusinessId(customer.getBusinessId())
                .setFullName(customer.getFullName())
                .setPhoneNumber(customer.getPhoneNumber())
                .setEmail(customer.getEmail())
                .setInstagramUsername(customer.getInstagramUsername())
                .setAddress(customer.getAddress())
                .setCity(customer.getCity())
                .setBirthday(customer.getBirthday())
                .setCodRiskFlag(false)
                .build();

            await this.customerRepo.update(updatedCustomer);
            logger.info(`COD risk flag removed from customer ${customerId}`);
            
            return updatedCustomer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ServiceException(`Customer not found: ${customerId}`);
            }
            logger.error(`Error removing COD risk flag from customer ${customerId} from service`, error as Error);
            throw new ServiceException("Error removing COD risk flag from service");
        }
    }

    // get customer by email
    async getCustomerByEmail(email: string): Promise<Customer | null> {
        try {
            const allCustomers = await this.customerRepo.getAll();
            const customer = allCustomers.find(c => c.getEmail()?.toLowerCase() === email.toLowerCase());
            return customer || null;
        } catch (error) {
            logger.error(`Error getting customer by email ${email} from service`, error as Error);
            throw new ServiceException("Error getting customer by email from service");
        }
    }

    // get customer by phone
    async getCustomerByPhone(phoneNumber: string): Promise<Customer | null> {
        try {
            const allCustomers = await this.customerRepo.getAll();
            const customer = allCustomers.find(c => c.getPhoneNumber() === phoneNumber);
            return customer || null;
        } catch (error) {
            logger.error(`Error getting customer by phone ${phoneNumber} from service`, error as Error);
            throw new ServiceException("Error getting customer by phone from service");
        }
    }

    // calculate customer spending (placeholder - would need order data)
    async getCustomerSpending(customerId: string): Promise<CustomerSpending> {
        try {
            // This would typically query order data
            // For now, returning placeholder data
            return {
                totalSpent: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                lastOrderDate: undefined
            };
        } catch (error) {
            logger.error(`Error getting customer spending for ${customerId} from service`, error as Error);
            throw new ServiceException("Error getting customer spending from service");
        }
    }

    // validate email format
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // validate email uniqueness
    private async validateEmailUniqueness(email: string, excludeCustomerId?: string): Promise<void> {
        const existingCustomer = await this.getCustomerByEmail(email);
        if (existingCustomer && existingCustomer.getCustomerId() !== excludeCustomerId) {
            throw new ServiceException("Email already exists");
        }
    }
}
