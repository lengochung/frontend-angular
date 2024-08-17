import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SubjectEntity } from '../../entities';
import { SubjectService } from '../../services';
import { CommonService } from '../../services/common.service';
import { ModalConfirmComponent } from '../modal/modal-confirm.component';
import Constants from '../../../utils/constants';
import Lib from '../../../utils/lib';
import { ToastrService } from 'ngx-toastr';
/**
 * Component for deleting multiple records.
 * To use this component, include it in the template as follows:
 * <app-multiple-delete
 * [dataList] = "dataList"
 * [key] = "'key'"
 * [deleteUrl] = "api delete url">
 * </app-multiple-delete>
 *
 * Listens to events from the parent component through 'eventsSubject.asObservable()'.
 * The name 'eventsSubject' can be customized by the parent component; see the description of 'eventsSubject' in base.component.ts.
 * Other properties are described below.
 *
 * @author hung.le 2024/03/25
 */
@Component({
    selector: 'app-multiple-delete',
    standalone: true,
    imports: [
        TranslateModule,
    ],
    template: `
        <button class="btn btn-danger mr-2" [disabled]="disabled" type="button" (click)="onDelete()">
            <i class="fas fa-trash-alt mr-2"></i>{{'label.delete' | translate}}
        </button>
    `,
})
export class MultipleDeleteComponent implements OnInit, OnDestroy, OnChanges {
    private _subscriptionList: Subscription[] = [];
    //List of items passed from the parent component
    @Input() dataList: Array<any> = [];
    //Disabled delete button
    public disabled = true;
    //Confirmation message for delete action
    @Input() deleteMessage = this._translate.instant('message.delete_confirm') as string;
    /**
     * Key of the object in the list. For example, if the list has objects like [{user_name: 'user1', full_name: 'User1'}],
     * the key would be 'user_name'.
     */
    @Input() key = "";
    //API URL for deleting items
    @Input() deleteUrl = "";
    /**
     * Determines whether the result of deletion should be a list of keys or a list of deleted items.
     * true: list of keys, false: list of items
     */
    @Input() resultBack = false;
    //Emits the deleted items to the parent component
    @Output() deletedItems: EventEmitter<any>;
    //Reference to the check all checkbox
    @Input() checkAllRef!: HTMLInputElement;
    /** Constructor */
    constructor(
        private _modalService: NgbModal,
        private _translate: TranslateService,
        private _commonService: CommonService,
        private _subjectService: SubjectService,
        private _toastrService: ToastrService
    ) {
        this.deletedItems = new EventEmitter<any>();
    }

    /** @returns {void} */
    ngOnInit(): void {
        const sub = this._subjectService.getSubject.subscribe((subjectE: SubjectEntity) => {
            if(subjectE.key !== Constants.SUBJECT_KEY.MILTIPLE_DELETE) {
                return;
            }
            this.getEvents(subjectE.data)
        });
        this._subscriptionList.push(sub);
    }
    /** @returns {void} */
    ngOnDestroy(): void {
        if (this._subscriptionList.length >= 0) {
            this._subscriptionList.forEach((sub) => sub.unsubscribe())
        }
    }
    /**
     * Executes after Angular sets the input properties.
     * Called before ngOnInit() and whenever one or more data-bound input properties change.
     *
     * @param {SimpleChanges} changes   SimpleChanges
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        for (const property in changes) {
            if (!Lib.isNull(property) && 'dataList' === property && !changes[property].firstChange) {
                this._resetControl();
                break;
            }
        }
    }
    /**
     * Disables the delete button and unchecks the 'check all' checkbox.
     *
     * @returns {void}
     */
    private _resetControl(): void{
        this.disabled = true;
        if(this.checkAllRef) {
            this.checkAllRef.checked = false;
        }
    }
    /**
     * Listens to events from the parent component.
     *
     * @param {object} data {
     *      event: Event,//the change event object
     *      row_item: object,//the currently selected row when clicking a checkbox in the list
     * }
     *
     * @returns {void}
     */
    public getEvents(data: any): void {
        if (!data) {
            return;
        }
        const event = data['event'] as Event;
        const rowItem: any = data['row_item'];
        this.onCheckboxChange(event, rowItem);
    }
    /**
     * Sets the item in the list as checked when clicking on the 'check all' checkbox or an item in the list.
     *
     * @param {object} event     The click event object
     * @param {any} dataE        The selected object in the list
     *
     * @returns {void}
     */
    public onCheckboxChange(event: Event, dataE: any): void {
        if (
            !event
            || !this.dataList
            || !Array.isArray(this.dataList)
            || this.dataList.length <= 0
        ) {
            return;
        }
        if (!dataE) {
            const checkAll = event.target as HTMLInputElement;
            this.dataList.map((item: any) => {
                item['is_checked'] = checkAll.checked;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item;
            });
        } else if (dataE) {
            dataE['is_checked'] = !dataE['is_checked'];
        }
        const selectedItems = this.dataList.filter((item: any) => {
            if (!Lib.isNull(item['default_account']) && Number(item['default_account']) === 1) {
                return false;
            }
            if (item['is_checked']) {
                return true;
            }
            return false;
        });
        if (selectedItems && selectedItems.length > 0) {
            this.disabled = false;
        } else {
            this._resetControl();
        }
    }
    /**
     * Deletes the selected items.
     *
     * @returns {void}
     */
    public onDelete(): void {
        if (Lib.isBlank(this.key) || Lib.isBlank(this.deleteUrl)) {
            return;
        }
        const deleteItems = this.dataList.filter((item: {[key: string] : any}) => {
            if (!Lib.isNull(item['default_account']) && Number(item['default_account']) === 1) {
                return false;
            }
            if (item['is_checked']) {
                return true;
            }
            return false;
        });
        if (!deleteItems || deleteItems.length <= 0) {
            return;
        }
        const cloneDeleteItems = [...deleteItems];
        //Get the keys in the list
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const keys = deleteItems.map((item: {[key: string] : any}) => item[this.key]) as Array<string | number>;
        if (!Lib.isValidArrayData(keys)) {
            this.deletedItems.emit(null);
            return;
        }
        const modal = this._modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        const modalInstance = modal.componentInstance as ModalConfirmComponent;
        modalInstance.message = this.deleteMessage;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        modalInstance.confirm.subscribe(async (status: boolean) => {
            if (!status) {
                return;
            }
            const params = {
                delete_ids: keys
            };
            const result = await this._commonService.multipleDelete(this.deleteUrl, params);
            if (!result.status) {
                this._toastrService.error(this._translate.instant('message.delete_failed') as string);
                return;
            }
            this._toastrService.success(this._translate.instant('message.delete_successfully') as string);
            //Remove items from the list
            for(let i=0; i<keys.length; i++) {
                const delIndex = this.dataList.findIndex((item: any) => (item[this.key] ? item[this.key] : '') === keys[i]);
                if (delIndex < 0) {
                    continue;
                }
                this.dataList.splice(delIndex, 1);
            }
            if (this.resultBack) {
                this.deletedItems.emit(keys);
            } else {
                this.deletedItems.emit(cloneDeleteItems);
            }
            this._resetControl();
        });
    }
}
