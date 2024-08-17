import { Component, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncSubject, Observable, Subscription } from 'rxjs';
import Lib from '../../../utils/lib';
import { UploadFile } from '../../entities';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    standalone: true,
    imports: [
        TranslateModule,
        CommonModule
    ],
})
export class UploadComponent implements OnInit, OnChanges, OnDestroy {
    private _subscriptionList: Subscription[] = [];

    /** extension file */
    // @Input() acceptType = '.jpg, .png, .jpeg';
    @Input() acceptType = '*';
    /** max file select */
    @Input() isMultiple = false;
    @Input() multiple = 20;
    /** max size select */
    @Input() maxSize = 1000;
    /** Disable / enable */
    @Input() disabled = false;
    /** Error message from parent component */
    @Input() errorMessage = '';
    @Input() hasError = false;
    /** Emit selected file change */
    @Output() selectedFilesChange = new EventEmitter<UploadFile[]>();
    /** processing upload file */
    @Input() processingUploads: UploadFile[]|undefined = [];

    // list file image preview
    public selectedFiles: UploadFile[] = [];

    // message error
    public messageErr: string[] = [];

    @ViewChild('inputUpload') private _inputUpload?: ElementRef<HTMLElement>;

    /**
     * constructor
     */
    constructor(private _translate: TranslateService) {
    }

    /**
     * On Change input
     * @param {SimpleChanges} changes SimpleChanges
     * @return {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['processingUploads']?.currentValue) {
            this.selectedFiles = this.processingUploads ?? [];
            this._emitFile();
        }
    }

    /**
     * @return {void}
     */
    ngOnInit(): void {
        if(this.processingUploads)
            this.selectedFiles = this.processingUploads;
    }

    /** @returns {void} */
    ngOnDestroy(): void {
        if (this._subscriptionList.length >= 0) {
            this._subscriptionList.forEach((sub) => sub.unsubscribe());
        }
    }

    /**
     * file select change
     * @authorhung.le
     *
     * @param {Event} event event
     * @returns {void}
     */
    public onFileSelect(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        const files: FileList | null = element.files;

        if (files === null || files.length === 0) return;
        this.messageErr = [''];

        // check max file selected
        if(this.isMultiple) {
            if (this.multiple > 1 && files && files?.length + this.selectedFiles.length > this.multiple) {
                const errMultiple = this._translate.instant('message.err_max_num_file_selected', { max: this.multiple }) as string;
                this.messageErr.push(errMultiple);
                element.value = '';
                return;
            }
        }

        // check accept type
        const acceptTypeFileList: File[] = [];
        const arrayAcceptType = this.acceptType.split(',').map((item) => item.trim().slice(1));
        if (files != null) {
            for (let index = 0; index < files.length; index++) {
                if(this.acceptType == "*") {
                    acceptTypeFileList?.push(files[index]);
                } else if (Lib.checkExtensionFile(files[index].name, arrayAcceptType)) {
                    acceptTypeFileList?.push(files[index]);
                } else {
                    const errMaxSize = this._translate.instant('message.err_accept_type', { name: files[index].name, type: this.acceptType }) as string;
                    this.messageErr.push(errMaxSize);
                }
            }
        }

        // check exist file name with file.action = 2 (exists on server backend)
        const acceptFileNameList: File[] = [];
        if (acceptTypeFileList.length > 0) {
            for (let index = 0; index < acceptTypeFileList.length; index++) {
                const file = acceptTypeFileList[index];
                const fileFound = this.selectedFiles.find(f => f.name == file.name && f.action == 2);
                if (fileFound) {
                    const errMaxSize = this._translate.instant('message.err_exist_file_selected', { name: acceptTypeFileList[index].name }) as string;
                    this.messageErr.push(errMaxSize);
                } else {
                    acceptFileNameList?.push(acceptTypeFileList[index]);
                }
            }
        }
        // check max size can selected
        const acceptFileSizeList: File[] = [];
        if (acceptFileNameList.length > 0) {
            for (let index = 0; index < acceptFileNameList.length; index++) {
                if (acceptFileNameList[index].size > this.maxSize * 1024 * 1024) {
                    const errMaxSize = this._translate.instant('message.err_max_size_file_selected', { name: acceptFileNameList[index].name, max: this.maxSize }) as string;
                    this.messageErr.push(errMaxSize);
                } else {
                    acceptFileSizeList?.push(acceptFileNameList[index]);
                }
            }
        }

        if (acceptFileSizeList.length !== 0) {
            this._toFilesBase64(acceptFileSizeList, this.selectedFiles).subscribe((res: UploadFile[]) => {
                if (res.length > 0) {
                    this.selectedFiles = res;
                    this._emitFile();
                }
                element.value = '';
            });
        }
    }

