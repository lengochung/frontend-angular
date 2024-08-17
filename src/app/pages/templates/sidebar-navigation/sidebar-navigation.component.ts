import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Constants from '../../../utils/constants';
import { MenuService } from '../../../core/services';
import { MenuEntity } from '../../../core/entities';

@Component({
    selector: 'app-sidebar-navigation',
    templateUrl: './sidebar-navigation.component.html',
    standalone: true,
    imports: [
        RouterModule,
        TranslateModule,
    ],
})
export class SidebarNavigationComponent implements OnInit {
    public readonly Constants = Constants;
    private _menuService = inject(MenuService);
    private _router = inject(Router);
    public menuList: Array<MenuEntity> = [];
    private _txtMenuActive = 'active';
    /** constructor */
    constructor(
    ) {
        this.menuList = this._menuService.getMenuTop();
        if (this.menuList.length > 0) {
            this.menuList.map((menu) => {
                if (menu.link !== this._router.url) {
                    return menu.active = '';
                }
                return menu;
            });
        }
    }
    /**
     * It is called after Angular has initialized all data-bound properties of a directive
     * @returns {void}
     */
    ngOnInit(): void {
        return;
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
        if (menuItem.active === this._txtMenuActive) {
            return;
        }
        const bodyElem = document.querySelector("body") as HTMLBodyElement;
        if (bodyElem && bodyElem.classList.contains('sidebar-open')) {
            bodyElem.classList.remove('sidebar-open');
            bodyElem.classList.add('sidebar-closed', 'sidebar-collapse');
        }
        //Reset menu active
        this.menuList.map((menu) => {
            return menu.active = '';
        });
        menuItem.active = this._txtMenuActive;
        void this._router.navigate([menuItem.link]);
    }
}
