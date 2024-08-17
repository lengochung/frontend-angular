import { DestroyRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserEntity } from '../entities';
import Constants from '../../utils/constants';
import Lib from '../../utils/lib';

export abstract class BaseComponent {
    /**
     * System constants
     * Define constants here so that template (HTML) files can use constants too
     */
    public readonly Constants = Constants;
    public readonly Lib = Lib;
    protected isSearching = false;
    protected isSearchMore = false;
    protected isPageLoaded = false;
    public userLogin = this.Lib.getUserLogin() as UserEntity;
    //Store the number of search results
    public searchResultCount = 0;
    //Represents the current page number being displayed
    public currentPage = this.getPagingNumberOnUrl();
    /**
     * Use this property to translate texts in the component.
     * EX: const text = this.translate.instant('message key') as string;
     */
    public readonly translate = inject(TranslateService);
    /**
     * Use this property to display toast notifications in the component.
     */
    public readonly toastr = inject(ToastrService);
    /**
     * Use this for takeUntilDestroyed
     * Ex: <Observable>.pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
     */
    public readonly destroyRef = inject(DestroyRef)
    /**
     * Retrieves error messages from the API.
     * This function fetches error messages from the API and returns them as an array or string.
     *
     * @param {string | Array} msg  Message from the API can be a string or an array.
     * @returns {string[] | null} 	An array of error messages retrieved from the API.
     */
    protected getApiErrorMessages(msg: string | { [key: string]: any }): string[] {
        let errors: string[] = [];
        if (!msg) {
            errors.push(this.translate.instant(`message.err_unknown`) as string);
        } else if ('string' === typeof msg) {
            errors.push(msg);
        } else {
            errors = this.Lib.generateApiErrorMessages(msg);
        }
        return errors;
    }
    /**
     * Check if the language key exists
     *
     * @param {string} translationKey The translation key to check.
     * @returns {boolean} True if the translation key exists; otherwise, false.
     */
    protected hasTranslation(translationKey: string): boolean {
        if (this.translate.instant(translationKey) === translationKey) {
            return false;
        }
        return true;
    }

    /**
     * Get paging from url
     *
     * @returns {number}    currentPage
     */
    protected getPagingNumberOnUrl(): number {
        const pagingParam = this.Lib.getSearchParams(this.Constants.PAGINATION_PARAM);
        if (!pagingParam || !this.Lib.isNumber(pagingParam)) {
            return 0;
        }
        let page = Number(pagingParam);
        if (Number(pagingParam) > 0) {
            page = page - 1;
        }
        return page;
    }

    /**
     * set current page
     * @param {number} page currentPage
     * @returns {void}
     */
    protected setCurrentPage(page: number): void {
        this.currentPage = page;
        //Insert param page to url
		Lib.insertParamToUrl(Constants.PAGINATION_PARAM, (page + 1));
    }
}
