import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Formats a price in Indian currency format
 * @param price The price to format
 * @param currency The currency symbol (default: ₹)
 * @returns Formatted price string
 */
export function formatPrice(price, currency = '₹') {
    if (price >= 10000000) {
        return `${currency}${(price / 10000000).toFixed(1)} Cr`;
    }
    else if (price >= 100000) {
        return `${currency}${(price / 100000).toFixed(1)} L`;
    }
    else if (price >= 1000) {
        return `${currency}${(price / 1000).toFixed(1)} K`;
    }
    return `${currency}${price.toLocaleString('en-IN')}`;
}
/**
 * Formats area in square feet with appropriate units
 * @param area Area in square feet
 * @returns Formatted area string
 */
export function formatArea(area) {
    if (area >= 43560) {
        return `${(area / 43560).toFixed(2)} acres`;
    }
    else if (area >= 1000) {
        return `${(area / 1000).toFixed(1)}K sq ft`;
    }
    return `${area.toLocaleString('en-IN')} sq ft`;
}
/**
 * Validates Indian phone number format
 * @param phoneNumber The phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
}
/**
 * Validates Indian pincode format
 * @param pincode The pincode to validate
 * @returns Boolean indicating if pincode is valid
 */
export function validatePincode(pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
}
/**
 * Capitalizes the first letter of each word
 * @param text The text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
}
/**
 * Generates a slug from a title
 * @param title The title to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
/**
 * Calculates EMI for a loan
 * @param principal Loan amount
 * @param rate Annual interest rate (in percentage)
 * @param tenure Loan tenure in years
 * @returns Monthly EMI amount
 */
export function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / (12 * 100);
    const numberOfPayments = tenure * 12;
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Math.round(emi);
}
