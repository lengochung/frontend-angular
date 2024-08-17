import { Injectable } from "@angular/core";
import { JsonResultEntity } from "../entities";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
@Injectable({ providedIn: 'root' })
export class CommonService extends BaseService{
    /**
     * Sends a POST request to delete multiple items
     *
     * @param {string} url      The URL to send the request to
     * @param {object} params   Optional parameters to include in the request body
     * @returns {JsonResultEntity} JsonResultEntity<T> A promise resolving to a JsonResultEntity with the result of the request.
     */
    public async multipleDelete<T>(url: string, params = {}): Promise<JsonResultEntity<T>> {
        const result =  this.HHttp.post<T>(url, params);
        return await this.returnHttpResponsePromise<T>(result);
    }

    /**
     * Sends a POST request to search items
     *
     * @param {string} url      The URL to send the request to
     * @param {object} params   Optional parameters to include in the request body
     * @returns {JsonResultEntity} JsonResultEntity<T> A promise resolving to a JsonResultEntity with the result of the request.
     */
    public getData<T>(url: string, params = {}): Observable<JsonResultEntity<T>> {
        const result =  this.HHttp.post<T>(url, params);
        return this.returnHttpResponseObservable<T>(result);
    }
}
