import { Injectable, inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import Constants from "../../utils/constants";
import { MenuEntity } from "../entities";

@Injectable({ providedIn: 'root' })
export class MenuService {
    private _translate = inject(TranslateService);
   /**
    * Menu on header
    *
    * @returns {Array} Array<MenuEntity>
     */
    public getMenuTop(): Array<MenuEntity> {
        const menuItems: Array<MenuEntity> = [
            {
                id: 0,
                name: this._translate.instant('label.dashboard') as string,
                link: `/${Constants.APP_URL.DASHBOARD}`,
                icon: 'fas fa-tachometer-alt',
                active: 'active',
                child: []
            },
            {
                id: 1,
                name: '通常業務',
                link: '',
                icon: 'fas fa-users',
                child: [
                    {
                        id: 1,
                        name: '是正処置',
                        link: `/${Constants.APP_URL.CORRECTIVE_REPORT.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 2,
                        name: '予防処置',
                        link: `/${Constants.APP_URL.PREVENTION_REPORT.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 3,
                        name: '障害報告・管理',
                        link: `/${Constants.APP_URL.INCIDENT_REPORT.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 4,
                        name: '操業日報',
                        link: `/${Constants.APP_URL.DAILY_REPORT.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 12,
                        name: 'トピック一覧',
                        link: `/${Constants.APP_URL.TOPIC.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 5,
                        name: '申し送り',
                        link: `/${Constants.APP_URL.NOTICES.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                ]
            },
            {
                id: 7,
                name: '管理',
                link: '',
                icon: 'fas fa-tasks',
                menu_open: false,
                child: [
                    {
                        id: 8,
                        name: 'ユーザー管理',
                        link: `/${Constants.APP_URL.USERS.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 9,
                        name: '事業所管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 10,
                        name: '区分管理',
                        link: `/${Constants.APP_URL.MANAGEMENTS.MODULE}/${Constants.APP_URL.MANAGEMENTS.DIVISIONS}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 13,
                        name: 'グループ管理',
                        link: `/${Constants.APP_URL.GROUP.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 11,
                        name: '権限管理',
                        link: `/${Constants.APP_URL.MANAGEMENTS.MODULE}/${Constants.APP_URL.MANAGEMENTS.ROLE}`,
                        icon: 'fas fa-caret-right',
                    }
                ]
            },
            {
                id: 14,
                name: '管理業務',
                link: '',
                icon: 'fas fa-tasks',
                menu_open: false,
                child: [
                    {
                        id: 15,
                        name: '内製作業管理',
                        link: `/${Constants.APP_URL.IN_OPE_MANAGE.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 16,
                        name: '工事情報周知管理',
                        link: `/${Constants.APP_URL.CONSTRUCTION.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 17,
                        name: '警報履歴',
                        link: `/${Constants.APP_URL.ALARM_HISTORY.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 18,
                        name: '電力デマンド管理',
                        link: `/${Constants.APP_URL.DEMAND.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 19,
                        name: '標準文書管理',
                        link: `/${Constants.APP_URL.STANDARD_DOCUMENT.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 20,
                        name: '分析管理',
                        link: `/${Constants.APP_URL.ANALYSIS.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 21,
                        name: '点検データ記録・管理',
                        link: `/${Constants.APP_URL.INSPECTION_DATA.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 22,
                        name: 'トレンド管理',
                        link: `/${Constants.APP_URL.TREND.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 23,
                        name: '変更指示書',
                        link: `/${Constants.APP_URL.CHANGE_ORDER.MODULE}`,
                        icon: 'fas fa-caret-right',
                    },
                ]
            }
        ];
        return menuItems;
    }
    /**
    * Dashboard screen menu
    *
    * @returns {Array} Array<MenuEntity>
     */
    public getMenu(): Array<MenuEntity> {
        const menuItems: Array<MenuEntity> = [
            {
                id: 1,
                name: this._translate.instant('label.dashboard') as string,
                link: `/${Constants.APP_URL.DASHBOARD}`,
                icon: 'fas fa-tachometer-alt',
                active: 'active',
                child: []
            },
            {
                id: 2,
                name: '業務機能',
                link: '',
                icon: 'fas fa-tasks',
                menu_open: false,
                child: [
                    {
                        id: 3,
                        name: '是正処置',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 4,
                        name: '予防処置',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 5,
                        name: '障害報告・管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 6,
                        name: '操業日報',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 7,
                        name: '申し送り',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 8,
                        name: '内製作業',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 9,
                        name: '工事情報周知',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 10,
                        name: '警報履歴',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 11,
                        name: '電力デマンド管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 12,
                        name: '標準文書管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 13,
                        name: '分析管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 14,
                        name: '点検データ・記録管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 15,
                        name: 'トレンド管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 16,
                        name: '表示・掲示物管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 17,
                        name: '変更指示書',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 18,
                        name: '部品材料・在庫管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 19,
                        name: '部品材料・発注管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 20,
                        name: 'メンテナンス管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 21,
                        name: '教育・訓練',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                    {
                        id: 22,
                        name: '資格取得',
                        link: '',
                        icon: 'fas fa-caret-right',
                    }
                ]
            },
            {
                id: 23,
                name: '管理機能',
                link: '',
                icon: 'fas fa-users-cog',
                child: [
                    {
                        id: 24,
                        name: 'グループ管理',
                        link: '',
                        icon: 'fas fa-caret-right',
                    },
                ]
            }
        ];
        return menuItems;
    }
}
