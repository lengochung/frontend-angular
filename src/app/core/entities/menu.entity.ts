export class MenuEntity{
    id?: number;
    name?: string;
    link?: string;
    icon?: string;
    parent_id?: number;
    active?: string;
    menu_open?: boolean;
    child?: Array<MenuEntity>;
}