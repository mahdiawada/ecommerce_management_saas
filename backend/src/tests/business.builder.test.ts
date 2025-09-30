/*
import { describe, it, expect, beforeEach } from '@jest/globals';
import { BusinessBuilder } from '../builders/business.builder';
import { Business } from '../model/business.model';

describe('BusinessBuilder', () => {
    let builder: BusinessBuilder;
    const mockDate = new Date('2025-09-20');

    beforeEach(() => {
        builder = new BusinessBuilder();
    });

    it('should build a valid business instance with all required fields', () => {
        const business = builder
            .setBusinessId('test-id')
            .setBusinessName('Test Business')
            .setOwnerName('John Doe')
            .setEmail('john@test.com')
            .setPhoneNumber('+1234567890')
            .setPasswordHash('hashed_password')
            .setWhatsappApiKey('wa_key_123')
            .setCreatedAt(mockDate)
            .build();

        expect(business).toBeInstanceOf(Business);
        expect(business.getBusinessId()).toBe('test-id');
        expect(business.getBusinessName()).toBe('Test Business');
        expect(business.getOwnerName()).toBe('John Doe');
        expect(business.getEmail()).toBe('john@test.com');
        expect(business.getPhoneNumber()).toBe('+1234567890');
        expect(business.getPasswordHash()).toBe('hashed_password');
        expect(business.getWhatsappApiKey()).toBe('wa_key_123');
        expect(business.getCreatedAt()).toBe(mockDate);
    });

    it('should build a valid business instance with optional logo', () => {
        const business = builder
            .setBusinessId('test-id')
            .setBusinessName('Test Business')
            .setBusinessLogo('logo.png')
            .setOwnerName('John Doe')
            .setEmail('john@test.com')
            .setPhoneNumber('+1234567890')
            .setPasswordHash('hashed_password')
            .setWhatsappApiKey('wa_key_123')
            .setCreatedAt(mockDate)
            .build();

        expect(business).toBeInstanceOf(Business);
        expect(business.getBusinessLogo()).toBe('logo.png');
    });

    it('should throw error when required field is missing', () => {
        expect(() => {
            builder
                .setBusinessId('test-id')
                .setBusinessName('Test Business')
                // Missing ownerName
                .setEmail('john@test.com')
                .setPhoneNumber('+1234567890')
                .setPasswordHash('hashed_password')
                .setWhatsappApiKey('wa_key_123')
                .setCreatedAt(mockDate)
                .build();
        }).toThrow('Missing required property');
    });

    it('should allow chaining of setter methods', () => {
        expect(() => {
            builder
                .setBusinessId('test-id')
                .setBusinessName('Test Business')
                .setOwnerName('John Doe')
                .setEmail('john@test.com');
        }).not.toThrow();
    });


});
*/