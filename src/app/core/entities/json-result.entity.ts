export class JsonResultEntity<T> {
  //true: thành công, false: thất bại
  status = false;
  //string|object|Array,//Nội dung thông báo lỗi
  msg: string | { [key: string]: string } = '';
  //Kết quả trả về từ API
  data: T | null = null;
  total_row = 0;
}