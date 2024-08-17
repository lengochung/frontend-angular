/* eslint-disable require-jsdoc */
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Lib from '../../../utils/lib';
interface checkboxOpts {
    id?: string | number,
    name?: string,
    is_checked?: boolean,
    disabled?: boolean
}
@Component({
    selector: 'app-checkbox',
    template: `
        <div class="ck-items icheck-dark {{display}} {{className}}" *ngFor="let item of checkboxList">
            <input
                type="checkbox"
                id="{{checkboxId}}_{{item?.id}}"
                [checked]="item.is_checked"
                [disabled]="item.disabled ? item.disabled : disabled"
                (change)="onCheckboxChanged(item, $event)"
            >
            <label for="{{checkboxId}}_{{item?.id}}">{{item?.name}}</label>
        </div>
    `,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CheckboxComponent,
        },
    ],
    styles: [`
        .ck-items.inline {
            display: inline-block;
            margin-right: 10px;
        }
        .ck-items.inline:last-child {
            margin-right: 0;
        }
        .ck-items.block {
            display: block;
        }
    `]
})

export class CheckboxComponent implements ControlValueAccessor {
    /** CSS class for every checkbox in the list */
    @Input() className = '';
    /** Checkbox data list */
    @Input() checkboxList: Array<checkboxOpts> = [];
    /**
     * Nhận lại kết quả cho checkbox là string hay object
     * Nếu là string thì input cho component là string
     * Nếu là object thì input cho componen là object và giá trị object này sẽ là mảng danh sách id checkbox được checked
     * Ví dụ:
     * <app-checkbox
     *  formControlName="controll name"
     *  [resultBack]="string or object"
     *  [checkboxList]="checkboxList"
     * ></app-checkbox>
     */
    @Input() resultBack = 'string';
    /**
     * Checkbox hiển thị là inline hay block
     * Chỉ có 2 giá trị là: inline hoặc block
     * Mặc định là inline
     */
    @Input() display = 'inline';
    /** A general HTML id for every checkbox in the list, item id is appended into this */
    public checkboxId = Lib.randomString();
    /** The disabled status for every checkbox in this list */
    @Input() disabled = false;
    /**
     * Invoked when one of the checkboxes in the list is changed
     * This function is used to save the function provided by the formsAPI in `registerOnChange`. When data is changed, call this function
     * 
     * @param {checkboxOpts} checkboxItem new item list when a checkbox is changed
     * 
     * @returns {void}
     */
    private _onChanged = (checkboxItem: Array<string | number> | string | null): void => { }

    /**
     * Invoked when one of the checkboxes in the list is touched
     * @returns {void}
     */
    private _onTouched = (checkboxItem: Array<string | number> | string | null): void => { }

    /** Constructor */
    constructor() {
    }
    /**
     * On one checkbox is changed
     * 
     * @param  {checkboxOpts} cheboxItem    checkbox item
     * @param  {Event} event                HTML input event
     * @returns {void}
     */
    public onCheckboxChanged(cheboxItem: checkboxOpts, event: Event): void {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked;
        if (this.checkboxList.length <= 0) {
            return;
        }
        this.checkboxList.forEach((item) => {
            if (item.id == cheboxItem.id) {
                item.is_checked = isChecked;
            }
        });
        let selectedIds: Array<string | number> | string | null = null;
        const checkedList = this.checkboxList.filter((item: checkboxOpts) => item.is_checked).map((item: checkboxOpts)=>item.id) as Array<string|number>;
        if(checkedList && checkedList.length > 0) {
            selectedIds = checkedList;
        }
        if (this.resultBack === 'string' && selectedIds) {
            selectedIds = selectedIds.toString();
        }
        //tell the forms API that the data was changed
        this._onChanged(selectedIds);
    }
    /**
     * Nhận giá trị value từ control, giá trị này là một string hoặc array
     * Nếu là string thì các id checkbox phải được phân cách bằng dấu ","
     * Nếu là array thì format là [id1, id2, id3]
     * 
     * @param {string | Array} values  các id checkbox
     * 
     * @returns {void}
     */
    writeValue(values: Array<string | number> | string): void {
        if (values) {
            let checkboxIds: Array<string|number> = [];
            if (typeof values === 'string') {
                checkboxIds =  Lib.strSplitSpace(values);
            } else if (
                typeof values === 'object'
                && this.checkboxList.length > 0
                && Array.isArray(values)
                && values.length > 0
            ) {
                checkboxIds = values;
            }
            if (checkboxIds.length <= 0) {
                return;
            }
            this.checkboxList.map((item: checkboxOpts) => checkboxIds.includes((item.id ? item.id : '')) ? item.is_checked = true : item.is_checked = false);
        }
    }
    /**
     * register on change
     * 
     * @param {function} fn function
     * @returns {void}
     */
    registerOnChange(fn: (checkboxItem: Array<string | number> | string | null) => void): void {
        this._onChanged = fn;
    }
    /**
     * register on touched
     * 
     * @param {function} fn function
     * @returns {void}
     */
    registerOnTouched(fn: (checkboxItem: Array<string | number> | string | null) => void): void {
        this._onTouched = fn;
    }
}
