import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, UserEntity, UserSearchEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    /**
    * Login
    *
    * @param {UserEntity} params
    * {
    *       email: string,
    *       pass: string,
    *       remember_password: boolean,
    * }
    *
    * @author hung.le 2024/03/05
    *
    * @returns {returnJsonResult} returnJsonResult<{
    *   id: number,
    *   first_name: string,
    *   last_name: string,
    *   access_token: string,
    * }>
     */
    public async login(params: UserEntity): Promise<JsonResultEntity<UserEntity>> {
        const opts = new this.HTTPOptions();
        // opts.isAccessToken = false;
        opts.usingApiUrl = false;
        const result = this.HHttp.get<UserEntity>(`${environment.api_url_mockup}user/user.json`, params, opts);
        return await this.returnHttpResponsePromise<UserEntity>(result);
    }
    /**
    * Logout
    *
    * @returns {JsonResultEntity} @var JsonResultEntity<boolean>
    */
    public async logout(): Promise<JsonResultEntity<boolean>> {
        const result = this.HHttp.post<boolean>(this.Constants.API_URL.USERS.LOGOUT);
        return await this.returnHttpResponsePromise<boolean>(result);
    }
    /**
    * Get user info
    *
    * @param {object} params {
    *   user_id: number
    * }
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public getUserInfo(params: {
        user_id: number
    }): Observable<JsonResultEntity<UserEntity>> {
        const result = this.HHttp.post<UserEntity>(this.Constants.API_URL.USERS.USER_INFO, params);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }
    /**
    * Get user list
    *
    * @param {UserSearchEntity} params UserSearchEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public getAllUserList(params: UserSearchEntity): Observable<JsonResultEntity<UserEntity[]>> {
        const result = this.HHttp.post<UserEntity[]>(this.Constants.API_URL.USERS.ALL_LIST, params);
        return this.returnHttpResponseObservable<UserEntity[]>(result);
    }

    /**
    * GetUserList
    *
    * @param {UserSearchEntity} params UserSearchEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public getUserList(params: UserSearchEntity): Observable<JsonResultEntity<UserEntity[]>> {
        // const opts = new this.HTTPOptions();
        // opts.usingApiUrl = false;
        const result = this.HHttp.post<UserEntity[]>(this.Constants.API_URL.USERS.ALL_LIST, params);
        return this.returnHttpResponseObservable<UserEntity[]>(result);
    }
    /**
    * GetUserList by userIds
    *
    * @param {UserSearchEntity} params UserSearchEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public getUserListByUserIds(params: UserSearchEntity): Observable<JsonResultEntity<UserEntity[]>> {
        const result = this.HHttp.post<UserEntity[]>(this.Constants.API_URL.USERS.LIST_BY_USER_IDS, params);
        return this.returnHttpResponseObservable<UserEntity[]>(result);
    }
    /**
    * get user list for select
    *
    * @param {UserSearchEntity} params UserSearchEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public getUserListSelect(params: UserSearchEntity): Observable<JsonResultEntity<UserEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.showLoading = false;
        const result = this.HHttp.post<UserEntity[]>(this.Constants.API_URL.USERS.ALL_LIST, params, opts);
        return this.returnHttpResponseObservable<UserEntity[]>(result);
    }

    /**
    * save user info
    *
    * @param {UserEntity} params UserEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public onSave(params: UserEntity): Observable<JsonResultEntity<UserEntity>> {
        const result = this.HHttp.post<UserEntity>(this.Constants.API_URL.USERS.SAVE, params);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }

    /**
    * reset password user
    *
    * @param {UserEntity} params  {
    *   user_id: number;
    *   upd_datetime: string;
    * }
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public resetPasswordUser(params: {user_id: number; upd_datetime: string}):Observable<JsonResultEntity<UserEntity>> {
        const result = this.HHttp.post<UserEntity>(this.Constants.API_URL.USERS.RESET_PASSWORD, params);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }

    /**
    * Delete user
    *
    * @param {object} params {
    *   user_id: number;
    *   upd_datetime: string;
    * }
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public deleteUser(params: {user_id: number; upd_datetime: string}):Observable<JsonResultEntity<UserEntity>> {
        const result = this.HHttp.post<UserEntity>(this.Constants.API_URL.USERS.DELETE, params);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }

    /**
     * Get user detail
     * @authorhung.le
     *
     * @public
     * @param {object} params {
     *  user_id: number
     * }
     * @returns {JsonResultEntity} JsonResultEntity<UserEntity>
     */
    public getUser(params: {
        user_id: number
    }): Observable<JsonResultEntity<UserEntity>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const result = this.HHttp.get<UserEntity>(`${environment.api_url_mockup}user/user_detail.json`, params, opts);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }

    /**
    * update profile user
    *
    * @param {UserEntity} params UserEntity
    * @returns {JsonResultEntity} @var JsonResultEntity<UserEntity>
    */
    public updateProfileUser(params: UserEntity): Observable<JsonResultEntity<UserEntity>> {
        const result = this.HHttp.post<UserEntity>(this.Constants.API_URL.USERS.SAVE_PROFILE, params);
        return this.returnHttpResponseObservable<UserEntity>(result);
    }

}
