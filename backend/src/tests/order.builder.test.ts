/*
import { describe, it, expect, beforeEach } from '@jest/globals';
import { OrderBuilder } from '../builders/order.builder';
import { Order } from '../model/order.model';

describe('OrderBuilder', () => {
    let builder: OrderBuilder;
    const mockDate = new Date('2025-09-20');

    beforeEach(() => {
        builder = new OrderBuilder();
    });

    it('should build a valid order instance with all required fields', () => {
        const order = builder
            .setOrderId('ord-1')
            .setOrderNumber('ORD-2025-001')
            .setBusinessId('bus-1')
            .setCustomerId('cust-1')
            .setOrderStatus('pending')
            .setOrderSource('instagram')
            .setPaymentMethod('COD')
            .setSubtotalPrice(100)
            .setDiscount(10)
            .setShippingFee(5)
            .setTotalPrice(95)
            .setCreatedAt(mockDate)
            .build();

        expect(order).toBeInstanceOf(Order);
        expect(order.getOrderId()).toBe('ord-1');
        expect(order.getOrderNumber()).toBe('ORD-2025-001');
        expect(order.getBusinessId()).toBe('bus-1');
        expect(order.getCustomerId()).toBe('cust-1');
        expect(order.getOrderStatus()).toBe('pending');
        expect(order.getOrderSource()).toBe('instagram');
        expect(order.getPaymentMethod()).toBe('COD');
        expect(order.getSubtotalPrice()).toBe(100);
        expect(order.getDiscount()).toBe(10);
        expect(order.getShippingFee()).toBe(5);
        expect(order.getTotalPrice()).toBe(95);
        expect(order.getCreatedAt()).toBe(mockDate);
    });

    it('should throw error when required field is missing', () => {
        expect(() => {
            builder
                .setOrderId('ord-1')
                .setOrderNumber('ORD-2025-001')
                .setBusinessId('bus-1')
                // Missing customerId
                .setOrderStatus('pending')
                .setOrderSource('instagram')
                .setPaymentMethod('COD')
                .setSubtotalPrice(100)
                .setDiscount(10)
                .setShippingFee(5)
                .setTotalPrice(95)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow('Missing required property');
    });

    it('should validate price calculations', () => {
        expect(() => {
            builder
                .setOrderId('ord-1')
                .setOrderNumber('ORD-2025-001')
                .setBusinessId('bus-1')
                .setCustomerId('cust-1')
                .setOrderStatus('pending')
                .setOrderSource('instagram')
                .setPaymentMethod('COD')
                .setSubtotalPrice(100)
                .setDiscount(10)
                .setShippingFee(5)
                .setTotalPrice(100) // Incorrect total (should be 95)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();
    });

    it('should validate order status values', () => {
        expect(() => {
            builder
                .setOrderId('ord-1')
                .setOrderNumber('ORD-2025-001')
                .setBusinessId('bus-1')
                .setCustomerId('cust-1')
                .setOrderStatus('invalid-status') // Invalid status
                .setOrderSource('instagram')
                .setPaymentMethod('COD')
                .setSubtotalPrice(100)
                .setDiscount(10)
                .setShippingFee(5)
                .setTotalPrice(95)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();
    });

    it('should validate payment method values', () => {
        expect(() => {
            builder
                .setOrderId('ord-1')
                .setOrderNumber('ORD-2025-001')
                .setBusinessId('bus-1')
                .setCustomerId('cust-1')
                .setOrderStatus('pending')
                .setOrderSource('instagram')
                .setPaymentMethod('invalid-payment') // Invalid payment method
                .setSubtotalPrice(100)
                .setDiscount(10)
                .setShippingFee(5)
                .setTotalPrice(95)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();
    });
});
*/