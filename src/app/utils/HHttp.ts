import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, finalize } from 'rxjs/operators';
import * as qs from 'qs';
import { ToastrService } from 'ngx-toastr';
import Constants from './constants';
import Lib from './lib';
import { JsonResultEntity } from '../core/entities';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoginComponent } from '../pages/auth/login/login.component';
import { AuthService } from '../core/services/auth.service';

/**
 * Base HTTP client for making HTTP requests
 *
 * @author hung.le 2024/03/04
 */
/** Common HTTP options used in HTTP requests */
export class HTTPOptions {
    public requestTimeout = 0;
    public showLoading = true;
    public usingApiUrl = true;
    public isAccessToken = true;
    public accessToken = "";
    public isUploadFile = false;
    public isHeader = true;
    public contentType = Constants.CONTENT_TYPE.JSON;
    public params?:
        | HttpParams
        | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
}

@Injectable({
    providedIn: 'root',
})
export class HHttp {
    /**
     * variable to store base url
     */
    private _apiURL = environment.api_url;
    private _httpClient = inject(HttpClient);
    private _toastrService = inject(ToastrService);
    private _translate = inject(TranslateService);
    private _modalService = inject(NgbModal);
    private _router = inject(Router);
    private _authService = inject(AuthService);
    /**
     * Common http heders for all api calls
     *
     * @param {object} opts     header options
     * @returns {object} aa
     */
    private _headers(opts: {
        method?: string,
        contentType?: string,
        isAccessToken?: boolean,
        accessToken?: string | null,
        isUploadFile?: boolean
    }) {
        const headers: { [key: string]: string } = {};
        if (!opts.isUploadFile) {
            headers['Content-Type'] = (opts.contentType ? opts.contentType : Constants.CONTENT_TYPE.JSON);
        } else {
            headers['enctype'] = Constants.CONTENT_TYPE.MULTIPART;
        }
        headers['authenticate_request'] = Lib.generateAuthenticateRequest();
        if (opts.isAccessToken) {
            const getToken = Lib.generateHttpToken();
            if (!Lib.isBlank(getToken)) {
                headers['authorization'] = `Bearer ${getToken}`;
            }
        }
        if (opts.method == Constants.METHOD.POST_PDF) {
            headers['Accept'] = Constants.CONTENT_TYPE.PDF;
        } else {
            headers['Accept'] = Constants.CONTENT_TYPE.JSON;
        }
        return headers;
    }

