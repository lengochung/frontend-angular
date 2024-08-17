import {
    AfterContentInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { FilterTableComponent } from '../components/filter-table/filter-table.component';
import { FilterEntity, FilterTableEntity } from '../entities/filter-table.entity';
import { Subscription } from 'rxjs';
import { ColumnFilterDirective } from './column-filter.directive';
import Lib from '../../utils/lib';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[tableFilter]',
    standalone: true,
})
export class TableFilterDirective implements OnInit, OnChanges, OnDestroy, AfterContentInit {
    private _subscriptionList: Subscription[] = [];
    @ContentChildren(ColumnFilterDirective, { descendants: true }) columnFilters?: QueryList<ColumnFilterDirective>;
    @Input() filterData?: FilterTableEntity;
    @Input() url?: string;
    @Output() filterChanged = new EventEmitter<FilterEntity>();

    private _filter: FilterEntity = {};

    private _filterComponentMap = new Map<string, FilterTableComponent>();

    /** Constructor */
    constructor(private viewContainerRef: ViewContainerRef, private cd: ChangeDetectorRef) {}

    /**
     * ngOnInit
     * @returns {void}
     */
    ngOnInit(): void {
        return;
    }

    /**
     * clear all filter & sort
     * @date 2024-07-18 05:33
     * @authorhung.le
     *
     * @returns {void}
     */
    public clearFilter(): void {
        this._filterComponentMap.forEach(component => {
            component.clearFilterSort();
        });
    }

    /**
     * ngAfterContentInit
     * @returns {void}
     */
    ngAfterContentInit(): void {
        this.columnFilters?.forEach((columnFilter) => {
            const filterTableComponentRef = this.viewContainerRef.createComponent(FilterTableComponent);
            const component = filterTableComponentRef.injector.get(FilterTableComponent);
            const filterSub = component.filterChanged.subscribe((p) => {
                if (p.column) {
                    if (!Lib.isBlank(p.sort)) {
                        this._filter.sort = { column: p.column, direction: p.sort };
                        this._filterComponentMap.forEach((item) => (item.sortColumn = { column: p.column, direction: p.sort }));
                    }

                    if (this._filter.search) {
                        this._filter.search[p.column] = p.search ?? '';
                    } else {
                        this._filter.search = {
                            [p.column ?? '']: p.search ?? '',
                        };
                    }

                    if (this._filter.filter) {
                        this._filter.filter[p.column] = p.uncheck ?? [];
                    } else {
                        this._filter.filter = {
                            [p.column ?? '']: p.uncheck ?? [],
                        };
                    }
                    this.filterChanged.emit(this._filter);
                }
            });
            this._subscriptionList.push(filterSub);

            const columnName = columnFilter.columnFilterName;
            if (columnName) {
                component.className = 'ml-2';
                component.columnName = columnName;
                component.displayData = columnFilter.displayData;
                component.url = this.url ?? '';
                this._filterComponentMap.set(columnName, component);

                const displaySub = columnFilter.displayDataChange.subscribe((p) => {
                    component.displayData = p;
                });
                this._subscriptionList.push(displaySub);

                const element = columnFilter.elementRef.nativeElement;

                const div: HTMLElement = document.createElement('div');
                while (element.firstChild) {
                    div.appendChild(element.firstChild);
                }
                const divParent: HTMLElement = document.createElement('div');
                divParent.className = 'd-flex';
                divParent.appendChild(div);
                divParent.appendChild(filterTableComponentRef.location.nativeElement);
                element.appendChild(divParent);
            }
        });
        this.cd.detectChanges(); // fix angular warning
    }

    /**
     * ngOnChanges
     * @authorhung.le
     *
     * @param {SimpleChanges} changes SimpleChanges
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['url']?.currentValue) {
            this._filterComponentMap.forEach((p) => (p.url = this.url ?? ''));
        }
    }

    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }
}
