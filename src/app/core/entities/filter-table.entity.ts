import BaseEntity from "./base.entity";

export class FilterTableEntity {
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class FilterColumn {
    column?: string;
    uncheck?: string[];
    sort?: SortDirection;
    search?: string;
}

export class FilterEntity extends BaseEntity {
    sort?: SortEntity;
    filter?: {
        [key: string]: string[];
    };
    search?: {
        [key: string]: string;
    }
}

export class SortEntity {
    column?: string;
    direction?: SortDirection;
}

export class CheckboxEntity {
    name?: string;
    is_checked?: boolean;
}

export class FilterDisplay {
    id?: string | number;
    name?: string;
}

export type SortDirection = 'asc' | 'desc' | '';
