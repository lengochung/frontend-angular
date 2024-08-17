import * as CryptoJS from 'crypto-js';
import { BufferList } from 'bl';
import Constants from './constants';
export class CryptLib {
	private static readonly _maxKeySize = 32;
	private static readonly _maxIVSize = 16;
	private static readonly _characterMatrixForRandomIVStringGeneration = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
		'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
		'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_',
	];
	/**
   * private function: _encryptDecrypt
   * encryptes or decrypts to or from text or encrypted text given an iv and key
   * @param  {string}  text        can be plain text or encrypted text
   * @param  {string}  key         the key used to encrypt or decrypt
   * @param  {string}  initVector  the initialization vector to encrypt or decrypt
   * @param  {bool}    isEncrypt   true = encryption, false = decryption
   * @return {string}              encryted text or plain text
   */
	private static _encryptDecrypt(text?: string, key?: string, initVector?: string, isEncrypt?: boolean): string {
		try {
			const ivBl = new BufferList();
			const keyBl = new BufferList();
			if (!key) {
				key = Constants.ENCRYPT.PUBLIC_KEY;
			}
			if (!initVector) {
				initVector = Constants.ENCRYPT.INIT_VECTOR;
			}
			let ivCharArray: Array<string> = [];
			if (initVector && initVector.length > 0) {
				ivCharArray = initVector.split('');
			}
			if (Array.isArray(ivCharArray) && ivCharArray.length > 0) {
				for (let i = 0; i < this._maxIVSize; i++) {
					ivBl.append(ivCharArray.shift()!);
				}
			}
			const keyCharArray = key.split('');
			if (Array.isArray(keyCharArray) && keyCharArray.length > 0) {
				for (let i = 0; i < this._maxKeySize; i++) {
					keyBl.append(keyCharArray.shift()!);
				}
			}
			if (isEncrypt) {
				const encrypted = CryptoJS.AES.encrypt(text || "", CryptoJS.enc.Utf8.parse(keyBl.toString()), {
					keySize: this._maxIVSize,
					iv: CryptoJS.enc.Utf8.parse(ivBl.toString()),
					mode: CryptoJS.mode.CBC
				});
				return encrypted.toString();
			}
			const decrypted = CryptoJS.AES.decrypt(text || "", CryptoJS.enc.Utf8.parse(keyBl.toString()), {
				keySize: this._maxIVSize,
				iv: CryptoJS.enc.Utf8.parse(ivBl.toString()),
				mode: CryptoJS.mode.CBC,
			}).toString(CryptoJS.enc.Utf8);
			return decrypted;
		} catch (error) {
			return "";
		}
	}
	/**
   * encryptes plain text given a key and initialization vector
   * @param  {string}  plainText        can be plain text or encrypted text
   * @param  {string}  key         the key used to encrypt or decrypt
   * @param  {string}  initVector  the initialization vector to encrypt or decrypt
   * @return {string}              encryted text or plain text
   */
	public static encrypt(plainText?: string, key?: string, initVector?: string) {
		return this._encryptDecrypt(plainText, key, initVector, true);
	}

	/**
	 * decrypts encrypted text given a key and initialization vector
	 * @param  {string}  encryptedText        can be plain text or encrypted text
	 * @param  {string}  key         the key used to encrypt or decrypt
	 * @param  {string}  initVector  the initialization vector to encrypt or
	 *                               decrypt
	 * @return {string}              encryted text or plain text
	 */
	public static decrypt(encryptedText?: string, key?: string, initVector?: string) {
		return this._encryptDecrypt(encryptedText, key, initVector, false);
	}
	/**
	 * private function: _isCorrectLength
	 * checks if length is preset and is a whole number and > 0
	 * @param  {number}  length num
	 * @return {bool} boolean
	 */
	private static _isCorrectLength(length?: number) {
		return length && /^\d+$/.test(length.toString()) && parseInt(length.toString(), 10) !== 0;
	}
	/**
   * generates random initaliztion vector given a length
   * @param  {int}  length  the length of the iv to be generated
   * @returns {string} string
   */
	public static generateRandomIV(length = 16) {
		if (!this._isCorrectLength(length)) {
			return "";
		}
		const randomBytes = CryptoJS.lib.WordArray.random(length);
		// convert WordArray to Uint8Array
		const uint8Array = new Uint8Array(randomBytes.sigBytes);
		for (let i = 0; i < randomBytes.sigBytes; i++) {
			uint8Array[i] = (randomBytes.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		}
		const _iv = [];
		for (let i = 0; i < length; i++) {
			const ptr = uint8Array[i] % this._characterMatrixForRandomIVStringGeneration.length;
			_iv[i] = this._characterMatrixForRandomIVStringGeneration[ptr];
		}
		return _iv.join('');
	}
	/**
   * Generate CryptoJS key
   * @param  {string}  password  Get the password and salt from somewhere, such as from the user or configuration
   * @returns {string} string
   */
	public static generateKey(password?: string) {
		if (!password) {
			return "";
		}
		// Length of the key (in bytes)
		const keySize = 8;
		const salt = CryptoJS.lib.WordArray.random(keySize);
		// Number of iterations to derive the key
		const iterations = 1000;
		// Derive a key from the password and salt using PBKDF2
		const key = CryptoJS.PBKDF2(password, salt, { keySize: keySize, iterations: iterations });
		return key.toString();
	}
	/**
	 * get md5 string
	 * @param {string} text  	string
	 * @returns {string} 		md5 string
	 */
	public static md5(text?: string): string {
		if (!text) {
			return "";
		}
		return CryptoJS.MD5(text).toString().toUpperCase();
	}
}