    /**
     * to File base64
     * @authorhung.le
     *
     * @param {File[]} files file
     * @param {UploadFiles[]} selectedFiles selectedFiles
     * @returns {Observable<SelectedFiles[]>} observable
     */
    private _toFilesBase64(files: File[], selectedFiles: UploadFile[]): Observable<UploadFile[]> {
        const result = new AsyncSubject<UploadFile[]>();
        let countOnload = 0;
        if (files?.length) {
            for (let i = 0; i < files?.length; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(files[i]);
                reader.onload = () => {
                    countOnload++;
                    selectedFiles = selectedFiles?.filter((f) => f?.name !== files[i]?.name);
                    const file: UploadFile = { name: files[i]?.name, file: files[i], base64: reader?.result as string };
                    if (this.multiple === 1) {
                        selectedFiles = [file];
                    } else {
                        selectedFiles.push(file);
                    }
                    result.next(selectedFiles);
                    if (files?.length === countOnload) {
                        result.complete();
                    }
                };
            }
            return result;
        }
        result.next([]);
        result.complete();
        return result;
    }

    /**
     * Remove file from list
     * @authorhung.le
     *
     * @param {UploadFile} file UploadFile
     * @returns {void}
     */
    public removeFile(file: UploadFile): void {
        if(!file.action || file.action === 0) {
            this.selectedFiles = this.selectedFiles.filter(f => f.name !== file.name);
        } else {
            file.action = 1;
        }
        this._emitFile();
        this.messageErr = [''];
    }
    /**
     * Revert file from list
     * @author hung.le
     *
     * @param {UploadFile} file UploadFile
     * @returns {void}
     */
    public revertFile(file: UploadFile): void {
            file.action = file.isClone ? 2 : 0;
            this._emitFile();
            this.messageErr = [''];
    }

    /**
     * Emit output file
     * @authorhung.le
     * @returns {void}
     */
    private _emitFile(): void {
        this.selectedFilesChange.emit(this.selectedFiles);
    }

    /**
     * reset file
     * @authorhung.le
     *
     * @public
     * @returns {void}
     */
    public resetFile(): void {
        this.messageErr = [''];
        // Keep files from server
        this.selectedFiles = this.selectedFiles.filter(file => file.isClone);
        this.selectedFiles.forEach(file => {
            if(file.isClone && file.action === 1) file.action = 2;
        });
        this.selectedFilesChange.emit(this.selectedFiles);
    }

    /**
     * trigger click from parent
     * @authorhung.le
     *
     * @public
     * @returns {void}
     */
    public onSelectFile(): void {
        const el: HTMLElement | undefined = this._inputUpload?.nativeElement;
        if (el) {
            el.click();
        }
    }

    /**
     * Get processing number uploading
     * @param {UploadFile} file UploadFile
     * @returns {string|null} process percent
     */
    public getProcessingPercent (file: UploadFile): string|null {
        if(this.processingUploads && this.selectedFiles && this.processingUploads.length > 0 && this.selectedFiles.length > 0)
        {
            const fileProcess = this.processingUploads.find(f => f.name === file?.name);
            if(fileProcess) {
                return fileProcess.process_percent ? `${fileProcess.process_percent}%` : null;
            }
        }
        return null;
    }

}

