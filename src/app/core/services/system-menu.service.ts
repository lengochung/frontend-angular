import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SystemMenuEntity, JsonResultEntity } from "../entities";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class SystemMenuService extends BaseService {

    /**
     * Get count number system menu
     * @authorhung.le
     *
     * @returns {returnJsonResult} returnJsonResult<SystemMenuEntity[]>>
    * */
    public getSystemMenu(): Observable<JsonResultEntity<SystemMenuEntity[]>> {
        const opts = new this.HTTPOptions();
        opts.usingApiUrl = false;
        const params = {};
        const result = this.HHttp.get<SystemMenuEntity[]>(`${environment.api_url_mockup}system-menu/system-menu.json`, params, opts);
        return this.returnHttpResponseObservable<SystemMenuEntity[]>(result);
    }

}
