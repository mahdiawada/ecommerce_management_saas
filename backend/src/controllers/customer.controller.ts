import { NextFunction, Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { ApiException } from "../util/exceptions/ApiException";

export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    public async createCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body;
            if (!payload) {
                throw new Error("Customer payload is required");
            }
            const customerId = await this.customerService.createCustomer(payload);
            res.status(201).json({ customerId });
        } catch (error) {
            next(new ApiException(400, "Error creating customer", error as Error));
        }
    }

    public async getCustomerById(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }
            const customer = await this.customerService.getCustomerById(customerId);
            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error getting customer by id", error as Error));
        }
    }

    public async getAllCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json(customers);
        } catch (error) {
            next(new ApiException(400, "Error getting all customers", error as Error));
        }
    }

    public async getCustomersByBusiness(req: Request, res: Response, next: NextFunction) {
        try {
            const { businessId } = req.params;
            if (!businessId) {
                throw new Error("Business id is required");
            }
            const customers = await this.customerService.getCustomersByBusiness(businessId);
            res.status(200).json(customers);
        } catch (error) {
            next(new ApiException(400, "Error getting customers for business", error as Error));
        }
    }

    public async getCODRiskCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const { businessId } = req.params;
            if (!businessId) {
                throw new Error("Business id is required");
            }
            const customers = await this.customerService.getCODRiskCustomers(businessId);
            res.status(200).json(customers);
        } catch (error) {
            next(new ApiException(400, "Error getting COD risk customers", error as Error));
        }
    }

    public async searchCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const { businessId } = req.params;
            if (!businessId) {
                throw new Error("Business id is required");
            }

            const searchQuery = req.query.searchTerm ?? req.query.q;
            const searchTerm = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;

            if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim() === "") {
                throw new Error("Search term is required");
            }

            const customers = await this.customerService.searchCustomers(businessId, searchTerm);
            res.status(200).json(customers);
        } catch (error) {
            next(new ApiException(400, "Error searching customers", error as Error));
        }
    }

    public async updateCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }

            const payload = req.body;
            const customer = await this.customerService.updateCustomer(customerId, payload);
            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error updating customer", error as Error));
        }
    }

    public async deleteCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }

            await this.customerService.deleteCustomer(customerId);
            res.status(204).send();
        } catch (error) {
            next(new ApiException(400, "Error deleting customer", error as Error));
        }
    }

    public async flagCODRisk(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }

            const { reason } = req.body || {};
            const customer = await this.customerService.flagCODRisk(customerId, reason);
            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error flagging customer as COD risk", error as Error));
        }
    }

    public async removeCODRiskFlag(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }

            const customer = await this.customerService.removeCODRiskFlag(customerId);
            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error removing COD risk flag", error as Error));
        }
    }

    public async getCustomerByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const emailQuery = req.query.email;
            const email = Array.isArray(emailQuery) ? emailQuery[0] : emailQuery;

            if (!email || typeof email !== "string" || email.trim() === "") {
                throw new Error("Email is required");
            }

            const customer = await this.customerService.getCustomerByEmail(email);
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error getting customer by email", error as Error));
        }
    }

    public async getCustomerByPhone(req: Request, res: Response, next: NextFunction) {
        try {
            const phoneQuery = req.query.phoneNumber ?? req.query.phone;
            const phoneNumber = Array.isArray(phoneQuery) ? phoneQuery[0] : phoneQuery;

            if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim() === "") {
                throw new Error("Phone number is required");
            }

            const customer = await this.customerService.getCustomerByPhone(phoneNumber);
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            res.status(200).json(customer);
        } catch (error) {
            next(new ApiException(400, "Error getting customer by phone", error as Error));
        }
    }

    public async getCustomerSpending(req: Request, res: Response, next: NextFunction) {
        try {
            const { customerId } = req.params;
            if (!customerId) {
                throw new Error("Customer id is required");
            }

            const spending = await this.customerService.getCustomerSpending(customerId);
            res.status(200).json(spending);
        } catch (error) {
            next(new ApiException(400, "Error getting customer spending", error as Error));
        }
    }
}


