# REST endpoint

> [REST là gì?](https://movan.vn/rest-api-gioi-thieu-rest-api/)

Backend hệ thống chủ yếu sử dụng Graphql làm phương thức giao tiếp với client, nhưng trong 1 số trường hợp sẽ cần những endpoint khác với những method khác, ví dụ như khi đăng nhập vào Google, redirect URL của google trả về là 1 đường dẫn với method GET và kèm theo nhiều tham số, còn hệ thống sử dụng Graphql chỉ với 1 giao thức là POST, cho nên trong trường hợp này thì tốt nhất nên xử lý trong giao thức rest cho codebase trở nên tách biệt và rõ ràng.

Mặc định hệ thống đc thiết kế có 2 rest endpoint cho việc đăng nhập dùng tài khoản google và cài đặt hệ thống khi lần đầu sử dụng.

![](REST%20endpoint/Screen%20Shot%202020-08-05%20at%2015.27.14.png ':size=30%')
_src/app/rest_

Hệ thống đã được tích hợp thư viện Flask-RESTPlus nên cấu trúc về những endpoint có thể theo cấu trúc mà thư viện hỗ trợ.

Tài liệu [Flask-RESTPlus 0.13.0 documentation](https://flask-restplus.readthedocs.io/en/stable/)

Sau khi thêm custom endpoint thì bạn cần phải khai báo những endpoint đó trong file `src/app/__init__.py` để hệ thống nhận biết.
Ví dụ về khai báo thêm 2 endpoint `/oauth` và `/install`

```python
# src/app/__init__.py

from .rest import rest
from .rest.oauth.google import ns as google_callback_namespace
from .rest.install.default import ns as install_namespace
...
rest.add_namespace(google_callback_namespace)
rest.add_namespace(install_namespace)
```

FLask-RESTPlus đã tích hợp sẵn Swagger cho API documentation, đường dẫn mặc định Swagger [http://localhost:5000/doc](http://localhost:5000/doc) hoặc có thể thay đổi bằng cách sửa giá trị của biến `REST_DOC_URI` trong file `src/app/config/__init__.py`

![](REST%20endpoint/Screen%20Shot%202020-08-05%20at%2015.49.52.png ':size=100%')
_Swagger documentation for REST endpoint_

#graphue/codebase #graphue/codebase/backend #graphue/codebase/backend/rest
