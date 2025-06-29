// src/utils/authUtils.ts
import CryptoJS from "crypto-js";

export const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY!;

// 🔒 Encrypt and save token
export function saveEncryptedToken(token: string) {
  const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  localStorage.setItem(TOKEN_KEY, encrypted);
}

// 🔓 Decrypt and return token
export function getDecryptedToken(): string | null {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// 🧹 Optional: remove token
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
