import BaseEntity from './base.entity';
export class UserEntity extends BaseEntity {
    user_id?: number;
    office_id?: number;
    user_first_name?: string;
    user_last_name?: string;
    employee_no?: string;
    affiliation?: string;
    position?: string;
    mail?: string;
    password?: string;
    password_update_date?: string;
    update_date?: string;
    access_token?: string;
    role_id?: number;
    role_name?: string;
    role_upd_datetime?: string;
    office_name?: string;
    office_subname?: string;
    role_update_date?: string;
    group_office_id?: number;

    /**
     * Extra field
     */
    user_fullname?: string;
}

export class UserSearchEntity extends BaseEntity {
    keyword?: string;
    user_ids?: number[];
}
