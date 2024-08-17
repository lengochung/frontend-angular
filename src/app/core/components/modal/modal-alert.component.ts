import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
/**
 * Call modal
 * Declare NgbModal in constructor or inject(NgbModal)
 * private _modalService = inject(NgbModal);
 * 
 * @see {@link https://ng-bootstrap.github.io/#/components/modal/examples}
 * const modalOpts = {
 *  centered: true,
 *  scrollable: true,
 * };
 * const modal = this._modalService.open(ModalAlertComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalAlertComponent;
 * componentInstance.confirm.subscribe((status: boolean) => {
 *  console.log('status: ', status);
 * });
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
    ],
    template: `
        <div class="modal-header">
            <h4 class="modal-title">
                @if(modalTitle) {
                    <span>{{modalTitle}}</span>
                } @else {
                    <span>{{'label.notify' | translate}}</span>
                }
            </h4>
            <button type="button" class="close" aria-label="Close" (click)="closeModal(false)">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            @if(message) {
                <div class="nofify" [innerHtml]="message"></div>
            }
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="closeModal(true)"><i class="fas fa-check"></i> {{'label.ok' | translate}}</button>
        </div>
	`,
})
export class ModalAlertComponent{
    public message = "";
    public modalTitle = "";
    @Output() confirm = new EventEmitter<boolean>(false);
    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
    ) {}
    /**
     * Close modal and output status to parent components
     * @param  {boolean} status true => user clicked "OK"
     * @returns {void}
     */
    public closeModal(status: boolean): void {
        this.confirm.emit(status);
        this.activeModal.close('Close click');
    }
}
