export class SubjectEntity<T = any>{
    /**
     * Key dùng để kiểm tra các subject là loại nào
     * khi Xử lý luồng dữ liệu bất đồng bộ dùng RxJS để gửi dữ liệu multicast tới nhiều Observables cùng lúc.
     * Vì các component sẽ nhận được cùng giá trị dữ liệu khi supscription vì thế cần phải có key để kiểm tra nó là loại nào.
     */
    key?: string;
    /**
     * Data dử dụng cho trường hợp không rõ kiểu dữ liệu là loại nào
     * Tương ứng với từng key thì set lại kiểu dữ liệu cho data này tương ứng
     */
    data?: T;
}