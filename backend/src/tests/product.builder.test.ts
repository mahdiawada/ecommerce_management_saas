/*
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ProductBuilder } from '../builders/product.builder';
import { Product } from '../model/product.model';

describe('ProductBuilder', () => {
    let builder: ProductBuilder;
    const mockDate = new Date('2025-09-20');

    beforeEach(() => {
        builder = new ProductBuilder();
    });

    it('should build a valid product instance with all required fields', () => {
        const product = builder
            .setProductId('prod-1')
            .setBusinessId('bus-1')
            .setInventoryId('inv-1')
            .setCategoryId('cat-1')
            .setName('Test Product')
            .setDescription('Test Description')
            .setQuantityInStock(100)
            .setMinimumStockLevel(10)
            .setCostPrice(50)
            .setSellPrice(100)
            .setCreatedAt(mockDate)
            .build();

        expect(product).toBeInstanceOf(Product);
        expect(product.getProductId()).toBe('prod-1');
        expect(product.getBusinessId()).toBe('bus-1');
        expect(product.getInventoryId()).toBe('inv-1');
        expect(product.getCategoryId()).toBe('cat-1');
        expect(product.getName()).toBe('Test Product');
        expect(product.getDescription()).toBe('Test Description');
        expect(product.getQuantityInStock()).toBe(100);
        expect(product.getMinimumStockLevel()).toBe(10);
        expect(product.getCostPrice()).toBe(50);
        expect(product.getSellPrice()).toBe(100);
        expect(product.getCreatedAt()).toBe(mockDate);
    });

    it('should build a valid product instance with optional fields', () => {
        const product = builder
            .setProductId('prod-1')
            .setBusinessId('bus-1')
            .setInventoryId('inv-1')
            .setCategoryId('cat-1')
            .setName('Test Product')
            .setDescription('Test Description')
            .setPhoto('product.jpg')
            .setSize('Large')
            .setQuantityInStock(100)
            .setMinimumStockLevel(10)
            .setExpiryDate(mockDate)
            .setCostPrice(50)
            .setSellPrice(100)
            .setCreatedAt(mockDate)
            .build();

        expect(product.getPhoto()).toBe('product.jpg');
        expect(product.getSizeOrType()).toBe('Large');
        expect(product.getExpiryDate()).toBe(mockDate);
    });

    it('should throw error when required field is missing', () => {
        expect(() => {
            builder
                .setProductId('prod-1')
                .setBusinessId('bus-1')
                .setInventoryId('inv-1')
                // Missing categoryId
                .setName('Test Product')
                .setDescription('Test Description')
                .setQuantityInStock(100)
                .setMinimumStockLevel(10)
                .setCostPrice(50)
                .setSellPrice(100)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow('Missing required property');
    });

    it('should validate numeric fields', () => {
        expect(() => {
            builder
                .setProductId('prod-1')
                .setBusinessId('bus-1')
                .setInventoryId('inv-1')
                .setCategoryId('cat-1')
                .setName('Test Product')
                .setDescription('Test Description')
                .setQuantityInStock(-1) // Invalid quantity
                .setMinimumStockLevel(10)
                .setCostPrice(50)
                .setSellPrice(100)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();

        expect(() => {
            builder
                .setProductId('prod-1')
                .setBusinessId('bus-1')
                .setInventoryId('inv-1')
                .setCategoryId('cat-1')
                .setName('Test Product')
                .setDescription('Test Description')
                .setQuantityInStock(100)
                .setMinimumStockLevel(10)
                .setCostPrice(-50) // Invalid cost price
                .setSellPrice(100)
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();
    });

    it('should validate that sell price is greater than cost price', () => {
        expect(() => {
            builder
                .setProductId('prod-1')
                .setBusinessId('bus-1')
                .setInventoryId('inv-1')
                .setCategoryId('cat-1')
                .setName('Test Product')
                .setDescription('Test Description')
                .setQuantityInStock(100)
                .setMinimumStockLevel(10)
                .setCostPrice(100)
                .setSellPrice(50) // Sell price less than cost price
                .setCreatedAt(mockDate)
                .build();
        }).toThrow();
    });
});
*/