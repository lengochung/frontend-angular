import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JsonResultEntity } from "../entities";
import Constants from "../../utils/constants";
import Lib from "../../utils/lib";
import { HHttp, HTTPOptions } from "../../utils/HHttp";

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    public readonly Constants = Constants;
    public readonly Lib = Lib;
    public readonly HHttp = inject(HHttp);
    public readonly HTTPOptions = HTTPOptions;
    /**
     * Return the result when receiving data from the API as an Observable
     *
     * @author hung.le 2024/03/05
     *
     * @param {object} httpResponse    http response Observable
     * @returns {JsonResultEntity}  @var JsonResultEntity
     */
    protected returnHttpResponseObservable<T>(httpResponse: Observable<JsonResultEntity<T>>): Observable<JsonResultEntity<T>>{
        return httpResponse.pipe(
            map((response: JsonResultEntity<T>) => {
                if (!response.status || !response.data) {
                    return this.Lib.returnJsonResult<T>(false, response.msg, response.data);
                }
                return this.Lib.returnJsonResult<T>(true, response.msg, response.data, response.total_row);
            }),
            catchError((error: HttpErrorResponse) => {
                if (!error) {
                    return throwError(() => this.Lib.returnJsonResult(false));
                }
                return throwError(() => this.Lib.returnJsonResult<T>(false, error.message));
            })
        );
    }
    /**
     * Return the result when receiving data from the API as promise
     *
     * @author hung.le 2024/03/05
     *
     * @param {object} httpResponse    JsonResultEntity<T>
     * @returns {JsonResultEntity}  @var JsonResultEntity
     */
    protected async returnHttpResponsePromise<T>(httpResponse: Observable<JsonResultEntity<T>>): Promise<JsonResultEntity<T>>{
        try {
            const result = await firstValueFrom(httpResponse);
            if (!result.status) {
                return this.Lib.returnJsonResult(false, result.msg, result.data);
            }
            return this.Lib.returnJsonResult<T>(true, result.msg, result.data, result.total_row);
        } catch (error) {
            const httpError = error as HttpErrorResponse;
            if (!httpError) {
                return this.Lib.returnJsonResult(false);
            }
            const httpErrorMessage = this.HHttp.getErrorMessage(httpError.status);
            return this.Lib.returnJsonResult<T>(false, httpErrorMessage);
        }
    }
    /**
     * Remove attribute has value null or undefined from object
     * @author hung.le 2024/07/11
     *
     * @param {object} httpParams {[key: string]: any}
     * @returns {HttpParams}  @var params HttpParams
     */
    protected buildHttpParams(httpParams: {[key: string]: any}): HttpParams {
        let params = new HttpParams();
        for (const key in httpParams) {
          if (httpParams.hasOwnProperty(key) && (httpParams[key] !== null && httpParams[key] !== undefined)) {
            params = params.set(key, httpParams[key]);
          }
        }
        return params;
    }
}
