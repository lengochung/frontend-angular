import { Injectable } from '@angular/core';
import moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { JsonResultEntity, UserEntity } from '../core/entities';
import Constants from './constants';
import { CryptLib } from './CryptLib';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export default class Lib {
    private static _dateFormat = "YYYY/MM/DD";
    private static _appConfig: { [key: string]: string } = {};
    /**
     * JSON structure to map with results responded from API
     *
     * @param {boolean} status success/fail
     * @param {string | object} msg message / validation messages
     * @param {T} data data
     * @param {number} total_row totalRow
     * @returns {object} JSON object
     */
    static returnJsonResult<T>(
        status?: boolean,
        msg?: string | { [key: string]: any },
        data?: T | null,
        total_row?: number,
    ): JsonResultEntity<T> {
        const result = new JsonResultEntity<T>();
        result.status = status ? status : false;
        result.msg = msg ? msg : '';
        result.data = data ? data : null;
        result.total_row = total_row ? total_row : 0;
        return result;
    }
    /**
     * @description
     * Json structure to map with results socket
     *
     * @param {string} message_type --
     * @param {object} data --
     * @returns {string} json string
     */
    static returnSocketJsonResult<T>(
        message_type?: string | null,
        data?: T | null,
    ): string {
        return JSON.stringify({
            message_type: (message_type ? message_type : ''),
            data: (data ? data : null)
        });
    }
    /**
     * Check if a string is blank or null
     *
     * @param {string | number | null | undefined} str a string
     * @returns {boolean} blank or not
     */
    static isBlank(str: any): boolean {
        if (
            typeof str === 'undefined'
            || str == null
            || (typeof str === 'string' && str.toString().trim() === '')
        ) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the provided object is null.
     *
     * @param {any} obj     The object to be checked.
     * @returns {boolean}   A boolean indicating whether the object is null
     */
    static isNull(obj: any): boolean {
        if (typeof obj === 'undefined' || obj == null) {
            return true;
        }
        return false;
    }
    /**
     * Checks if a given value is an object and not empty
     *
     * @param {object} obj      The value to check if it's an object
     * @returns {boolean}       A boolean indicating whether the value is a non-empty object
     */
    static isObject(obj = {}): boolean {
        return !this.isBlank(obj) && typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length > 0;
    }
    /**
     * Get the number of properties in an object
     * @param {any} obj An object
     * @returns {number} Property count
     */
    static getObjectSize(obj: object): number {
        if (!this.isObject(obj)) {
            return 0;
        }
        return Object.keys(obj).length;
    }
    /**
     * Checks if a given value is a valid number
     *
     * @param {string | number} value    The value to check if it's a string or number
     * @return {boolean}    A boolean indicating whether the value is a number
     */
    static isNumber(value: string | number): boolean {
        if (!value) {
            return false;
        }
        return !isNaN(Number(value)) && !isNaN(parseFloat(String(value)));
    }
    /**
     * URL encode a string
     *
     * @param {string} str a string
     * @return {string} url encoded string
     */
    static encodeURL(str: string): string {
        let encodeString = encodeURI(str);
        encodeString = encodeString.replace('!', '%21');
        encodeString = encodeString.replace('#', '%23');
        encodeString = encodeString.replace('$', '%24');
        encodeString = encodeString.replace(/&/g, '%26');
        encodeString = encodeString.replace('(', '%28');
        encodeString = encodeString.replace(')', '%29');
        encodeString = encodeString.replace('?', '%3F');
        encodeString = encodeString.replace('?', '%3F');
        encodeString = encodeString.replace(/\+/g, '%2B');
        encodeString = encodeString.replace(/\\"/g, '%22');
        encodeString = encodeString.replace(/\\'/g, '%27');
        return encodeString;
    }

    /**
     * get value of a key in an object
     *
     * @param {T} obj ex: {key1: "value 1", key2: "value 2"}
     * @param {K} key key name
     * @returns {any} value of a key
     */
    static prop<T, K extends keyof T>(obj: T, key: K): unknown {
        return obj[key] ? obj[key] : null;
    }

    /**
     * Get object in array by key
     *
     * @param {Array} arr
     * ex: [
     *  {id: 1, text: '1'}
     *  {id: 2, text: '2'}
     * ]
     * @param {string} key Key of an object in the array
     * @param {string} keyCompare Value used to compare keys in array
     * @returns {Object | null} an object
     */
    static getObjInArrayByKey(
        arr: Array<any>,
        key: string,
        keyCompare: string
    ): { [key: string]: any } | null {
        if (!this.isValidArrayData(arr) || this.isBlank(key)) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const result = arr.filter((x) => x[key] === keyCompare);
        if (this.isValidArrayData(result)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result[0];
        }
        return null;
    }

    /**
     * Checks if the provided input is a valid non-empty array.
     *
     * @param {Array} arr   The array to be check
     * @returns {boolean}   A boolean indicating whether the input is a valid non-empty array
     */
    static isValidArrayData(arr?: Array<any>): boolean {
        if (!arr || !Array.isArray(arr) || arr.length <= 0) return false;
        return true;
    }
    /**
     * get search params from url
     *
     * @param {string} key     param name
     * @return {string}        param value
     */
    static getSearchParams(key: string): string {
        if (!key) {
            return "";
        }
        const params = new URLSearchParams(document.location.search);
        const paramValue = params.get(key);
        if (!paramValue) {
            return "";
        }
        return paramValue;
    }
    /**
     * Insert param to url
     *
     * @param {string} key  param key
     * @param {string} value  param value
     * @returns {void}
     */
    static insertParamToUrl(key: string, value: string | number): void {
        if (!history.pushState) {
            return;
        }
        //remove any param for the same key
        const currentUrl = this.removeParamFromUrl(window.location.href, key);
        //figure out if we need to add the param with a ? or a &
        let queryStart = "?";
        if (currentUrl.indexOf('?') !== -1) {
            queryStart = '&';
        }
        const newurl = `${currentUrl}${queryStart}${key}=${value}`;
        window.history.pushState({ path: newurl }, '', newurl);
    }
    /**
     * Remove param url
     *
     * @param {string} url      full url
     * @param {string} key      param name
     *
     * @returns {string}        url
     */
    static removeParamFromUrl(url: string, key: string): string {
        if (!url || !key) {
            return "";
        }
        //better to use l.search if you have a location/link object
        const urlparts = url.split('?');
        if (urlparts.length >= 2) {
            const prefix = `${encodeURIComponent(key)}=`;
            const pars = urlparts[1].split(/[&;]/g);
            //reverse iteration as may be destructive
            for (let i = pars.length; i-- > 0;) {
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }
            let params = "";
            if (pars && pars.length > 0) {
                params = `?${pars.join('&')}`;
            }
            return `${urlparts[0]}${params}`;
        } else {
            return url;
        }
    }
    /**
     * Get string random
     *
     * @param {number} len      str length
     * @param {string} charSet  -
     * @returns {string} string ramdom
     */
    static randomString(len?: number, charSet?: string) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        len = len || 15;
        let randomString = '';
        for (let i = 0; i < len; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }
    /**
     * Split String with white space
     * @param {string} str  string
     * @return {Array} Array<string|number>
     */
    static strSplitSpace(str?: string): Array<string | number> {
        if (!str) {
            return [];
        }
        return str.split(/[\s ]+/);
    }
    /**
     * Check for existence of a whitespace in string
     *
     * @param {string} str a string
     * @returns {boolean} string has a whitespace or not
     */
    static checkSpaceInString(str: string): boolean {
        if (this.isBlank(str)) {
            return false;
        }
        if ((str || '').match(/\s/g)) {
            return true;
        }
        return false;
    }

    /**
     * Get extension from a file name
     *
     * @param {string} fileName a file name
     * @returns {string} file extension
     */
    static getExtensionFile(fileName: string): string {
        if (this.isBlank(fileName)) {
            return '';
        }
        const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        return ext;
    }

    /**
     * Compare date
     *
     * @param {string} startDate    the start date
     * @param {string} endDate      the end date
     * @param {string} format       the format, `YYYY/MM/DD` by default
     * @returns {boolean} startDate >= endDate or not
     */
    static compareDate(startDate: string, endDate: string, format = this._dateFormat): boolean {
        if (this.isBlank(startDate) || this.isBlank(endDate)) return false;
        if (!this.checkIsDate(startDate, format)) {
            return false;
        }
        if (!this.checkIsDate(endDate, format)) {
            return false;
        }

        const d1 = moment(startDate, format);
        const d2 = moment(endDate, format);
        const formatD1 = d1.format(format);
        const formatD2 = d2.format(format);
        return formatD1 >= formatD2;
    }

    /**
     * Compare date
     *
     * @param {string} startDate    compare start date
     * @param {string} endDate      compare end date
     * @param {string} type         compare type
     * @param {string} format       The default format value is YYYY/MM/DD
     * @returns {string} date
     */
    static compare2Date(startDate: string, endDate: string, type = ">", format = this._dateFormat): boolean {
        if (this.isBlank(startDate) || this.isBlank(endDate)) {
            return false;
        }
        if (!this.checkIsDate(startDate, format)) {
            return false;
        }
        if (!this.checkIsDate(endDate, format)) {
            return false;
        }

        const d1 = moment(startDate, format);
        const d2 = moment(endDate, format);

        const formatD1 = d1.format(format);
        const formatD2 = d2.format(format);

        if (">" === type) {
            return formatD1 > formatD2;
        } else if ("<" === type) {
            return formatD1 < formatD2;
        } else if ("=" === type) {
            return formatD1 == formatD2;
        } else if (">=" === type) {
            return formatD1 >= formatD2;
        } else if ("<=" === type) {
            return formatD1 <= formatD2;
        }
        return false;
    }

    /**
     * Get date format
     *
     * @param {string} date a date
     * @param {string} beforeFormat The default format value is YYYY/MM/DD
     * @param {string} afterFormat  Result received after format the default value is YYYY/MM/DD
     * @returns {string} date
     */
    static getDateFormat(date?: string, beforeFormat = this._dateFormat, afterFormat = this._dateFormat): string {
        if (this.isBlank(date)) return '';
        if (!this.checkIsDate(date, beforeFormat)) return '';
        const d = moment(date, beforeFormat);
        return d.format(afterFormat);
    }
    /**
     * Check format is date
     *
     * @param {string} date  test day
     * @param {string} format The default format value is DD/MM/YYYY
     *
     * @returns {boolean|null} boolean
     */
    static checkIsDate(date?: string, format = this._dateFormat): boolean {
        if (this.isBlank(date)) {
            return false;
        }
        return moment(date, format, true).isValid();
    }
    /**
     * Get to day
     *
     * @param {string} format The default format value is MM/YYYY
     * @returns {string} date
     */
    static toDay(format = this._dateFormat): string {
        const today = new Date(Date.now());
        const d = moment(today, format);
        return d.format(format);
    }
    /**
     * Add and subtract days
     *
     * @param {string} date     a date
     * @param {number} value    Number of days plus or minus
     * @param {boolean} type    true: add days, false: subtract days
     * @param {string} format   Date format with default value is YYYY/MM/DD
     * @returns {string} date
     */
    static addDate(date?: string, value = 1, type = true, format = this._dateFormat): string {
        if (!date) return '';
        if (!this.checkIsDate(date, format)) {
            return "";
        }
        const d = moment(date, format);
        if (type) {
            return d.add(value, "days").format(format);
        }
        return d.subtract(value, "days").format(format);
    }

    /**
     * Get format file size
     *
     * @param {number} bytes bytes
     * @param {number} decimalPoint decimalPoint
     * @param {number} unit unit
     * @returns {number} file size
     */
    static getFileSizeWithUnit(bytes: number, decimalPoint: number, unit: string): number {
        if (bytes === 0 || !unit) {
            return 0;
        }
        const k = 1000;
        const dm = decimalPoint > 0 ? decimalPoint : 0;
        const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
        const i = sizes.indexOf(unit.toLocaleLowerCase());
        if (i < 0) {
            return bytes;
        }
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    }

    /**
     * Check if a string contains only half width numbers
     *
     * @param  {string} str a string
     * @returns {boolean} correct or not
     */
    static isHalfWidthNumber(str: string): boolean {
        const regex = new RegExp('^[0-9]+$');
        return regex.test(str);
    }

    /**
     * Get Katakana regular expression
     *
     * @returns {RegExp} Katakana regular expression
     */
    static getKanaRegex(): RegExp {
        return new RegExp('^[\u30A0-\u30FF]+$');
    }

    /**
     * Get IP regular expression
     *
     * @returns {RegExp} IP regular expression
     */
    static getIPRegex(): RegExp {
        return new RegExp(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        );
    }

    /**
     * Get alphanumeric regular expression
     *
     * @returns {RegExp} alphanumeric regular expression
     */
    static getAlphaNumericRegex(): RegExp {
        return new RegExp('^[A-Za-z0-9]+$');
    }

    /**
     * Get half width number regular expression
     *
     * @returns {RegExp} half width number regular expression
     */
    static getHalfWidthNumericRegex(): RegExp {
        return new RegExp('^[0-9]+$');
    }

    /**
     * Get must fixed alphanumeric regular expression
     *
     * @returns {RegExp} must fixed alphanumeric regular expression
     */
    static getMustMixedAlphaNumericRegex(): RegExp {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{1,}$/;
    }

    /**
     * Get formatted string of date
     *
     * @param {Date} date a date
     * @param {string} toFormat "YYYY/MM/DD" by default
     * @returns {string} formatted string of date
     * @author nguyen.luu 09-06-2021 11:09
     */
    static getDateString(date: Date, toFormat = this._dateFormat): string {
        const momentDate = moment(date);
        return !this.isBlank(toFormat)
            ? momentDate.format(toFormat)
            : momentDate.format(this._dateFormat);
    }

    /**
     * Make all properties of object become immutable including deep properties
     *
     * @param {Object} obj an object
     * @returns {Readonly<Object>} a readonly version of the parameter object
     * @author nguyen.luu 16-06-2021 16:15
     */
    static deepFreeze = (obj: {
        [key: string]: any;
    }): Readonly<{
        [key: string]: any;
    }> => {
        Object.keys(obj).forEach((prop) => {
            if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                Lib.deepFreeze(obj[prop]);
            }
        });
        return Object.freeze(obj);
    };

    /**
     * Generate error messages from the API mapped with the error list set up for form controls
     *
     * @param {object} resErrorMsg           Error messages from the API
     * @param {object} validationErrorMsg    messages from the API from controls
     * @returns {any[]} error messages
     */
    static generateApiErrorMessagesMappingKeys(
        resErrorMsg?: { [key: string]: any },
        validationErrorMsg?: { [key: string]: any }
    ): string[] {
        if (!resErrorMsg || !validationErrorMsg) {
            return [];
        }
        const errors: string[] = [];
        Object.keys(resErrorMsg).forEach((key: string) => {
            if (this.isNull(resErrorMsg[key])) {
                return;
            }
            const errKeys = resErrorMsg[key] as { [key: string]: any };
            const errMsgKeys = validationErrorMsg[key] as { [key: string]: any };
            if (this.isBlank(errKeys)) {
                return;
            }
            if ('string' === typeof errKeys) {
                if (errMsgKeys[errKeys]) {
                    const msg = errMsgKeys[errKeys] as string;
                    errors.push(msg);
                }
            } else if ('object' === typeof errKeys) {
                const resErrorMsgList = resErrorMsg[key] as [];
                for (let i = 0; i < resErrorMsgList.length; i++) {
                    if (errMsgKeys[resErrorMsgList[i]]) {
                        errors.push(
                            errMsgKeys[resErrorMsgList[i]] as string
                        );
                    }
                }
            }
        });
        return errors;
    }

    /**
     * Generate error messages from the API
     *
     * @param {object} resErrorMsg           Error messages from the API
     * @returns {any[]} error messages
     */
    static generateApiErrorMessages(
        resErrorMsg?: { [key: string]: any },
    ): string[] {
        if (!resErrorMsg) {
            return [];
        }
        const errors: string[] = [];
        Object.keys(resErrorMsg).forEach((key: string) => {
            if (this.isNull(resErrorMsg[key])) {
                return;
            }
            const errKeys = resErrorMsg[key] as { [key: string]: any };
            if (this.isBlank(errKeys)) {
                return;
            }
            if ('string' === typeof errKeys) {
                errors.push(errKeys);
            } else if ('object' === typeof errKeys) {
                const resErrorMsgList = resErrorMsg[key] as [];
                for (let i = 0; i < resErrorMsgList.length; i++) {
                    errors.push(
                        resErrorMsgList[i] as string
                    );
                }
            }
        });
        return errors;
    }

    /**
     * Append loading to body
     *
     * @returns {void}
     */
    static showLoading(): void {
        let loading = document.querySelector(`[class="fl__loading_backdrop"]`) as HTMLElement;
        if (loading) {
            const elemLoadingCount = loading.getAttribute('loading-count');
            let loadingCount = 0;
            if (elemLoadingCount) {
                loadingCount = Number(elemLoadingCount);
                loading.setAttribute('loading-count', String(loadingCount + 1));
            }
        } else {
            loading = document.createElement("div") as HTMLElement;
            loading.classList.add('fl__loading_backdrop');
            loading.setAttribute('loading-count', "1");
            loading.innerHTML = '<span class="fl__spinner"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>';
            document.body.appendChild(loading);
        }
    }
    /**
     * loading html
     *
     * @returns {void}
     */
    static loadingHtml() {
        return `
        <span class="fl__spinner"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>
        `;
    }
    /**
     * Remote loading from body
     *
     * @returns {void}
     */
    static removeLoading(): void {
        const loading = document.querySelector(`[class="fl__loading_backdrop"]`) as HTMLElement;
        if (!loading) {
            return;
        }
        const elemLoadingCount = loading.getAttribute('loading-count');
        let loadingCount = 0;
        if (!elemLoadingCount || Number(elemLoadingCount) <= 1) {
            document.body.removeChild(loading);
        } else {
            loadingCount = Number(elemLoadingCount) - 1;
            loading.setAttribute('loading-count', String(loadingCount));
        }
    }
    /**
     * parse JSON String or JSON to object
     *
     * @param {string} jsonString   JSON string
     * @returns {T | null} T
     */
    static parseJSON<T = any>(jsonString: string): T | null {
        try {
            if (this.isBlank(jsonString)) {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data = JSON.parse(jsonString);
            if (!data) {
                return null;
            }
            return data as T;
        } catch (ex) {
            return null;
        }
    }
    /**
     * Get access token from local storage
     *
     * @param {string} urlToken url token
     * @returns {string} access token
     */
    static generateHttpToken(urlToken?: string | null): string {
        try {
            let token = '';
            if (!urlToken) {
                const userLogin = this.getUserLogin() as UserEntity;
                if (!userLogin || !userLogin.access_token) {
                    return '';
                }
                token = userLogin.access_token;
            } else if (!this.isBlank(urlToken)) {
                token = urlToken;
            }
            return token;
        } catch (error) {
            return '';
        }
    }
    /**
     * Remove user information from local storage
     *
     * @returns {void}
     */
    static removeUserInLocalStorage(): void {
        try {
            localStorage.removeItem(Constants.LOCAL_STORAGE_USER_LOGIN_KEY);
        } catch (error) {
            return;
        }
    }
    /**
     * Get user login information from local storage
     *
     * @returns {UserEntity} UserEntity
     */
    static getUserLogin(): UserEntity | null {
        try {
            const userFromStorage = localStorage.getItem(
                Constants.LOCAL_STORAGE_USER_LOGIN_KEY
            );
            if (!userFromStorage) {
                return null;
            }
            const userLogin = this.parseJSON<UserEntity>(userFromStorage);
            if (!userLogin) {
                return null;
            }
            return userLogin;
        } catch (error) {
            return null;
        }
    }

    /**
     * Convert html entity string to html
     *
     * @param {string} htmlentities html entity
     * @return {string} html
     */
    static decodeHTMLEntities(htmlentities: string): string {
        const entities = [
            ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['quot', '"']
        ];
        for (let i = 0, max = entities.length; i < max; ++i) {
            htmlentities = htmlentities.replace(new RegExp(`&${entities[i][0]};`, 'g'), entities[i][1]);
        }
        return htmlentities;
    }

    /**
   * Check the extension of an uploaded file
   *
   * @param  {string} fileName the name of the file
   * @param  {Array} fileExtensions file extensions to validate, examples: ['jpg', 'png']
   * @return {boolean} is the extension of the file valid or not
   */
    static checkExtensionFile(fileName: string, fileExtensions: string[]): boolean {
        if (this.isBlank(fileName)) return false;
        if (!this.isValidArrayData(fileExtensions)) return false;

        const lowerFileName = fileName.toLowerCase();
        const ext = lowerFileName.substr((lowerFileName.lastIndexOf('.') + 1));
        for (let i = 0; i < fileExtensions.length; i++) {
            if (ext === fileExtensions[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if the size of an uploaded file is bigger than Constants.MAX_FILE_UPLOAD
     *
     * @param {File} file a file
     * @returns {boolean} true => bigger than Constants.MAX_FILE_UPLOAD
     */
    // static isFileOversize(file: File): boolean {
    //     const fileSizeInMB = parseFloat((file.size / Math.pow(1000, 2)).toFixed(2));
    //     return fileSizeInMB > Constants.MAX_FILE_UPLOAD;
    // }
    /**
     * Get email regular expression (RFC 2822 compliant regex)
     *
     * @returns {RegExp} email regular expression
     */
    static getEmailRegex(): RegExp {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }
    /**
     * Resize image
     *
     * @param {string} base64   image is base64string
     * @param {number} newX     image resize width
     * @param {number} newY     image resize height
     *
     * @returns {object} Promise
     */
    static compressImage(base64: string, newX = 800, newY = 0) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                if (img.width <= newX) {
                    res(base64);
                } else {
                    if (newY === 0) {
                        newY = (newX * img.height) / img.width;
                    }
                    const elem: any = document.createElement('canvas');
                    if (!elem) {
                        res(null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    elem.width = newX;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    elem.height = newY;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    const ctx = elem.getContext('2d');
                    if (!ctx) {
                        res(null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    ctx.drawImage(img, 0, 0, newX, newY);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    const data = ctx.canvas.toDataURL();
                    res(data);
                }
            }
            img.onerror = error => rej(error);
        })
    }
    /**
     * @description Map value to FormControl
     *
     * @param {object} controls           FormControl
     * @param {object} data                 data set for FormControl
     * @returns {object} object
     */
    static assignDataFormControl(controls?: { [key: string]: any }, data?: { [key: string]: any }) {
        if (!controls || !data) {
            return [];
        }
        Object.keys(controls).forEach((key: string) => {
            if (this.isNull(controls[key])) {
                return;
            }
            const dataKey = data[key] as { [key: string]: any };
            if (typeof dataKey == 'undefined' || dataKey == null || typeof dataKey == 'object') {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            controls[key].setValue(dataKey);
        });
        return controls;
    }

    /**
     * Change date strings to another format
     *
     * @param  {string} dateString a date string
     * @param  {string?} toFormat the format of the result, `YYYY/MM/DD` by default
     * @param  {string?} fromFormat the format of `dateString`, set this for a more exactly result
     *
     * @returns {string} dateString in another format, return blank if there is an error
     */
    static dateFormat(dateString?: string, toFormat = this._dateFormat, fromFormat = this._dateFormat): string {
        if (this.isBlank(dateString)) return '';

        if (this.isBlank(fromFormat)) {
            const formats = ["YYYY/MM/DD HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss", "MM/DD/YYYY HH:mm:ss", "MM-DD-YYYY HH:mm:ss"]
            for (let i = 0; i < formats.length; i++) {
                const result = moment(dateString, formats[i]);
                if (result.isValid()) {
                    return result.format(toFormat);
                }
            }
        } else {
            const result = moment(dateString, fromFormat);
            if (result.isValid()) {
                return result.format(toFormat);
            }
        }

        return '';
    }
    /**
     *
     * @param {string} password - password
     * @returns {string} hidden password
     */
    static hiddenPassword(password: string | undefined): string {
        if (password === undefined) return '';
        const regex = /[A-Za-z0-9!@?#$%^&*<>()]/ig;
        return password.replace(regex, '*');
    }

    /**
     * Convert null or undefined properties of an object into blank strings
     * @param  {object} obj the object
     * @note Be aware if the parameter contains non-primitive type properties. Changes of those properties in the result may make object's ones to change
     * @returns {object} a new object which is similar to the `obj` parameter
     */
    static convertNullUndefinedPropertiesToBlank(obj: { [key: string]: any }): { [key: string]: any } {
        const result = { ...obj };
        for (const key in result) {
            if (this.isBlank(result[key])) {
                result[key] = '';
            }
        }
        return result;
    }
    /**
     * encrypt string using btoa
     *
     * @param {string} str string
     * @returns {string} encrypt string
     */
    static btoaEncrypt(str: string): string {
        if (this.isBlank(str)) {
            return "";
        }
        return btoa(str);
    }
    /**
     * btoa encrypt string
     *
     * @param {string} str string you want to encode
     *
     * @returns {string} coding string
     */
    static atobDecrypt(str?: string): string {
        return atob((str || ""));
    }

    /**
     * Get the string which is the formatted number
     * @param {any} number any number
     * @returns {string} formatted number
     */
    static getFormatNumber(number: any): string {
        if (this.isBlank(number)) return '';
        if (!number) return '0';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const _moneyAmount = parseFloat(number);
        return new Intl.NumberFormat().format(_moneyAmount);
    }

    /**
     * Add and subtract date by month
     * @param {Date | string} date a date object or date string
     * @param {number} value number of month
     * @param {boolean} isAdd true: add months, false: subtract months
     * @param {string} format output format, default is DD/MM/YYYY
     * @param {string} fromFormat source format of `date`, get the output format if this is blank
     * @returns {Date} a new date which is earlier than `date` by `value` months
     */
    public static addDateByMonth(date: Date | string, value: number, isAdd = true, format = this._dateFormat, fromFormat?: string): string {
        if (this.isNull(date)) return '';

        const d = moment(date, fromFormat || format);
        if (isAdd) {
            return d.add(value, "months").format(format);
        }
        return d.subtract(value, "months").format(format);
    }

    /**
     * MD5 encode strings
     * @param  {string} str a string
     * @returns {string} a md5 encoded string
     */
    public static md5(str: string): string {
        if (this.isBlank(str)) return '';
        return CryptoJS.MD5(str).toString();
    }

    /**
     * Extract all numbers in a string by using regex to replace non-numeric characters
     * @param {string} str any string, not being mutated
     * @returns {number} a number that is a combination of all numbers in the sequence from left to right, 0 if error
     * @example
     * ```typescript
     * const str = "110ab122cd";
     * const num = this.extractNumberFromString(str); //110122
     * ```
     * @author nguyen.luu 24-12-2021 11:20
     */
    public static extractNumberFromString(str: string): number {
        if (this.isBlank(str)) return 0;

        const copy = str;
        const result = copy.replace(/[^0-9.]*/g, '');
        return Number(result) ? Number(result) : 0
    }

    /**
     * Compare 2 dates by converting to timestamps
     * @param  {Date|string|number} date1 a date that the `Date` class can use to construct, not being mutated
     * @param  {Date|string|number} date2 a date that the `Date` class can use to construct, not being mutated
     * @param  {string} operator comparison operator
     * @returns {boolean} the result when comparing `date1` and `date2` using the `operator`
     * @author nguyen.luu 27-12-2021 10:35
     */
    public static dateTimestampCompare(date1: Date | string | number, date2: Date | string | number, operator: '=' | '>' | '>=' | '<' | '<='): boolean {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        if (operator === '=') return d1.getTime() === d2.getTime();
        if (operator === '>') return d1.getTime() > d2.getTime();
        if (operator === '>=') return d1.getTime() >= d2.getTime();
        if (operator === '<') return d1.getTime() < d2.getTime();
        if (operator === '<=') return d1.getTime() <= d2.getTime();

        return false;
    }
    /**
     * Display only limit characters of a long string
     *
     * @param {string} str          string
     * @param {mumber} limit        display character limit
     * @returns {string}    string
     */
    public static limitCharInString(str: string, limit = 80): string {
        if (!str) {
            return '';
        }
        let more = '';
        if (str.length > limit) {
            more = '...';
        }
        return `${str.slice(0, limit)}${more}`;
    }
    /**
     * Get max index in body
     * @returns {number} z-index
     */
    public static getMaxZIndex(): number {
        return Math.max(
            ...Array.from(document.querySelectorAll('body *'), el =>
            parseFloat(window.getComputedStyle(el).zIndex),
            ).filter(zIndex => !Number.isNaN(zIndex)),
            0,
        );
    }

    /**
     * Get milliseconds based on UTC time
     * @returns {number} utc time
     */
    public static getMillisecondsTimeUTC(): number {
        const now = new Date();
        try {
            const utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            return utcNow.getTime();
        } catch (ex) {
            console.error('[ERROR] getMillisecondsTimeUTC: ', ex);
        }
        return now.getTime();
    }
    /**
     * Returns the current date and time in the UTC timezone formatted as a string.
     * @returns {string} The formatted date and time string.
     */
    public static getStringDateTimeUTC(): string {
        try {
            const date = moment.utc();
            //console.log('v: ', date.valueOf());
            return date.format('YYYY-MM-DD HH:mm:ss.SSS');
        } catch (error) {
            console.error(error);
            return "";
        }
    }
    /**
     * Convert a date to milliseconds
     * @param {stirng} date format YYYY-MM-DD HH:mm:ss.SSS
     * @returns {number} time
     */
    public static convertDateTimeUTCToMilliseconds(date: string): number {
        if (!date) {
            return 0;
        }
        const d = moment.utc(moment(date).utc());
        if (!d) return 0;
        return d.valueOf();
    }
    /**
     * Convert a time string to milliseconds
     * @param {string}  strTime     ex: one day(1d), one hour(1h), one minute(1m)
     * @returns {number} time
     */
    public static convertTimeStringToMilliseconds(strTime: string) {
        try {
            const time = parseFloat(strTime);
            if (strTime.includes('d')) {
                return time * 24 * 60 * 60 * 1000;
            }
            if (strTime.includes('h')) {
                return time * 60 * 60 * 1000;
            }
            if (strTime.includes('m')) {
                return time * 60 * 1000;
            }
            if (strTime.includes('s')) {
                return time * 1000;
            }
            if (strTime.includes('ms')) {
                return time;
            }
            return time;
        } catch (e) {
            console.error('[ERROR] convertTimeStringToMilliseconds: ', e);
            return 0;
        }
    }
    /**
     * Convert date time miliseconds to date
     * @param {number} milliseconds format date time miliseconds
     * @returns {string} date time
     */
    public static convertMillisecondsToDateTimeUTC(milliseconds: number): string {
        if (!milliseconds) {
            return '';
        }
        const d = moment.utc(moment(milliseconds)).format("YYYY-MM-DD HH:mm:ss.SSS");
        if (!d) return '';
        return d;
    }
    /**
     * Get ng-multiselect-dropdown common setting
     * @param {option} opts  Dropdown options
     * @returns {Object} ng-multiselect-dropdown common setting
     */
    static getMultiSelectDropdownSetting = (
        opts: {
            id?: string | undefined,
            text?: string | undefined,
            translate?: TranslateService
        }
    ): IDropdownSettings => ({
        singleSelection: false,
        idField: (opts.id) ? opts.id : 'id',
        textField: (opts.text) ? opts.text : 'text',
        allowSearchFilter: true,
        noDataAvailablePlaceholderText: (opts.translate) ? opts.translate.instant('message.no_data') as string : '',
        selectAllText: (opts.translate) ? opts.translate.instant('label.select_all') as string : '',
        unSelectAllText: (opts.translate) ? opts.translate.instant('label.unselect_all') as string : '',
        searchPlaceholderText: (opts.translate) ? opts.translate.instant('label.search') as string : '',
    });
    /**
     * Generate header access authentication code when calling the API
     * @returns {string} string
     */
    public static generateAuthenticateRequest(): string {
        try {
            const headerContent = {
                expired_time: this.getStringDateTimeUTC(),
            };
            return CryptLib.encrypt(JSON.stringify(headerContent));
        } catch(e) {
            console.error('[ERROR] generateAuthenticateRequestHttpHeaders: ', e);
            return '';
        }

    }

    /**
     * Add/Subtract day/week/month/year/hour/minute to date
     *
     * @param {string} date date input
     * @param {number} value value add or subtract
     * @param {number} type
     * {
     *      0: days,
     *      1: weeks,
     *      2: months,
     *      3: years,
     *      4: hours,
     *      5: minutes
     * } default: 0
     * @param {boolean} isAdd true: add | false: subtract
     * @param {string} format default "YYYY/MM/DD"
     * @param {string} fromFormat source format of `date`, get the output format if this is blank
     * @returns {string} date
     */
    static addToDate(date?: string, value = 1, type = 0, isAdd = true, format = Lib._dateFormat, fromFormat?: string): string {
        if (!date) return '';
        if (!this.checkIsDate(date, fromFormat || format)) {
            return ''
        }
        let unit: any = 'days';
        switch (type) {
            case 0:
                unit = 'days';
                break;
            case 1:
                unit = 'weeks';
                break;
            case 2:
                unit = 'months';
                break;
            case 3:
                unit = 'years';
                break;
            case 4:
                unit = 'hours';
                break;
            case 5:
                unit = 'minutes';
                break;
        }
        const d = moment(date, fromFormat || format);
        if (isAdd) {
            return d.add(value, unit).format(format);
        }
        return d.subtract(value, unit).format(format);
    }

}
