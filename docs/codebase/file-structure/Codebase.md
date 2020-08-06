# Codebase

> [Codebase là gì?](https://whatis.techtarget.com/definition/codebase-code-base)

![](Codebase/Screen%20Shot%202020-07-28%20at%2009.18.20.png ':size=30%')
_Cấu trúc thư mục của Backend_

Hình trên thể hiện cấu trúc thư mục của Backend, về cơ bản thì chúng ta chỉ cần chú ý đến 3 thư mục chính là **app/rest** , **app/schema** và **app/model**.

- `src/app/rest`: Restful endpoint, đã được tích hợp flask-restplus để dễ dàng tạo 1 restful endpoint. (Tài liệu [Flask-RESTPlus 0.13.0 documentation](https://flask-restplus.readthedocs.io/en/stable/))
- `src/app/schema`: Graphql endpoint, tất cả query và mutation được cấu hình trong thư mục này, đã được tích hợp Graphene. (Tài liệu [Graphene-Python](https://graphene-python.org/))
- `src/app/model`: Thư mục này định nghĩa tất cả model class sử dụng cho cả rest và graphql.
- `src/app/translations`: Thư mục chứa tẩt cả file ngôn ngữ của Backend, đã được tích hợp flask-babel để dễ dàng tạo và translate nhiều ngôn ngữ, nhận dạng ngôn ngữ từ client qua header "Accept-Language". (Tài liệu [Flask-Babel — Flask Babel 1.0 documentation](https://pythonhosted.org/Flask-Babel/))
- `src/app/config`: Thư mục chứa file cấu hình cho hệ thống Backend.
- `src/app/upload`: Thư mục chứa tất cả file được upload từ client vào Backend.
- `src/migrations`: Thư mục chứa migrations sql file của hệ thống. (Tài liệu [Flask-Migrate — Flask-Migrate documentation](https://flask-migrate.readthedocs.io/en/latest/))
- `src/template`: Thư mục chứa Frontend của hệ thống, sử dụng cấu trúc mặc định được tạo từ Vue-cli và được viết bằng Typescript.(Tài liệu [Vue Framework.](https://vuejs.org/))

![](Codebase/Screen%20Shot%202020-08-05%20at%2015.10.57.png ':size=30%')
_Cấu trúc thư mục của Frontend_

#graphue #graphue/codebase #graphue/codebase/file-structure
