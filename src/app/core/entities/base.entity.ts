import { UploadedDataEntity } from "./upload.file.entity";

export default class BaseEntity {
    page?: number;
    is_new?: boolean;
    add_datetime?: string;
    upd_datetime?: string;
    add_user_id?: number;
    upd_user_id?: number;
    isPaginate?: boolean;
    isEdit?: boolean;
    /**
     * Action type handle in backend
    * 0: create new, 1: update, 2: synch, 3: other
    */
    edit_type?: number;
    /**
     * UploadFile synched pending
     */
    synchedFilesData?: UploadedDataEntity;
}
