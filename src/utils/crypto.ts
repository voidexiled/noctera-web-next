import crypto from "node:crypto";

const ALGORITHM = "aes-256-ccm";
const INPUT_ENCODING = "utf8";
const OUTPUT_ENCODING = "hex";
const IV_LENGTH = 16; // AES blocksize

/**
 *
 * @param text Value to be encrypted
 * @param key Key used to encrypt value must be 32 bytes for AES256 encryption algorithm
 *
 * @returns Encrypted value using key
 */
export const symmetricEncrypt = (text: string, key: string) => {
	const _key = Uint8Array.from(key);
	const iv = Uint8Array.from(crypto.randomBytes(IV_LENGTH));

	const cipher = crypto.createCipheriv("aes-256-ccm", _key, iv, { authTagLength: 16 });
	let ciphered = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING);
	ciphered += cipher.final(OUTPUT_ENCODING);
	const authTag = cipher.getAuthTag().toString(OUTPUT_ENCODING);
	const ciphertext = `${Buffer.from(iv).toString(OUTPUT_ENCODING)}:${authTag}:${ciphered}`;

	return ciphertext;
};

/**
 *
 * @param text Value to decrypt
 * @param key Key used to decrypt value must be 32 bytes for AES256 encryption algorithm
 */
export const symmetricDecrypt = (text: string, key: string) => {
	const _key = Uint8Array.from(key);

	const components = text.split(":");
	const iv_from_ciphertext = Uint8Array.from(
		Buffer.from(components.shift() || "", OUTPUT_ENCODING),
	);

	const decipher = crypto.createDecipheriv(ALGORITHM, _key, iv_from_ciphertext);
	let deciphered = decipher.update(components.join(":"), OUTPUT_ENCODING, INPUT_ENCODING);
	deciphered += decipher.final(INPUT_ENCODING);

	return deciphered;
};
