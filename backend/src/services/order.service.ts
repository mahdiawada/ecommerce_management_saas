import { OrderBuilder } from "../builders/order.builder";
import { OrderItemsBuilder } from "../builders/orderItems.builder";
import { OrderRepository } from "../repository/Postgres/order.repository";
import { OrderItemsRepository } from "../repository/Postgres/orderItems.repository";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/serviceException";
import logger from "../util/logger";
import { Order } from "../model/order.model";
import { OrderItems } from "../model/orderItems.model";
import { Product } from "../model/product.model";
import { ProductRepository } from "../repository/Postgres/product.repository";
import { NotFoundException } from "../util/exceptions/repositoryException";

export type CreateOrderItemInput = {
	productId: string;
	quantity: number;
	productSizeId?: string;
};

export type CreateOrderInput = {
	businessId: string;
	customerId: string;
	orderSource: string; // Shopify/Instagram/Whatsapp/etc
	paymentMethod: string; // COD/Prepaid etc
	items: CreateOrderItemInput[];
	promoCodeId?: string;
};

export type UpdateOrderInput = {
	orderStatus?: string;
	orderSource?: string;
	paymentMethod?: string;
	promoCodeId?: string | null;
};

export type OrderTotals = {
	subtotal: number;
	discount: number;
	total: number;
};

export class OrderService {
	private orderRepo: OrderRepository;
	private orderItemsRepo: OrderItemsRepository;
 	private productRepo: ProductRepository;

	constructor(orderRepo?: OrderRepository, orderItemsRepo?: OrderItemsRepository, productRepo?: ProductRepository) {
		this.orderRepo = orderRepo || new OrderRepository();
		this.orderItemsRepo = orderItemsRepo || new OrderItemsRepository();
		this.productRepo = productRepo || new ProductRepository();
	}

	// create order with items
	async createOrder(input: CreateOrderInput): Promise<string> {
		try {
			const { businessId, customerId, orderSource, paymentMethod, items, promoCodeId } = input;
			if (!businessId || !customerId) throw new ServiceException("Business and customer are required");
			if (!items || items.length === 0) throw new ServiceException("At least one item is required");


			const productsById = new Map<string, Product>();
			for (const it of items) {
				if (!it.productId) throw new ServiceException("Item productId is required");
				if (it.quantity <= 0) throw new ServiceException("Item quantity must be > 0");
				try {
					if (!productsById.has(it.productId)) {
						const product = await this.productRepo.get(it.productId);
						productsById.set(it.productId, product);
					}
				} catch (error) {
					if (error instanceof NotFoundException) {
						throw new ServiceException(`Product not found: ${it.productId}`);
					}
					logger.error(`Error fetching product ${it.productId} for order creation`, error as Error);
					throw new ServiceException("Failed to fetch product for order creation");
				}
			}

			const totals = this.calculateTotals(items, productsById);
			const orderId = generateUUID("order");
			const orderNumber = await this.generateOrderNumber();
			const order = new OrderBuilder()
				.setOrderId(orderId)
				.setOrderNumber(orderNumber)
				.setBusinessId(businessId)
				.setCustomerId(customerId)
				.setOrderStatus("Pending")
				.setOrderSource(orderSource)
				.setPaymentMethod(paymentMethod)
				.setTotalPrice(totals.total)
				.setPromoCodeId(promoCodeId)
				.setCreatedAt(new Date())
				.build();

			await this.orderRepo.create(order);

			for (const it of items) {
				const orderItem = new OrderItemsBuilder()
					.setOrderItemId(generateUUID("oitem"))
					.setOrderId(orderId)
					.setProductId(it.productId)
					.setProductSizeId(it.productSizeId)
					.setQuantity(it.quantity)
					.build();
				await this.orderItemsRepo.create(orderItem);
			}

			logger.info(`Order created ${orderId} with ${items.length} items`);
			return orderId;
		} catch (error) {
			logger.error("Error creating order from service", error as Error);
			throw new ServiceException("Error creating order from service");
		}
	}

