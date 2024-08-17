import {
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SHARED_MODULE } from '../../includes/shared.module';
import { MalfunctionsEntity } from '../../entities';
import Constants from '../../../utils/constants';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
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
 * const modal = this._modalService.open(ModalMalfunctionSelectComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalMalfunctionSelectComponent;
 * componentInstance.modalTitle = "?";
 */
@Component({
    standalone: true,
    imports: [SHARED_MODULE, AutocompleteComponent],
    template: `
        <div class="modal-header">
            <h4 class="modal-title">
                @if(modalTitle) {
                <span>{{ modalTitle }}</span>
                } @else {
                <span>{{'label.select_malfunction' | translate}}</span>
                }
            </h4>
        </div>
        <div class="modal-body">
            <app-autocomplete
                [(ngModel)]="model"
                [searchUrl]="Constants.API_URL.MALFUNCTIONS.DROPDOWN"
                [bindLabel]="'subject'"
                [bindValue]="'malfunction_no'"
                (selectChange)="onSelectChange($event)"
                [appendTo]="'.modal-header'"
                [clearable]="true"
            ></app-autocomplete>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onOk()"><i class="fas fa-check"></i> {{'label.ok' | translate}}</button>
            <button type="button" class="btn btn-danger" (click)="activeModal.close('Close click')"><i class="fas fa-times"></i> {{'label.close' | translate}}</button>
        </div>
    `,
})
export class ModalMalfunctionSelectComponent implements OnInit {

    @Output() selectChange = new EventEmitter<MalfunctionsEntity>();
    public modalTitle = '';
    public model = null;
    public malfunctionSelected?: MalfunctionsEntity;
    public readonly Constants = Constants;

    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
    ) {}
    /**
     * @return {void}
     */
    ngOnInit(): void {
        return;
    }

    /**
     * Selected changed
     * @date 2024/07/25 11:20
     * @authorhung.le
     *
     * @public
     * @param {MalfunctionsEntity} item malfunction selected
     * @returns {void}
     */
    public onSelectChange(item: MalfunctionsEntity): void {
        this.malfunctionSelected = item;
    }

    /**
     * onOk
     * @return {void}
     */
    public onOk(): void {
        this.selectChange.emit(this.malfunctionSelected);
        this.activeModal.close('Close click');
    }

}
