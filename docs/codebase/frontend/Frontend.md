# Frontend

> [Vue là gỉ?](https://vi.vuejs.org/v2/guide/)  
> [Typescript là gì?](https://viblo.asia/p/gioi-thieu-typescript-su-khac-nhau-giua-typescript-va-javascript-LzD5dDn05jY)

Hệ thống sử dụng Vue làm framework để xây dựng UI, cấu trúc thư mục được tạo từ [vue-cli](https://cli.vuejs.org/) sử dụng ngôn ngữ Typescript.

![](Frontend/Screen%20Shot%202020-08-05%20at%2015.10.57.png ':size=30%')
_src/template_

Những thư mục được thêm:

- `src/template/src/config`: Thư mục chứa file setting cho hệ thống.
- `src/template/src/core`: Thư mục chứa file boostrap và lazy load 1 số component.
- `src/template/src/graphql`: Thư mục chứa những file khai báo query/mutation để kết nối đến server.
- `src/template/src/helper`: Thư mục chứa những file hỗ trợ khai báo apollo service, axios service và những hàm hỗ trợ cho việc phân trang, set document title, get base64 ...
- `src/template/src/layout`: Thư mục chứa cấu hình layout khác nhau. Ví dụ trang Login thì sẽ dùng layout **Login**, trang Admin sẽ dùng Layout **Admin**
- `src/template/src/locales`: Thư mục chứa những file đa ngôn ngữ.
- `src/template/src/views`: Mỗi trang sẽ tương ứng với mỗi thư mục trong đây.

Hệ thống sử dụng Vuex làm store để lưu trạng thái dữ liệu của những component.

### Cài đặt

```bash
# Cài đặt và start dev server
cd src/template
yarn
yarn serve
```

![](Frontend/Screen%20Shot%202020-08-05%20at%2018.09.54.png)
_Start dev server thành công_

- Node v12.16.0
- Yarn 1.22.4

#graphue/codebase #graphue/codebase
#graphue/codebase/frontend
