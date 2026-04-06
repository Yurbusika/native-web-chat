import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { KEY_HEX_LENGTH, SALT_HEX_LENGTH, HEX } from '../constants/pass-consts.js';

const scryptAsync = promisify(crypto.scrypt);
const SCRYPT_KEY_BYTES = KEY_HEX_LENGTH / 2;

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(SALT_HEX_LENGTH / 2).toString('hex');
  const derivedKey = await scryptAsync(password, salt, SCRYPT_KEY_BYTES);
  return `${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password, hashedPassword) => {
  if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }
  const sep = hashedPassword.indexOf(':');
  if (sep <= 0 || sep === hashedPassword.length - 1) {
    return false;
  }
  const salt = hashedPassword.slice(0, sep);
  const keyHex = hashedPassword.slice(sep + 1);
  if (
    salt.length !== SALT_HEX_LENGTH ||
    keyHex.length !== KEY_HEX_LENGTH ||
    !HEX.test(salt) ||
    !HEX.test(keyHex)
  ) {
    return false;
  }

  const storedKey = Buffer.from(keyHex, 'hex');
  if (storedKey.length !== SCRYPT_KEY_BYTES) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, SCRYPT_KEY_BYTES);
  return crypto.timingSafeEqual(derivedKey, storedKey);
};
