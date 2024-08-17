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
 *  backdrop: 'static',
 *  keyboard: false
 * };
 * const modal = this._modalService.open(ModalConfirmComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalConfirmComponent;
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
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="nofify" [innerHtml] = "message"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="ok()">
                <i class="fas fa-check"></i>
                @if(okText) { {{okText}} } @else { {{'label.ok' | translate}} }
            </button>
            <button type="button" class="btn btn-danger" (click)="activeModal.close('Close click')">
                <i class="fas fa-times"></i>
                @if(cancelText) { {{cancelText}} } @else { {{'label.close' | translate}} }
            </button>
        </div>
	`,
})
export class ModalConfirmComponent {
    @Output() confirm = new EventEmitter<boolean>(false);
    public message = "";
    public modalTitle = "";
    public okText = "";
    public cancelText = "";
    /**
     *
     * @param {NgbActiveModal} activeModal - NgbActiveModal
     */
    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }
    /**
     * Close modal
     *
     * @return {void}
     */
    public ok(): void{
        this.confirm.emit(true);
        this.activeModal.close('Close click');
    }
}
