import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
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
import Lib from '../../../utils/lib';
import { CommonService } from '../../services';

@Component({
    selector: 'app-autocomplete',
    template: `
    @if (Lib.isBlank(searchUrl)) {
        <ng-select
            [(ngModel)]="model"
            [items]="items"
            [bindLabel]="bindLabel"
            [bindValue]="bindValue"
            [multiple]="multiple"
            [notFoundText]="'message.no_data' | translate"
            [typeToSearchText]="'label.type_to_search' | translate"
            [appendTo]="'body'"
            [clearable]="clearable"
            [placeholder]="placeholder"
            (change)="onChanged($event)"
            [disabled]="isDisabled"
        >
        @if(multiple) {
            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{ index }}"
                    type="checkbox"
                    [ngModelOptions]="{ standalone: true }"
                    [ngModel]="item$.selected"
                />
                {{ item[bindLabel] }}
            </ng-template>
        }
    </ng-select>
    } @else {
        <ng-select
            [(ngModel)]="model"
            [items]="items"
            [bindLabel]="bindLabel"
            [bindValue]="bindValue"
            [multiple]="multiple"
            [notFoundText]="'message.no_data' | translate"
            [typeToSearchText]="'label.type_to_search' | translate"
            [appendTo]="appendTo"
            [clearable]="clearable"
            [placeholder]="placeholder"
            [typeahead]="inputSearch$"
            (change)="onChanged($event)"
            [disabled]="isDisabled"
        >
        @if(multiple) {
            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{ index }}"
                    type="checkbox"
                    [ngModelOptions]="{ standalone: true }"
                    [ngModel]="item$.selected"
                />
                {{ item[bindLabel] }}
            </ng-template>
        }
    </ng-select>
    }
    `,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AutocompleteComponent,
        },
    ],
    imports: [NgSelectModule, FormsModule, TranslateModule],
})
export class AutocompleteComponent
    implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
    @Input() items: any[] | null = [];
    @Input() bindLabel = '';
    @Input() bindValue = '';
    @Input() clearable = true;
    @Input() placeholder = '';
    @Input() searchUrl = '';
    @Input() appendTo = 'body';
    @Input() multiple = false;
    @Input() params?: any;
    @Output() selectChange = new EventEmitter<any>();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private _onChange: any = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private _onTouched: any = () => {};
    private _defaultItems: any[] | null = [];
    private _subscriptionList: Subscription[] = [];
    public isDisabled = false;
    public model?: number | string;
    public isLoading = false;
    public inputSearch$ = new Subject<string>();
    public readonly Lib = Lib;

    /**
     * @constructor
     */
    constructor(private _commonService: CommonService) {}

    /**
     * ControlValueAccessor - model input value change
     *
     * @param {any} obj obj
     * @returns {void}
     */
    writeValue(obj: any): void {
        this.model = obj;
    }

    /**
     * ControlValueAccessor - register on change callback
     *
     * @param {any} fn function
     * @returns {void}
     */
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    /**
     * ControlValueAccessor - register on touched callback
     *
     * @param {any} fn function
     * @returns {void}
     */
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    /**
     * ControlValueAccessor - disable control change
     *
     * @param {boolean} isDisabled isDisabled
     * @returns {void}
     */
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
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
     * ngselect changed
     *
     * @param {any} data data select change
     * @returns {void}
     */
    public onChanged(data: any): void {
        this._onChange(this.model);
        this.selectChange.emit(data);
    }

    /**
     * Get data list
     * @returns {void}
     */
    private _getDataList(): void {
        const sub = this.inputSearch$
            .pipe(
                distinctUntilChanged(),
                debounceTime(500),
                tap(() => (this.isLoading = true)),
                switchMap((term) => {
                    if (Lib.isBlank(term) || !this.searchUrl) {
                        this.isLoading = false;
                        return of(this._defaultItems);
                    }
                    if (!Lib.isObject(this.params)) {
                        this.params = {};
                    }
                    const params = {...this.params};
                    params.keyword = term;

                    return this._commonService
                        .getData<any>(this.searchUrl, params)
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
            )
            .subscribe((data) => {
                this.items = data;
            });
        this._subscriptionList.push(sub);
    }
}
