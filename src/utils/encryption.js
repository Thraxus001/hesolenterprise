// src/utils/encryption.js

/**
 * Utility functions for basic hashing and encoding.
 * Note: For sensitive data like passwords, always rely on backend encryption.
 * This file uses the Web Crypto API standard.
 */

/**
 * Hash a string using SHA-256.
 * @param {string} message - The string to hash.
 * @returns {Promise<string>} - The hex representation of the hash.
 */
export async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Base64 encode a string (wrapper for btoa with utf-8 support).
 * @param {string} str 
 * @returns {string}
 */
export function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Base64 decode a string (wrapper for atob).
 * @param {string} str 
 * @returns {string}
 */
export function base64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
}

/**
 * Generate a random cryptographically secure token/nonce.
 * @param {number} length - Length of the token in bytes.
 * @returns {string} Hex string.
 */
export function generateRandomToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}
