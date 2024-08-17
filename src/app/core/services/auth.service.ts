import { Injectable } from "@angular/core";
import { UserEntity } from "../entities";
import { BehaviorSubject } from "rxjs";
import Lib from "../../utils/lib";
import Constants from "../../utils/constants";

@Injectable({ providedIn: 'root' })
export class AuthService {

    /**
     * Behavior subject storing current login user data (user data in local storage) of the application
     * @authorhung.le
     *
     * @public
     * @type {BehaviorSubject<UserEntity | null>}
     */
    public curLoginUserSubject: BehaviorSubject<UserEntity | null>;

    /** Constructor */
    constructor() {
        const curUser = Lib.getUserLogin();
        this.curLoginUserSubject = new BehaviorSubject<UserEntity | null>(curUser);
    }

    /**
     * Update user information to local storage
     *
     * @param {UserEntity} user user info
     * @returns {void}
     */
    public updateCurrentLoginUser(user: UserEntity): void {
        if (Lib.isNull(user)) return;

        // Emit every subscriber that the current login user data is updated
        this.curLoginUserSubject.next(user);

        localStorage.removeItem(Constants.LOCAL_STORAGE_USER_LOGIN_KEY);
        localStorage.setItem(Constants.LOCAL_STORAGE_USER_LOGIN_KEY, JSON.stringify(user));
    }

}
