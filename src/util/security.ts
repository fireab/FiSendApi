import bcrypt from "bcryptjs";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Hash text using bcrypt
export const hash = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(text, salt);
};

// Compare plain text with hash
export const compareHash = async (
  text: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(text, hash);
};

// Get the key and IV from environment variables
const key = Buffer.from(process.env.ENCRYPTION_KEY as string, "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV as string, "hex");

// Ensure key and IV exist and are of the correct length
if (key.length !== 32 || iv.length !== 16) {
  throw new Error(
    "Invalid key or IV length. AES-256 requires a 32-byte key and a 16-byte IV."
  );
}

// Encrypt data using AES-256-GCM
export const encryptData = (plainText: string) => {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag(); // Get the authentication tag

  return {
    // iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag.toString("hex"),
  };
};

// Decrypt data using AES-256-GCM
export const decryptData = (encryptedData: string, authTag: string) => {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString("hex"); // 64-character hex string
};

/**
 * Generate JWT Access Token
 *
 */
export const generateAccessToken = (
  payload: object,
  securityKey: string,
  expiresIn: string
): string => {
  return jsonwebtoken.sign(payload, securityKey, {
    expiresIn: expiresIn,
  });
};
