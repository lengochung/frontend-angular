import {
    Directive,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
    Subject,
    Subscription,
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { CommonService } from '../services';
import Lib from '../../utils/lib';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'ng-select[autocomplete]',
    standalone: true,
})
export class AutocompleteDirective implements OnInit, OnChanges, OnDestroy {
    private _subscriptionList: Subscription[] = [];
    @Input() searchUrl = '';
    @Input() params?: any;
    @Input() items: any[] | null = null;
    public isLoading = false;
    public inputSearch$ = new Subject<string>();
    private _defaultItems: any[] | null = [];
    private _ngSelect: NgSelectComponent;

    /**
     * @constructor
     */
    constructor(
        public ngSelect: NgSelectComponent,
        private _commonService: CommonService
    ) {
        this._ngSelect = ngSelect;
        this._ngSelect.items = [];
        this._ngSelect.typeahead = this.inputSearch$;
        this._ngSelect.loading = this.isLoading;
    }

    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this._getDataList();
    }

    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * @param {SimpleChanges} changes change
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['items']?.currentValue) {
            this._defaultItems = this.items;
        }
    }

    /**
     * Get data list
     * @returns {void}
     */
    private _getDataList(): void {
        const sub = this.inputSearch$
            .pipe(
                distinctUntilChanged(),
                debounceTime(200),
                tap(() => (this.isLoading = true)),
                switchMap((term) => {
                    if (Lib.isBlank(term) || !this.searchUrl) {
                        this.isLoading = false;
                        return of(this._defaultItems);
                    }
                    if (!Lib.isObject(this.params)) {
                        this.params = {};
                    }
                    this.params.keyword = term;

                    return this._commonService
                        .getData<any>(this.searchUrl, this.params)
                        .pipe(
                            map((p) => {
                                if (!p.status || !p.data) {
                                    return [];
                                }
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return p.data;
                            }),
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.isLoading = false))
                        );
                })
            ).subscribe((data) => {
                this._ngSelect.items = data;
                this._ngSelect.ngOnChanges({
                    items: {
                        previousValue: [],
                        currentValue: data,
                        firstChange: false,
                        isFirstChange: () => false,
                    },
                });
                this._ngSelect.detectChanges();
            });
        this._subscriptionList.push(sub);
    }
}
