export interface UploadFile {
    name: string;
    file: File;
    base64?: string;
    type?: string;
    /**
     * 0: new, 1: delete, 2: clone
     */
    action?: number;
    isClone?: false;
    /**
     *
     */
    attachment_file?: string;
    file_path?: string;
    folderPath?: string;
    chunk?: number;
    chunks?: number;

    /**
     * Process loading percent
     */
    process_percent?: number
}

export class UploadedDataEntity {
    synchedFiles?: UploadFile[];
    index?: number;
    attached_file?: string;
    keyRandom?: string;
    folderPath?: string;
    /**
     * ? boolean if true => files được tải lên nhưng chờ submit form thành công thì mới cập nhật file vào thư mục filePath
     *  if false => files được tải lên và lưu vào thư mục filePath
     */
    isPendingSubmit?: boolean;
    files?: UploadFile[];
    uploadUrl?: string;
    deleteUrl?: string;
}
