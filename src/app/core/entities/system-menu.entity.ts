import BaseEntity from './base.entity';
export class SystemMenuEntity extends BaseEntity {
    id?: number;
    name?: string;
    desc?: string;
    link?: string;
    total?: number;
    child?: Array<SystemMenuEntity>;
}
