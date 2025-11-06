// src/data/discountService.js

import moment from 'moment';

// DOMAIN 1: Dành cho Coupons (Đã xác nhận từ history)
const COUPONS_API_BASE_URL = "https://690aba261a446bb9cc239656.mockapi.io/api/v1";

// DOMAIN 2: Dành cho Shipping Discounts (Đã xác nhận từ URL của bạn)
const SHIPPING_API_BASE_URL = "https://690ac3221a446bb9cc23bde9.mockapi.io";

// ======================================================================
// HÀM CHUẨN HÓA DỮ LIỆU
// ======================================================================

const normalizeCouponData = (coupon) => {
    return {
        ...coupon,
        key: coupon.id, 
        expireDate: coupon.expireDate ? moment(coupon.expireDate).format('YYYY-MM-DD') : 'N/A',
        value: coupon.value || 'N/A', 
        limit: parseInt(coupon.limit) || 0, 
        used: parseInt(coupon.used) || 0, 
    };
};

const normalizeShippingRuleData = (rule) => {
    return {
        ...rule,
        key: rule.id,
        minOrderValueDisplay: rule.minOrderValue ? parseInt(rule.minOrderValue).toLocaleString('vi-VN') + 'đ' : '0đ'
    };
};


// ======================================================================
// 1. QUẢN LÝ MÃ GIẢM GIÁ (COUPONS) - DOMAIN 1
// ======================================================================

// -------------------- READ --------------------
export const fetchCoupons = async () => {
    try {
        const response = await fetch(`${COUPONS_API_BASE_URL}/coupons`);
        if (!response.ok) {
            console.error(`Coupons Fetch Failed: Status ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(normalizeCouponData);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return []; 
    }
};

// -------------------- CREATE --------------------
export const createCoupon = async (couponData) => {
    try {
        const response = await fetch(`${COUPONS_API_BASE_URL}/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(couponData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newCoupon = await response.json();
        return normalizeCouponData(newCoupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        throw error;
    }
};

// -------------------- UPDATE --------------------
export const updateCoupon = async (id, updates) => {
    try {
        const response = await fetch(`${COUPONS_API_BASE_URL}/coupons/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedCoupon = await response.json();
        return normalizeCouponData(updatedCoupon);
    } catch (error) {
        console.error(`Error updating coupon ${id}:`, error);
        throw error;
    }
};

// -------------------- DELETE --------------------
export const deleteCoupon = async (id) => {
    try {
        const response = await fetch(`${COUPONS_API_BASE_URL}/coupons/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error deleting coupon ${id}:`, error);
        throw error;
    }
};


// ======================================================================
// 2. QUẢN LÝ GIẢM GIÁ PHÍ VẬN CHUYỂN (SHIPPING RULES) - DOMAIN 2
// ======================================================================

// -------------------- READ --------------------
export const fetchShippingRules = async () => {
    try {
        // Sử dụng dấu "/" ở cuối để khắc phục lỗi "Not Found" thường gặp trên MockAPI
        const response = await fetch(`${SHIPPING_API_BASE_URL}/shippingDiscounts/`); 
        
        if (!response.ok) {
            console.error(`Shipping Fetch Failed: Status ${response.status}. Kiểm tra MockAPI ID và cấu trúc URL.`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.map(normalizeShippingRuleData);
    } catch (error) {
        console.error("Error fetching shipping rules:", error);
        return []; 
    }
};

// -------------------- CREATE --------------------
export const createShippingRule = async (ruleData) => {
    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/shippingDiscounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ruleData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newRule = await response.json();
        return normalizeShippingRuleData(newRule);
    } catch (error) {
        console.error("Error creating shipping rule:", error);
        throw error;
    }
};

// -------------------- UPDATE (Placeholder) --------------------
export const updateShippingRule = async (id, updates) => {
    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/shippingDiscounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedRule = await response.json();
        return normalizeShippingRuleData(updatedRule);
    } catch (error) {
        console.error(`Error updating shipping rule ${id}:`, error);
        throw error;
    }
};

// -------------------- DELETE (Placeholder) --------------------
export const deleteShippingRule = async (id) => {
    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/shippingDiscounts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error deleting shipping rule ${id}:`, error);
        throw error;
    }
};