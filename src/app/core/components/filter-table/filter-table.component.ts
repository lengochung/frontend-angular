import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Lib from '../../../utils/lib';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckboxEntity, FilterColumn, FilterDisplay, SortDirection, SortEntity } from '../../entities/filter-table.entity';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonService } from '../../services';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        TranslateModule,
        NgbDropdownModule,
        InfiniteScrollModule,
        FormsModule
    ],
    selector: 'app-filter-table',
    templateUrl: './filter-table.component.html',
    styles: [`
        .dropdown-menu .ascending:hover, .dropdown-menu .descending:hover {
            background: #e9ecef;
        }
        .filter-table .dropdown-toggle::after {
            display: none;
        }
    `]
})
export class FilterTableComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    @ViewChild('dropdown') dropdown?: NgbDropdown;
    @Input() sortColumn?: SortEntity;
    @Input() className?: string;
    @Input() columnName?: string;
    @Input() displayData?: FilterDisplay[];
    // eslint-disable-next-line require-jsdoc
    get url(): string {
        return this._url;
    }
    // eslint-disable-next-line require-jsdoc
    @Input() set url(value: string) {
        this._url = value;
        if (!Lib.isBlank(this._url)) {
            this.initData();
        }
    }

    @Output() filterChanged = new EventEmitter<FilterColumn>();

    private _url = '';
    public checkboxHistoryList: CheckboxEntity[] = [];
    public checkboxList: CheckboxEntity[] = [];
    public isCheckAll = true;
    public checkboxId = Lib.randomString();
    public readonly Lib = Lib;
    private _currentPage = 1;
    public totalRow = 0;
    public dataFilter?: FilterColumn;
    public searchInput?: string;
    private _searchInputHistory?: string;

    /** constructor */
    constructor(private _commonService: CommonService) {
    }

    /**
     * @return {void}
     */
    ngOnInit(): void {
        this.dataFilter = {
            column: this.columnName,
            search: '',
            sort: '',
            uncheck: []
        }
        return;
    }

    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * initial data input
     * @authorhung.le
     *
     * @returns {void}
     */
    public initData(): void {
        const params = {
            page: 1,
            column: this.columnName
        }
        const sub = this._commonService.getData<any>(this._url, params).subscribe(rsp => {
            if (!rsp.status || !rsp.data) {
                return;
            }
            this.totalRow = rsp.total_row;

            this.checkboxList = rsp.data.map((p: any) => (<CheckboxEntity>{ is_checked: true, name: p[this.columnName ?? '']}));
            this.checkboxHistoryList = this.checkboxList.map(p => ({...p}));
        });
        this._subscriptionList.push(sub);
    }

    /**
     * On one checkbox is changed
     *
     * @param  {CheckboxEntity} cheboxItem    checkbox item
     * @param  {Event} event                HTML input event
     * @returns {void}
     */
    public onCheckboxChanged(cheboxItem: CheckboxEntity, event: Event): void {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked;
        if (this.checkboxList.length <= 0) {
            return;
        }
        this.checkboxList.forEach((item) => {
            if (item.name == cheboxItem.name) {
                item.is_checked = isChecked;
            }
        });

        if (this.checkboxList.every(item => item.is_checked)) {
            this.isCheckAll = true;
        } else {
            this.isCheckAll = false;
        }
    }

    /**
     * checkbox check all is changed
     *
     * @param  {Event} event                HTML input event
     * @returns {void}
     */
    public onCheckboxAllChanged(event: Event): void {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked;
        if (this.checkboxList.length <= 0) {
            return;
        }
        this.isCheckAll = isChecked;
        this.checkboxList.forEach((item) => {
            item.is_checked = isChecked;
        });
    }

    /**
     * Cancel button click
     * @authorhung.le
     *
     * @returns {void}
     */
    public onCancel(): void {
        this.dropdown?.close();
    }

    /**
     * Ok button click
     * @authorhung.le
     *
     * @returns {void}
     */
    public onOK(): void {
        const uncheckedList = this.checkboxList.filter(item => !item.is_checked);
        if (this.dataFilter) {
            if (!Lib.isBlank(this.searchInput)) {
                this.dataFilter.search = this.searchInput;
                this.dataFilter.uncheck = [];
                //check all
                this.isCheckAll = true;
                this.checkboxList.forEach((item) => {
                    item.is_checked = true;
                });
            } else {
                this.dataFilter.search = '';
                const uncheckArray = uncheckedList.map(item => item.name ?? '');
                this.dataFilter.uncheck = uncheckArray;
            }
            this.filterChanged.emit(this.dataFilter);
        }
        this.checkboxHistoryList = this.checkboxList.map(p => ({...p}));
        this._searchInputHistory = this.searchInput;
        this.dropdown?.close();
    }

    /**
     * sort click
     * @authorhung.le
     *
     * @param {SortDirection} sortDirection sortDirection
     * @returns {void}
     */
    public onSort(sortDirection: SortDirection): void {
        if (this.dataFilter) {
            this.dataFilter.sort = sortDirection;
            this.filterChanged.emit(this.dataFilter);
        }
        this.dropdown?.close();
    }

    /**
     * open menu change
     * @authorhung.le
     *
     * @param {boolean} isOpen isOpen
     * @returns {void}
     */
    public openMenuChange(isOpen: boolean): void {
        if (isOpen) {
            this.checkboxList = this.checkboxHistoryList.map(p => ({...p}));
            this.searchInput = this._searchInputHistory;
            if (this.checkboxList.every(item => item.is_checked)) {
                this.isCheckAll = true;
            } else {
                this.isCheckAll = false;
            }
        }
    }

    /**
     * is disable button ok
     * @returns {boolean} check disable button ok
     */
    public get isDisabled(): boolean {
        if (Lib.isValidArrayData(this.checkboxList)) {
            if (this.checkboxList.some(item => item.is_checked)) {
                return false;
            }
        }
        if (this.checkboxList.length < this.totalRow) {
            return false;
        }
        return true;
    }

    /**
     * get display checkbox name
     * @authorhung.le
     *
     * @param {string} name name
     * @returns {string} display name
     */
    public getDisplayName(name?: string): string {
        let displayName = name;
        if (this.Lib.isValidArrayData(this.displayData)) {
            displayName = this.displayData?.find(p => p.id === name)?.name ?? name;
        }
        return displayName ?? '';
    }

    /**
     * load more
     * @authorhung.le
     *
     * @returns {void}
     */
    public onLoadMore(): void {
        this._currentPage++;
        const params = {
            page: this._currentPage,
            column: this.columnName
        }
        const sub = this._commonService.getData<any>(this._url, params).subscribe(rsp => {
            if (!rsp.status || !rsp.data) {
                return;
            }

            const data = rsp.data.map((p: any) => (<CheckboxEntity>{ is_checked: true, name: p[this.columnName ?? '']}));
            this.checkboxList.push(...data);
            this.checkboxHistoryList = this.checkboxList.map(p => ({...p}));
        });
        this._subscriptionList.push(sub);
    }

    /**
     * Clear filter & sort
     * @date 2024-07-18 05:36
     * @authorhung.le
     *
     * @returns {void}
     */
    public clearFilterSort(): void {
        //check all
        this.isCheckAll = true;
        this.checkboxList.forEach((item) => {
            item.is_checked = true;
        });
        this.checkboxHistoryList = this.checkboxList.map(p => ({...p}));
        //clear search
        this.searchInput = '';
        this._searchInputHistory = '';
        //clear sort
        this.sortColumn = undefined;
        this.dataFilter = {
            column: this.columnName,
            search: '',
            sort: '',
            uncheck: []
        }
    }
}
