import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { CustomerService } from "../services/customer.service";
import { CustomerRepository } from "../repository/Postgres/customer.repository";

const customerController = new CustomerController(new CustomerService(new CustomerRepository()));
const route = Router();

route.post('/', customerController.createCustomer.bind(customerController));
route.get('/', customerController.getAllCustomers.bind(customerController));

route.get('/business/:businessId', customerController.getCustomersByBusiness.bind(customerController));
route.get('/business/:businessId/cod-risk', customerController.getCODRiskCustomers.bind(customerController));
route.get('/business/:businessId/search', customerController.searchCustomers.bind(customerController));

route.post('/:customerId/cod-risk/flag', customerController.flagCODRisk.bind(customerController));
route.post('/:customerId/cod-risk/remove', customerController.removeCODRiskFlag.bind(customerController));

route.get('/lookup/email', customerController.getCustomerByEmail.bind(customerController));
route.get('/lookup/phone', customerController.getCustomerByPhone.bind(customerController));

route.get('/:customerId/spending', customerController.getCustomerSpending.bind(customerController));
route.get('/:customerId', customerController.getCustomerById.bind(customerController));
route.put('/:customerId', customerController.updateCustomer.bind(customerController));
route.delete('/:customerId', customerController.deleteCustomer.bind(customerController));

export default route;


