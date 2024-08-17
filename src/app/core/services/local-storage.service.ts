import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    /**
    * Save data to localstorage by key
    * 
    * @param {string} key               localstorage key
    * @param {object|string} data       value
    * @returns {void}
    */
    public set(key?: string, data?: { [key: string]: any } | string): void {
        try {
            if (!key || !data) return;
            const curData = localStorage.getItem(key);
            if (curData) {
                localStorage.removeItem(key);
            }
            if (typeof data === 'string') {
                localStorage.setItem(key, data);
            } else {
                localStorage.setItem(key, JSON.stringify(data));
            }
        } catch (error) {
            return;
        }
    }
    /**
    * Get data from localstorage by key
    * 
    * @param {string} key       localstorage key
    * @returns {T | null}    value
    */
    public get<T>(key?: string): T | null {
        try {
            if (!key) return null;
            const data = localStorage.getItem(key) as string;
            if (!data) {
                return null;
            }
            const currentData = JSON.parse(data) as T;
            if (!currentData) {
                return null;
            }
            return currentData;
        } catch (error) {
            if (!key) return null;
            return localStorage.getItem(key) as T;
        }
    }
    /**
    * Remove data from localstorage by key
    * 
    * @param {string} key       localstorage key
    * @returns {void}
    */
    public remove(key?: string): void {
        try {
            if (!key) return;
            localStorage.removeItem(key);
        } catch (error) {
            return;
        }
    }
}