	// get order by id
	async getOrderById(orderId: string): Promise<Order> {
		try {
			const order = await this.orderRepo.get(orderId);
			return order;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new ServiceException(`Order not found: ${orderId}`);
			}
			logger.error(`Error getting order ${orderId} from service`, error as Error);
			throw new ServiceException("Error getting order from service");
		}
	}

	// list all orders
	async getAllOrders(): Promise<Order[]> {
		try {
			return await this.orderRepo.getAll();
		} catch (error) {
			logger.error("Error getting all orders from service", error as Error);
			throw new ServiceException("Error getting all orders from service");
		}
	}

	// update order
	async updateOrder(orderId: string, input: UpdateOrderInput): Promise<Order> {
		try {
			const current = await this.orderRepo.get(orderId);
			const updated = new OrderBuilder()
				.setOrderId(orderId)
				.setOrderNumber(current.getOrderNumber())
				.setBusinessId(current.getBusinessId())
				.setCustomerId(current.getCustomerId())
				.setOrderStatus(input.orderStatus ?? current.getOrderStatus())
				.setOrderSource(input.orderSource ?? current.getOrderSource())
				.setPaymentMethod(input.paymentMethod ?? current.getPaymentMethod())
				.setTotalPrice(current.getTotalPrice())
				.setPromoCodeId(input.promoCodeId === undefined ? current.getPromoCodeId() : input.promoCodeId || undefined)
				.setCreatedAt(current.getCreatedAt())
				.build();
			await this.orderRepo.update(updated);
			return updated;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new ServiceException(`Order not found: ${orderId}`);
			}
			logger.error(`Error updating order ${orderId} from service`, error as Error);
			throw new ServiceException("Error updating order from service");
		}
	}

	// delete order
	async deleteOrder(orderId: string): Promise<void> {
		try {
			await this.orderRepo.delete(orderId);
			logger.info(`Order deleted ${orderId}`);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new ServiceException(`Order not found: ${orderId}`);
			}
			logger.error(`Error deleting order ${orderId} from service`, error as Error);
			throw new ServiceException("Error deleting order from service");
		}
	}

	// items: list by order
	async getOrderItems(orderId: string): Promise<OrderItems[]> {
		try {
			const all = await this.orderItemsRepo.getAll();
			return all.filter(i => i.getOrderId() === orderId);
		} catch (error) {
			logger.error(`Error getting items for order ${orderId} from service`, error as Error);
			throw new ServiceException("Error getting order items from service");
		}
	}

	// items: add an item and update total
	async addItem(orderId: string, item: CreateOrderItemInput): Promise<void> {
		try {
			await this.orderRepo.get(orderId); // ensure exists
			if (!item.productId) throw new ServiceException("Item productId is required");
			if (item.quantity <= 0) throw new ServiceException("Item quantity must be > 0");
			try {
				await this.productRepo.get(item.productId);
			} catch (error) {
				if (error instanceof NotFoundException) {
					throw new ServiceException(`Product not found: ${item.productId}`);
				}
				logger.error(`Error fetching product ${item.productId} for addItem`, error as Error);
				throw new ServiceException("Failed to fetch product for order item");
			}
			const orderItem = new OrderItemsBuilder()
				.setOrderItemId(generateUUID("oitem"))
				.setOrderId(orderId)
				.setProductId(item.productId)
				.setProductSizeId(item.productSizeId)
				.setQuantity(item.quantity)
				.build();
			await this.orderItemsRepo.create(orderItem);

			await this.recalculateTotals(orderId);
		} catch (error) {
			logger.error(`Error adding item to order ${orderId} from service`, error as Error);
			throw new ServiceException("Error adding item to order from service");
		}
	}

	// items: remove and update total
	async removeItem(orderItemId: string): Promise<void> {
		try {
			const item = await this.orderItemsRepo.get(orderItemId);
			await this.orderItemsRepo.delete(orderItemId);
			await this.recalculateTotals(item.getOrderId());
		} catch (error) {
			logger.error(`Error removing order item ${orderItemId} from service`, error as Error);
			throw new ServiceException("Error removing order item from service");
		}
	}

	// totals calculation helpers
	private calculateTotals(items: CreateOrderItemInput[], productsById: Map<string, Product>): OrderTotals {
		const subtotal = items.reduce((sum, it) => {
			const product = productsById.get(it.productId);
			if (!product) {
				throw new ServiceException(`Product not loaded: ${it.productId}`);
			}
			return sum + product.getSellPrice() * it.quantity;
		}, 0);
		const discount = 0; // integrate promo code later
		const total = subtotal - discount;
		return { subtotal, discount, total };
	}

	private async recalculateTotals(orderId: string): Promise<void> {
		const order = await this.orderRepo.get(orderId);
		const items = await this.getOrderItems(orderId);
		let subtotal = 0;
		for (const item of items) {
			try {
				const product = await this.productRepo.get(item.getProductId());
				subtotal += product.getSellPrice() * item.getQuantity();
			} catch (error) {
				if (error instanceof NotFoundException) {
					throw new ServiceException(`Product not found: ${item.getProductId()}`);
				}
				logger.error(`Error fetching product ${item.getProductId()} for recalculateTotals`, error as Error);
				throw new ServiceException("Failed to fetch product for recalculating totals");
			}
		}
		const discount = 0; // integrate promo code later
		const total = subtotal - discount;
		await this.orderRepo.update(
			new OrderBuilder()
				.setOrderId(order.getOrderId())
				.setOrderNumber(order.getOrderNumber())
				.setBusinessId(order.getBusinessId())
				.setCustomerId(order.getCustomerId())
				.setOrderStatus(order.getOrderStatus())
				.setOrderSource(order.getOrderSource())
				.setPaymentMethod(order.getPaymentMethod())
				.setTotalPrice(total)
				.setPromoCodeId(order.getPromoCodeId())
				.setCreatedAt(order.getCreatedAt())
				.build()
		);
	}

	private async generateOrderNumber(): Promise<string> {
		return `ORD-${Date.now()}`;
	}
}
