import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { JsonResultEntity, UploadedDataEntity, UploadFile } from "../entities";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UploadFileService extends BaseService {
    private UPLOAD_FILE_SIZE = 2*1024*1024;
    private UPLOAD_FILE_KEY = 'file';
    private UPLOAD_URL?: string;
    private DELETE_URL?: string;
    /**
     * Upload files
     * If file size <= config size => send file
     * If file size > config size => send chunk file, merge file when the last chunk finished
     * @param {UploadFile[]} files UploadFile[]
     * @param {UploadedDataEntity} params UploadedDataEntity
     * @param {string} uploadUrl string
     * @param {boolean} isPendingSubmit ? boolean
     * if true => files are uploaded but wait for the form to be submitted successfully before updating the files to the filePath folder
     * if false => files are uploaded and saved to the filePath folder
     * @returns {Promise<UploadedDataEntity>} Promise<UploadedDataEntity>
     * @author hung.le 2024/07/15
     */
    public async uploads(files: UploadFile[], params: UploadedDataEntity): Promise<UploadedDataEntity|null> {
        this.UPLOAD_URL = params.uploadUrl;
        this.DELETE_URL = params.deleteUrl;
        if(!params.folderPath) return null;
        if(!files) return null;
        // Files are going to be removed
        const removeFiles = files.filter(file => file.action == 1);
        // Files are going to be uploaded
        const uploadFiles = files.filter(file => !file.action || file.action == 0);
        /**
         *
         */
        let result = null;
        // Random key
        const keyRandom = this.Lib.randomString(30);
        // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
        await new Promise(async (resolve, reject) => {
            let synchedFiles: UploadFile[] = [];
            let index = 1;
            for (let i = 0; i < removeFiles.length; i++) {
                const file = removeFiles[i];
                const formData = new FormData();
                formData.append('folderPath', params.folderPath ?? '');
                formData.append('keyRandom', keyRandom);
                formData.append('fileName', file.name);
                const cloneBlob = new Blob([keyRandom], {type: 'text/plain'});
                formData.append(this.UPLOAD_FILE_KEY, cloneBlob, file.name);
                formData.append('isPendingSubmit', `${params.isPendingSubmit  }`);
                const resFile = await this.delete(formData);
                if(!resFile || !resFile.status || !resFile.data)
                    return reject(synchedFiles);
                if(resFile.data)
                    synchedFiles = [...synchedFiles, {
                        name: file.name,
                        file_path: `${params.folderPath  }/${  file.name}`,
                        action: 1
                    } as UploadFile
                ];
                files.forEach(f => {
                    if(f.name === file.name) {
                        f.process_percent = 100;
                    }
                });
                index++;
            }
            /**
             * Synched file by each
             */
            const smallFiles = files.filter(file => (file.action === 0 || !file.action) && file.file.size <= this.UPLOAD_FILE_SIZE);
            for (let i = 0; i < smallFiles.length; i++) {
                const file = smallFiles[i];
                const formData = new FormData();
                formData.append('folderPath', params.folderPath ?? '');
                formData.append('keyRandom', keyRandom);
                formData.append('fileName', file.name);
                formData.append('indexFile', `${index}`);
                formData.append('indexFileTotal', `${uploadFiles.length}`);
                formData.append('isPendingSubmit', `${params.isPendingSubmit  }`);
                formData.append(this.UPLOAD_FILE_KEY, file.file, file.name);
                const resFile = await this.save(formData);
                if(!resFile || !resFile.status || !resFile.data)
                    return reject(synchedFiles);
                if(resFile.data)
                    synchedFiles = [...synchedFiles, resFile.data];
                files.forEach(f => {
                    if(f.name === file.name) {
                        f.process_percent = 100;
                    }
                });
                index++;
            }
            const data = {
                synchedFiles,
                index
            };
            resolve(data);
        }).then(async data => {
            const uploadedData = data as UploadedDataEntity;
            let synchedFiles = uploadedData.synchedFiles as UploadFile[];
            let index = uploadedData.index ?? 1;
            const bigFiles = files.filter(file => (file.action === 0 || !file.action) && file.file.size > this.UPLOAD_FILE_SIZE);
            /**
             * Check array
             */
            if((!synchedFiles || synchedFiles.length == 0) && (!bigFiles || bigFiles.length == 0)) {
                return  Promise.resolve([]);
            }
            if(!bigFiles || bigFiles.length == 0) {
                return  Promise.resolve(synchedFiles);
            }

            /**
             * Synched chunks
             */
            for (let i = 0; i < bigFiles.length; i++) {
                const bigFile = bigFiles[i];
                const fileSize = bigFile.file.size;
                const chunks = Math.ceil(fileSize / this.UPLOAD_FILE_SIZE);
                const chunkFiles: UploadFile[] = [];

                let chunkIndex = 1;
                for (let start = 0; start < bigFile.file.size; start += this.UPLOAD_FILE_SIZE) {
                    const chunk = bigFile.file.slice(start, start + this.UPLOAD_FILE_SIZE);
                    const chunkFile = {} as UploadFile;

                    const fileNameTmp = `chunk${chunkIndex}.part`;
                    chunkFile.file = new File([chunk], fileNameTmp);
                    chunkFile.name = bigFile.name;
                    chunkFile.chunk = chunkIndex++;
                    chunkFile.chunks = chunks;
                    chunkFiles.push(chunkFile);
                }
                /**
                 * Send request chunks
                 */
                for (let k = 0; k < chunkFiles.length; k++) {
                    const file = chunkFiles[k];
                    const formData = new FormData();
                    formData.append(this.UPLOAD_FILE_KEY, file.file, file.name);
                    formData.append('chunk', `${file.chunk}`);
                    formData.append('chunks', `${file.chunks}`);
                    formData.append('folderPath', params.folderPath ?? '');
                    formData.append('keyRandom', keyRandom);
                    formData.append('fileName', bigFile.name);
                    formData.append('indexFile', `${index}`);
                    formData.append('indexFileTotal', `${uploadFiles.length}`);
                    formData.append('isPendingSubmit', `${params.isPendingSubmit}`);
                    const resFile = await this.save(formData);
                    if(!resFile || !resFile.status || !resFile.data) {
                        return Promise.reject(synchedFiles);
                    }
                    if(resFile.data) {
                        if(file.chunk === file.chunks) {
                            synchedFiles = [...synchedFiles, resFile.data];
                        }
                        files.forEach(f => {
                            if(f.name === bigFile.name) {
                                f.process_percent = Math.floor((k + 1) * 100 /chunkFiles.length);
                            }
                        });
                    }
                }
                index++;
            }
            return Promise.resolve(synchedFiles);

        // eslint-disable-next-line @typescript-eslint/require-await
        }).then(async data => {
            const synchedFiles = data ;
            // Get clone files (files not change)
            const cloneFiles = files.filter(file => file.action == 2).map(f => {
                return {
                    action: 2,
                    file_path: `${f.file_path  }/${  f.name}`,
                    name: f.name,
                } as UploadFile;
            });
            result = {
                synchedFiles: [...synchedFiles, ...cloneFiles],
                folderPath: params.folderPath
            } as UploadedDataEntity;
        // eslint-disable-next-line @typescript-eslint/require-await
        }).catch(async () => {
            result = null;
        });
        /**
         *
         */
        return result;
    }

    /**
     * Send file/chunk
     * @param {FormData} params FormData
     * @returns {JsonResultEntity} @var JsonResultEntity<string> filePath
     */
    private async save(params: FormData): Promise<JsonResultEntity<UploadFile>> {
        const opts = new this.HTTPOptions();
        opts.isUploadFile = true;
        const result = this.HHttp.post<UploadFile>(this.UPLOAD_URL ?? '', params, opts);
        return await this.returnHttpResponsePromise<UploadFile>(result);
    }
    /**
     * Remove file
     * @param {FormData} params FormData
     * @returns {JsonResultEntity} @var JsonResultEntity<string> filePath
     */
    private async delete(params: FormData): Promise<JsonResultEntity<UploadFile>> {
        const opts = new this.HTTPOptions();
        opts.isUploadFile = true;
        const result = this.HHttp.post<UploadFile>(this.DELETE_URL ?? '', params, opts);
        return await this.returnHttpResponsePromise<UploadFile>(result);
    }
    /**
     * Get files by folderPath
     * @param {UploadedDataEntity} params FormData
     * @returns {JsonResultEntity} @var JsonResultEntity<string> filePath
     */
    public getFiles(params: UploadedDataEntity): Observable<JsonResultEntity<UploadFile[]>> {
        const result = this.HHttp.post<UploadFile[]>(params.uploadUrl ?? '', params);
        return this.returnHttpResponseObservable<UploadFile[]>(result);
    }
    /**
     * Download file by file path
     * @param {UploadFile} params UploadFile
     * @returns {JsonResultEntity} @var JsonResultEntity<string> filePath
     * @author hung.le 2024/07/2024
     */
    public downloadFile(params: UploadFile): Observable<JsonResultEntity<UploadFile[]>> {
        const result = this.HHttp.post<UploadFile[]>(this.Constants.API_URL.FILES.DOWNLOAD, params);
        return this.returnHttpResponseObservable<UploadFile[]>(result);
    }
}
