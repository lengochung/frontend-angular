import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SHARED_MODULE } from '../../includes/shared.module';
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
import { UserService } from '../../services/user.service';
import { UserEntity, UserSearchEntity } from '../../entities';
import Constants from '../../../utils/constants';
/**
 * Call modal
 * Declare NgbModal in constructor or inject(NgbModal)
 * private _modalService = inject(NgbModal);
 *
 * @see {@link https://ng-bootstrap.github.io/#/components/modal/examples}
 * const modalOpts = {
 *  centered: true,
 *  scrollable: true,
 *  backdrop: 'static',
 *  keyboard: false
 * };
 * const modal = this._modalService.open(ModalUserSelectComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalUserSelectComponent;
 * componentInstance.modalTitle = "?";
 */
@Component({
    standalone: true,
    imports: [SHARED_MODULE],
    template: `
        <div class="modal-header">
            <h4 class="modal-title">
                @if(modalTitle) {
                <span>{{ modalTitle }}</span>
                } @else {
                <span>ユーザーを選択</span>
                }
            </h4>
        </div>
        <div class="modal-body">
            <ng-select
                [items]="userListDisplay"
                [bindLabel]="'user_first_name'"
                [bindValue]="'user_id'"
                [notFoundText]="'message.no_data' | translate"
                [typeToSearchText]="'label.type_to_search' | translate"
                [appendTo]="'.modal-header'"
                [clearable]="false"
                [placeholder]="''"
                [typeahead]="inputSearch$"
                (scrollToEnd)="fetchMore()"
                (change)="onChanged($event)"
                (close)="onCloseSelect()"
            >
                <ng-template ng-label-tmp let-item="item">
                    <span>{{
                        item.user_first_name + ' ' + item.user_last_name
                    }}</span>
                </ng-template>
                <ng-template ng-option-tmp let-item="item">
                    <span>{{
                        item.user_first_name + ' ' + item.user_last_name
                    }}</span>
                </ng-template>
            </ng-select>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onOk()"><i class="fas fa-check"></i> {{'label.ok' | translate}}</button>
            <button type="button" class="btn btn-danger" (click)="activeModal.close('Close click')"><i class="fas fa-times"></i> {{'label.close' | translate}}</button>
        </div>
    `,
})
export class ModalUserSelectComponent implements OnInit, OnDestroy {
    @Input() ignoreUserIdList: number[] = [];
    @Output() userChange = new EventEmitter<UserEntity>();
    public modalTitle = '';
    public isLoading = false;
    public inputSearch$ = new Subject<string>();
    public allUserList: UserEntity[] = [];
    public userListDisplay: UserEntity[] = [];
    public selectedUser?: UserEntity;
    private _subscriptionList: Subscription[] = [];
    private _currentPage = 1;
    private _keyword = '';
    private _isStopFetch = false;
    private _totalRow = 0;

    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
        private _userService: UserService
    ) {}
    /**
     * @return {void}
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
     * select changed
     * @authorhung.le
     *
     * @param {UserEntity} user selected user
     * @returns {void}
     */
    public onChanged(user: UserEntity): void {
        this.selectedUser = user;
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
                    if (Lib.isBlank(term)) {
                        this.isLoading = false;
                        this._keyword = '';
                        this._isStopFetch = false;
                        return of(false);
                    }
                    const params = {} as UserSearchEntity;
                    params.keyword = term;
                    this._currentPage = 1;
                    return this._userService.getAllUserList(params).pipe(
                        map((p) => {
                            if (!p.status || !p.data) {
                                return false;
                            }
                            const data = {
                                totalRow: p.total_row,
                                data: p.data
                            }
                            return data;
                        }),
                        catchError(() => of(false)), // empty list on error
                        tap(() => (this.isLoading = false))
                    );
                })
            )
            .subscribe((data: { totalRow: number; data: UserEntity[]; } | boolean) => {
                if (typeof data === 'object') {
                    this.allUserList = data.data;
                    this.userListDisplay = this.allUserList.filter(user => {
                        return !this.ignoreUserIdList.includes(user.user_id ?? 0);
                    });
                    this._totalRow = data.totalRow;
                    this._isStopFetch = data.totalRow <= Constants.PAGINATE_LIMIT;
                } else {
                    this.allUserList = [];
                    this.userListDisplay = [];
                }
            });
        this._subscriptionList.push(sub);
    }

    /**
     * fetch more user
     * @authorhung.le
     *
     * @returns {void}
     */
    public fetchMore(): void {
        if (this._isStopFetch) return;
        this._currentPage++;
        const params = {
            keyword: this._keyword,
            page: this._currentPage
        }
        const sub = this._userService.getAllUserList(params).subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    this._isStopFetch = true;
                    return
                }
                this.allUserList?.push(...rsp.data);
                this.allUserList = [...this.allUserList];
                if (this.allUserList.length >= this._totalRow) this._isStopFetch = true;
                this.userListDisplay = this.allUserList.filter(user => {
                    return !this.ignoreUserIdList.includes(user.user_id ?? 0);
                });
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * onOk
     * @return {void}
     */
    public onOk(): void {
        if (!this.selectedUser) return;
        this.userChange.emit(this.selectedUser);
        this.activeModal.close('Close click');
    }

    /**
     * onClose
     * @return {void}
     */
    public onCloseSelect(): void {
        this.userListDisplay = [];
    }
}