    /**
    * Get method to call api
    * @param {string} route        API path slug
    * @param {object} body         request body ex: {name: "name", key: "key",...}
    * @param {HTTPOptions} opts    HTTP options(similar to the post)
    *
    * @returns {ApiResult} Observable
    */
    public get<T>(route: string, body = {}, opts = new HTTPOptions()): Observable<JsonResultEntity<T>> {
        return this._httpResponse<T>(route, body, opts, Constants.METHOD.GET);
    }
    /**
    * Put method to call api
    * @param {string} route        API path slug
    * @param {object} body         request body ex: {name: "name", key: "key",...}
    * @param {HTTPOptions} opts    HTTP options(similar to the post)
    *
    * @returns {ApiResult} Observable
    */
    public put<T>(route: string, body = {}, opts = new HTTPOptions()): Observable<JsonResultEntity<T>> {
        return this._httpResponse<T>(route, body, opts, Constants.METHOD.PUT);
    }
    /**
    * Delete method to call api
    * @param {string} route        API path slug
    * @param {object} body         request body ex: {name: "name", key: "key",...}
    * @param {HTTPOptions} opts    HTTP options(similar to the post)
    *
    * @returns {ApiResult} Observable
    */
    public delete<T>(route: string, body = {}, opts = new HTTPOptions()): Observable<JsonResultEntity<T>> {
        return this._httpResponse<T>(route, body, opts, Constants.METHOD.DELETE);
    }
    /**
    * Post method to call api
    * @param {string} route        API path slug
    * @param {object} body         request body ex: {name: "name", key: "key",...}
    * @param {HTTPOptions} opts    HTTP options
    * {
    *     requestTimeout: number,      //Timeout duration for API call (e.g., 10000 => 10s)
    *     showLoading: boolean,        //true: display loading, false: do not display loading, default is true
    *     isAccessToken: boolean,      //true: set header authorization
    *     isUploadFile: boolean,       //If uploading a file, set value to true, default is false
    *     params: object | string,     //If it is an object, params will be {name: "name", key: "key",...}
    *                                  //If it is a string, params will be: "name=name&key=key&..."
    *  }
    *
    * @returns {ApiResult} Observable
    */
    public post<T>(route: string, body = {}, opts = new HTTPOptions()): Observable<JsonResultEntity<T>> {
        return this._httpResponse<T>(route, body, opts);
    }
    /**
     * Results returned from the API
     * @param {string} route       API path slug
     * @param {object} body        request body ex: {name: "name", key: "key",...}
     * @param {HTTPOptions} opts   HTTP options(similar to the post)
     * @param {string} method      HTTP method
     *
     * @returns {ApiResult} Observable
     */
    private _httpResponse<T>(route: string, body = {}, opts = new HTTPOptions(), method = Constants.METHOD.POST): Observable<JsonResultEntity<T>> {
        if (opts.showLoading) Lib.showLoading();
        let url = `${this._apiURL}${route}`;
        if (!opts.usingApiUrl) {
            url = route;
        }
        if (opts.requestTimeout <= 0) {
            opts.requestTimeout = Number(environment.api_request_timeout);
        }
        if (method === Constants.METHOD.GET) {
            const queryString = qs.stringify(body);
            url = `${url}${!Lib.isBlank(queryString) ? `?${queryString}` : ''}`;
        }
        let headerOpts = this._headers({
            method: method,
            contentType: opts.contentType,
            isUploadFile: opts.isUploadFile,
            isAccessToken: opts.isAccessToken,
            accessToken: opts.accessToken,
        });
        if (!opts.isHeader){
            headerOpts = {};
        }
        const headers = new HttpHeaders(headerOpts);
        let apiRsp = null;
        if (method === Constants.METHOD.POST) {
            apiRsp = this._httpClient.post<JsonResultEntity<T>>(url, body, {
                ...opts,
                headers,
            });
        } else if (method === Constants.METHOD.GET) {
            apiRsp = this._httpClient.get<JsonResultEntity<T>>(url, {
                ...opts,
                headers,
            });
        } else if (method === Constants.METHOD.PUT) {
            apiRsp = this._httpClient.put<JsonResultEntity<T>>(url, {
                ...opts,
                headers,
            });
        } else if (method === Constants.METHOD.DELETE) {
            apiRsp = this._httpClient.delete<JsonResultEntity<T>>(url, {
                ...opts,
                headers,
                body: body
            });
        }
        if (!apiRsp) {
            if (opts.showLoading) Lib.removeLoading();
            return throwError(() => { });
        }
        return apiRsp.pipe(
            timeout(opts.requestTimeout),
            catchError(this._handleError),
            finalize(() => {
                if (opts.showLoading) Lib.removeLoading();
            })
        );
    }
    /**
     * Handle HTTP error responded from API
     * @param {HttpErrorResponse}   error HTTP Error
     * @return {object} error response
     */
    private _handleError = (error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error.status);
        if (error.status === 401) {
            if (Lib.getUserLogin()) {
                // remove user from local storage
                Lib.removeUserInLocalStorage();
                this._authService.curLoginUserSubject.next(null);
                const loginSlug = `${Constants.APP_URL.AUTH.MODULE}/${Constants.APP_URL.AUTH.LOGIN}`;
                if (this._router.url && this._router.url.indexOf(loginSlug) === -1) {
                    const modal = this._modalService.open(LoginComponent, {
                        centered: true,
                        scrollable: true,
                        backdrop: 'static',
                        keyboard: false,
                        modalDialogClass: 'modal-login',
                        size: 'sm'
                    });
                    const componentInstance =modal.componentInstance as LoginComponent;
                    componentInstance.displayInModal = true;
                }
            }
            return throwError(() => error);
        } else {
            this._toastrService.error(`${errorMessage}`, '', {
                timeOut: Number(environment.toastr_timeout)
            });
        }
        return throwError(() => error);
    }
    /**
     * @description
     * Get error message by status code
     *
     * @param {int} code    http status code
     * @returns {string}    Error message content by http status code
     */
    public getErrorMessage(code: number) {
        let msg = '';
        switch (code) {
            case 0: // A client-side or network error occurred. Handle it accordingly.
                msg = this._translate.instant('error_http_message.0') as string;
                break;
            case 201:
                msg = this._translate.instant('error_http_message.201') as string;
                break;
            case 203:
                msg = this._translate.instant('error_http_message.203') as string;
                break;
            case 204:
                msg = this._translate.instant('error_http_message.204') as string;
                break;
            case 205:
                msg = this._translate.instant('error_http_message.205') as string;
                break;
            case 206:
                msg = this._translate.instant('error_http_message.206') as string;
                break;
            case 400:
                msg = this._translate.instant('error_http_message.400') as string;
                break;
            case 401:
                msg = this._translate.instant('error_http_message.401') as string;
                break;
            case 402:
                msg = this._translate.instant('error_http_message.402') as string;
                break;
            case 404:
                msg = this._translate.instant('error_http_message.404') as string;
                break;
            case 405:
                msg = this._translate.instant('error_http_message.405') as string;
                break;
            case 407:
                msg = this._translate.instant('error_http_message.407') as string;
                break;
            case 408:
                msg = this._translate.instant('error_http_message.408') as string;
                break;
            case 419:
                msg = this._translate.instant('error_http_message.419') as string;
                break;
            case 500:
                msg = this._translate.instant('error_http_message.500') as string;
                break;
            case 501:
                msg = this._translate.instant('error_http_message.501') as string;
                break;
            case 502:
                msg = this._translate.instant('error_http_message.502') as string;
                break;
            case 503:
                msg = this._translate.instant('error_http_message.503') as string;
                break;
            case 504:
                msg = this._translate.instant('error_http_message.504') as string;
                break;
            case 505:
                msg = this._translate.instant('error_http_message.505') as string;
                break;
            case 511:
                msg = this._translate.instant('error_http_message.511') as string;
                break;
            default: msg = this._translate.instant('error_http_message.default') as string;
                break;
        }
        return msg;
    }
}
