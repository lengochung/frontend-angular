import { Component, Input, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Constants from '../../../utils/constants';
@Component({
    standalone: true,
    imports: [
        TranslateModule,
    ],
    selector: 'app-content-header',
    templateUrl: './content-header.component.html',
})
export class ContentHeaderComponent implements OnInit {
    @Input() pageTitle = "";
    @Input() breadcrumbs: Array<{
        name: string,
        link: string
    }> | string = [] || '';
    public curBreadcrumbs: Array<{
        name: string,
        link: string
    }> = [];
    private _router = inject(Router);
    /**
     * @return {void}
     */
    ngOnInit(): void {
        if (typeof this.breadcrumbs === 'string') {
            this.curBreadcrumbs = [
                { name: this.breadcrumbs || '', link: '' }
            ];
        } else {
            this.curBreadcrumbs = this.breadcrumbs as Array<{
                name: string,
                link: string
            }>;
        }
    }
    /**
     * Redirect to page
     * @param {object} page -
     * @returns {void}
     */
    public goToPage(page?: {
        name: string,
        link: string
    }): void {
        if (!page) {
            void this._router.navigate([Constants.APP_URL.DASHBOARD]);
            return;
        }
        if (!page.link) {
            return;
        }
        void this._router.navigate([page.link]);
    }
}
