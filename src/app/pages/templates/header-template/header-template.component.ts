import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Lib from '../../../utils/lib';
import Constants from '../../../utils/constants';
import { AuthService, MenuService } from '../../../core/services';
import { MenuEntity, UserEntity } from '../../../core/entities';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-header-template',
    templateUrl: './header-template.component.html',
    standalone: true,
    imports: [
        RouterModule,
        TranslateModule,
    ],
})
export class HeaderTemplateComponent implements OnInit, OnDestroy {
    public readonly Lib = Lib;
    public readonly Constants = Constants;
    private _subscriptionList: Subscription[] = [];
    private _router = inject(Router);
    private _menuService = inject(MenuService);
    public menuList: Array<MenuEntity> = [];
    public userLogin: UserEntity = {};
    public userDisplayName: UserEntity | null = null;
    public _authService = inject(AuthService);
    /** constructor */
    constructor(
    ) {
        this.userLogin = Lib.getUserLogin() as UserEntity;
        this.menuList = this._menuService.getMenuTop();
        const sub = this._authService.curLoginUserSubject.subscribe(user => {
            if (user) {
                this.userDisplayName = user;
            }
        });
        this._subscriptionList.push(sub);
    }
    /**
     * It is called after Angular has initialized all data-bound properties of a directive
     * @returns {void}
     */
    ngOnInit(): void {
        return;
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }
    /**
     * Menu click
     * @param {MenuEntity} menuItem     MenuEntity
     * @returns {void}
     */
    public onMenuClick(menuItem: MenuEntity): void {
        if (!menuItem) {
            return;
        }
        if (menuItem.child && menuItem.child.length > 0) {
            menuItem.menu_open = !menuItem.menu_open;
            return;
        }
        //Reset menu active
        this.menuList.map((menu) => {
            return menu.active = '';
        });
        menuItem.active = 'active';
        if (menuItem.link) {
            void this._router.navigate([menuItem.link]);
        }
    }
    /**
     * Logout
     * @returns {void}
     */
    public async logout(): Promise<void> {
        // const resData = await this._userService.logout();
        // if (!resData.status){
        //     this._toastr.error(this._translate.instant('message.login_out') as string);
        //     return;
        // }
        this.Lib.removeUserInLocalStorage();
        this._authService.curLoginUserSubject.next(null);
        await this._router.navigate([`${this.Constants.APP_URL.AUTH.MODULE}/${this.Constants.APP_URL.AUTH.LOGIN}`]);
    }
}
