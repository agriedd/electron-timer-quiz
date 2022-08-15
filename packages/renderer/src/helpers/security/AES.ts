
import * as CryptoJS from 'crypto-js'

export const encryptAES = (str: string): string => {
	const passphrase = 'Edd';
	return CryptoJS.AES.encrypt(str, passphrase).toString();
}

export const decryptWithAES = (ciphertext: string) => {
	const passphrase = 'Edd';
	const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
};