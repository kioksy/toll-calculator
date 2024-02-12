const { createHash, createCipheriv, createDecipheriv } = await import(
  'node:crypto'
);

/**
 * Create a hash string
 * @param {*} str
 * @returns
 */
const createDBHashString = (str) => {
  return createHash(process.env.HASHING_ALGO)
    .update(str + process.env.DB_SECRET)
    .digest('hex');
};

/**
 * Encrypt value
 * @param {*} value
 * @returns
 */
const encryptValue = (value, options = {}) => {
  const securitykey = Buffer.from(
    options.securitykey || process.env.ENCRYPT_SECURITY_STRING
  );
  const initVector = Buffer.from(
    options.initVector || process.env.ENCRYPT_INIT_VECTOR_STRING,
    'hex'
  );
  const cipher = createCipheriv(
    process.env.ENCRYPT_ALGO,
    securitykey,
    initVector
  );
  let encryptedData = cipher.update(value, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

/**
 * Decrypt value
 * @param {*} value
 * @returns
 */
const decryptValue = (value, options = {}) => {
  const securitykey = Buffer.from(
    options.securitykey || process.env.ENCRYPT_SECURITY_STRING
  );
  const initVector = Buffer.from(
    options.initVector || process.env.ENCRYPT_INIT_VECTOR_STRING,
    'hex'
  );
  const decipher = createDecipheriv(
    process.env.ENCRYPT_ALGO,
    securitykey,
    initVector
  );
  let decryptedData = decipher.update(value, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

export { createDBHashString, encryptValue, decryptValue };
